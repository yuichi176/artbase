import { Exhibition } from '@/schema/exhibition'

export type VenueType = '美術館' | '博物館' | 'ギャラリー' | 'イベントスペース'
export const venueTypeOptions = [
  { label: '美術館', value: '美術館' },
  { label: '博物館', value: '博物館' },
  { label: 'ギャラリー', value: 'ギャラリー' },
  { label: 'イベントスペース', value: 'イベントスペース' },
] satisfies { label: string; value: VenueType }[]

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
