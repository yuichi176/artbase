import { z } from 'zod'
import { areaSchema, venueTypeSchema } from '@/schema/db/museum'
import { exhibitionSchema } from '@/schema/ui/exhibition'

export const museumSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  access: z.string(),
  openingInformation: z.string(),
  venueType: venueTypeSchema,
  area: areaSchema,
  officialUrl: z.string(),
  exhibitions: z.array(exhibitionSchema),
})
export type Museum = z.infer<typeof museumSchema>
