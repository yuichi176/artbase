import { z } from 'zod'

export const bookmarkSchema = z.object({
  id: z.string(),
  userId: z.string(),
  exhibitionId: z.string(),
  createdAt: z.string(),
})
export type Bookmark = z.infer<typeof bookmarkSchema>
