import { Exhibition } from '@/schema/exhibition'

export type Museum = {
  name: string
  address: string
  access: string
  openingInformation: string
  officialUrl: string
  exhibitions: Exhibition[]
}
