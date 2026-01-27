import { z } from 'zod'

export const favoriteSchema = z.object({
  id: z.string(),
  userId: z.string(),
  museumId: z.string(),
  createdAt: z.string(),
})
export type Favorite = z.infer<typeof favoriteSchema>
