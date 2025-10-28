import { Exhibition } from '@/schema/exhibition'

export type RawMuseum = {
  name: string
  address: string
  access: string
  openingInformation: string
  officialUrl: string
  scrapeUrl: string
}

export type Museum = {
  name: string
  address: string
  access: string
  openingInformation: string
  officialUrl: string
  exhibitions: Exhibition[]
}
