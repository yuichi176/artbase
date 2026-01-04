import { Exhibition } from '@/schema/exhibition'

export type VenueType = '美術館' | '博物館' | 'ギャラリー'

export type RawMuseum = {
  name: string
  address: string
  access: string
  openingInformation: string
  venueType: VenueType
  officialUrl: string
  scrapeUrl: string
}

export type Museum = {
  name: string
  address: string
  access: string
  openingInformation: string
  venueType: VenueType
  officialUrl: string
  exhibitions: Exhibition[]
}
