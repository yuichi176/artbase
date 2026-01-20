import 'server-only'

import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

// Initialize Firebase Admin SDK only once (server-side)
function initializeFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApps()[0]
  }

  // Check if environment variables are provided
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY

  if (projectId && clientEmail && privateKey) {
    // Initialize with explicit credentials
    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        // Handle escaped newlines in environment variable
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    })
  }

  // Fall back to Application Default Credentials (ADC)
  // Docs: https://firebase.google.com/docs/admin/setup?hl=ja#initialize-sdk
  return initializeApp()
}

const app = initializeFirebaseAdmin()
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }
