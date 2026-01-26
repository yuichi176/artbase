# Firestore Data Modeling Guidelines

## Many-to-Many Relationship Design Pattern

When implementing many-to-many relationships between users and entities (exhibitions, products, posts, etc.), adopt the **intermediate collection pattern**.

### Recommended Design Approach

- Create a dedicated intermediate collection (junction table) instead of storing entity IDs as arrays in documents
- Design each relationship as a single document (userId + entityId pair)
- Enable bidirectional queries and flexible addition of attributes in the future

### Collection Structure Example: Bookmark Feature

Example structure with a top-level `bookmarks` collection:

```
collections/
├── users/
│   └── {uid}
│       ├── email: string
│       ├── displayName: string
│       └── ...
├── exhibitions/
│   └── {exhibitionId}
│       ├── title: string
│       ├── venue: string
│       └── ...
└── bookmarks/ (intermediate collection)
    └── {bookmarkId}  // Example: "{userId}_{exhibitionId}" ensures uniqueness
        ├── userId: string
        ├── exhibitionId: string
        └── createdAt: Timestamp
```

### Document ID Design

#### Composite ID Pattern (Recommended)
```typescript
const bookmarkId = `${userId}_${exhibitionId}`
```

**Advantages:**
- Ensures uniqueness constraint at the application layer
- Fast existence check for specific relationships (directly check with `.doc(bookmarkId).get()`)
- Easy prevention of duplicate entries

**Considerations:**
- Be aware of ID length limit (1500 bytes, usually not an issue)

#### Auto-generated ID Pattern
```typescript
const bookmarkRef = db.collection('bookmarks').doc()  // Firestore auto-generates
```

**Advantages:**
- Simple implementation
- No need to worry about ID collisions

**Disadvantages:**
- Need to implement uniqueness constraint separately (existence check via query → transaction processing)
- Requires additional query for existence check

### Why Not Array or Subcollection Patterns?

#### ❌ Storing entityId array in users document

```typescript
// Anti-pattern
users/{uid}
  preferences:
    bookmarkedExhibitions: [exhibitionId1, exhibitionId2, ...]  // ❌
```

**Issues:**
- Risk of approaching 1MB document size limit as array grows
- Difficult to reverse-query "users who bookmarked a specific entity"
- Hard to add metadata (creation time, memo, etc.) to individual relationships
- Complex concurrency control when updating arrays

#### ❌ Storing userId array in entity document

```typescript
// Anti-pattern
exhibitions/{exhibitionId}
  bookmarkedBy: [userId1, userId2, ...]  // ❌
```

**Issues:**
- Popular entities can easily reach 1MB limit with many user IDs
- High write cost and contention when updating large arrays
- Lacks scalability

#### △ users/{uid}/bookmarks Subcollection

```typescript
users/{uid}/bookmarks/{exhibitionId}
  exhibitionId: string
  createdAt: Timestamp
```

**Advantages:**
- Easy to retrieve "bookmarks list for a specific user"
- Clear data separation per user

**Disadvantages:**
- Requires [Collection Group Query](https://firebase.google.com/docs/firestore/query-data/queries#collection-group-query) to retrieve "users who bookmarked a specific entity"
- Slightly complex security rules and index design
- Can be cumbersome for analytics and reporting in admin interfaces

**Conclusion:**
When bidirectional queries are needed and future analysis/expansion is considered, the **top-level intermediate collection pattern** provides the best balance.

### Query Pattern Examples

#### Get bookmark list for a specific user

```typescript
const bookmarksSnapshot = await db
  .collection('bookmarks')
  .where('userId', '==', uid)
  .orderBy('createdAt', 'desc')
  .get()

const exhibitionIds = bookmarksSnapshot.docs.map(doc => doc.data().exhibitionId)
```

#### Get list of users who bookmarked a specific entity

```typescript
const bookmarksSnapshot = await db
  .collection('bookmarks')
  .where('exhibitionId', '==', exhibitionId)
  .get()

const userIds = bookmarksSnapshot.docs.map(doc => doc.data().userId)
```

#### Check if a specific relationship exists (composite ID case)

```typescript
const bookmarkId = `${userId}_${exhibitionId}`
const bookmarkDoc = await db.collection('bookmarks').doc(bookmarkId).get()
const isBookmarked = bookmarkDoc.exists
```

### Adding Metadata

The intermediate collection pattern makes it easy to add additional information to relationships:

```typescript
bookmarks/{bookmarkId}
  userId: string
  exhibitionId: string
  createdAt: Timestamp
  memo: string           // User's memo
  notificationEnabled: boolean  // Notification enabled/disabled
```

### Performance Optimization

#### Creating Indexes

Firestore requires appropriate indexes for composite queries:

```
bookmarks collection:
  - Index: userId (asc), createdAt (desc)
  - Index: exhibitionId (asc), createdAt (desc)
```

Create indexes in Firebase Console or with Firebase CLI:

```bash
firebase firestore:indexes
```

#### Batch Processing

Use pagination when retrieving large numbers of bookmarks:

```typescript
const LIMIT = 50

const bookmarksSnapshot = await db
  .collection('bookmarks')
  .where('userId', '==', uid)
  .orderBy('createdAt', 'desc')
  .limit(LIMIT)
  .get()
```

### Security Rules Example

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // bookmarks collection rules
    match /bookmarks/{bookmarkId} {
      // Allow read only for own bookmarks
      allow read: if request.auth != null
                  && resource.data.userId == request.auth.uid;

      // Allow create/delete only for own bookmarks
      allow create: if request.auth != null
                    && request.resource.data.userId == request.auth.uid
                    && request.resource.data.keys().hasAll(['userId', 'exhibitionId', 'createdAt']);

      allow delete: if request.auth != null
                    && resource.data.userId == request.auth.uid;

      // Disallow updates (use delete → recreate instead)
      allow update: if false;
    }
  }
}
```

### Implementation Checklist

Items to verify when implementing the intermediate collection pattern:

- [ ] Create top-level intermediate collection (e.g., `bookmarks`)
- [ ] Adopt composite ID (`{userId}_{entityId}`) for document ID
- [ ] Create necessary indexes in Firebase Console
- [ ] Configure authentication/authorization appropriately in security rules
- [ ] Implement toggle operation (add/delete) in API endpoint
- [ ] Implement optimistic UI updates on client side (for better UX)
- [ ] Implement error handling and rollback processing

### References

- [Firestore Best Practices for Data Modeling](https://firebase.google.com/docs/firestore/best-practices)
- [Firestore Query Limitations](https://firebase.google.com/docs/firestore/query-data/queries#query_limitations)
- [Collection Group Queries](https://firebase.google.com/docs/firestore/query-data/queries#collection-group-query)