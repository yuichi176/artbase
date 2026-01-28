import { z } from 'zod'
import { subscriptionTierSchema } from '@/schema/db/user'

export const userSchema = z.object({
  uid: z.string(),
  email: z.string(),
  displayName: z.string().nullable(),
  subscriptionTier: subscriptionTierSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type User = z.infer<typeof userSchema>
