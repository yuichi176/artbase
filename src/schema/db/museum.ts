import { z } from 'zod'

const venueTypes = ['美術館', '博物館', 'ギャラリー', 'イベントスペース', '商業施設'] as const
export const venueTypeSchema = z.enum(venueTypes)
export type VenueType = z.infer<typeof venueTypeSchema>
export const venueTypeOptions = venueTypes.map((type) => ({
  label: type,
  value: type,
}))

const areas = [
  '上野',
  '浅草・押上（スカイツリー）',
  '銀座・丸の内',
  '京橋・日本橋・八重洲',
  '表参道・青山・外苑前',
  '渋谷',
  '恵比寿・目黒・白金',
  '六本木・乃木坂・麻布台',
  '新宿・初台・四ツ谷・早稲田',
  '池袋・目白・護国寺',
  '水道橋・後楽園',
  '品川・天王洲アイル',
  '清澄白河・両国・蔵前',
  '汐留・新橋・虎ノ門',
  'お台場・豊洲・有明',
  '中野・高円寺・吉祥寺',
  '三軒茶屋・二子玉川・世田谷',
  '武蔵野・三鷹・調布',
  '小金井・府中・多摩',
  '立川・八王子・多摩センター',
] as const
export const areaSchema = z.enum(areas)
export type Area = z.infer<typeof areaSchema>
export const areaOptions = areas.map((area) => ({
  label: area,
  value: area,
}))

export type RawMuseum = {
  name: string
  address: string
  access: string
  openingInformation: string
  venueType: VenueType
  area: Area
  officialUrl: string
  scrapeUrl: string
}
