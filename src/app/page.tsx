import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { CalendarDays } from 'lucide-react'

export default function Home() {
  return (
    <main className="py-15 px-15">
      <h1 className="font-ubuntu font-bold text-5xl mb-10">Artbase Tokyo</h1>
      <div className="flex flex-col gap-5">
        {artMuseums.map((museum) => (
          <section className="px-5" key={museum.name}>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-xl font-bold">{museum.name}</h2>
              <Badge>{`${museum.exhibitions.length}件`}</Badge>
            </div>
            <ul className="flex gap-5 flex-wrap">
              {museum.exhibitions.map((exhibition) => (
                <li key={exhibition.id} className="mb-5">
                  <Card className="w-full max-w-sm h-[420px] hover:shadow-lg transition-shadow flex relative">
                    <CardContent className="flex flex-col items-center gap-3 h-full">
                      <div className="w-[200px] h-[282px] overflow-hidden rounded-t-md">
                        <img
                          src={exhibition.imageUrl}
                          alt={`${exhibition.title}のポスター画像`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between p-3 w-full">
                        <a href={exhibition.officialUrl} target="_blank" rel="noopener noreferrer">
                          <span
                            aria-hidden="true"
                            style={{
                              position: 'absolute',
                              inset: 0,
                            }}
                          />
                          <h3 className="text-sm font-semibold mb-2 line-clamp-3">
                            {exhibition.title}
                          </h3>
                        </a>
                        <div className="text-sm text-gray-600 flex gap-2 items-center mt-auto">
                          <CalendarDays size={18} />
                          <p>
                            {exhibition.startDate} 〜 {exhibition.endDate}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  )
}

const artMuseums = [
  {
    name: '国立新美術館',
    exhibitions: [
      {
        id: '1',
        title: 'ブルガリ カレイドス　色彩・文化・技巧',
        startDate: '2025年9月17日(水)',
        endDate: '2025年12月15日(月)',
        imageUrl:
          'https://images.ctfassets.net/j05yk38inose/2Ik0dsxC0IbRp445IiM4QQ/13aad29ccd31030fa241114bf5c972a0/main.jpg?w=784&h=640&q=100',
        officialUrl: 'https://www.nact.jp/exhibition_special/2025/bvlgari_kaleidos/',
      },
      {
        id: '2',
        title: '時代のプリズム：日本で生まれた美術表現 1989-2010',
        startDate: '2025年9月3日(水)',
        endDate: '2025年12月8日(月)',
        imageUrl: 'https://www.nact.jp/exhibition_special/media/POTR_banner_RGB0620-2-02.jpg',
        officialUrl: 'https://www.nact.jp/exhibition_special/2025/bvlgari_kaleidos/',
      },
      {
        id: '3',
        title: 'テート美術館 ― YBA & BEYOND 世界を変えた90s英国アート',
        startDate: '2025年9月17日(水)',
        endDate: '2025年12月15日(月)',
        imageUrl:
          'https://images.ctfassets.net/j05yk38inose/52E7cprwm0cE7fx3uuUvjW/dc23d26d5519d6ff5ec7ac338f466b1b/YBA_WEB_A4-2_%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__.jpg?w=784&h=640&q=100',
        officialUrl: 'https://www.ybabeyond.jp/',
      },
    ],
  },
  {
    name: '国立西洋美術館',
    exhibitions: [
      {
        id: '4',
        title: 'コレクション・イン・フォーカス｜Collection in FOCUS',
        startDate: '2025年9月17日(水)',
        endDate: '2025年12月15日(月)',
        imageUrl: 'https://www.nmwa.go.jp/jp/exhibitions/img/2023CinF.png',
        officialUrl: 'https://www.nmwa.go.jp/jp/exhibitions/2025CinF.html',
      },
      {
        id: '5',
        title: 'ピカソの人物画',
        startDate: '2025年9月17日(水)',
        endDate: '2025年12月15日(月)',
        imageUrl: 'https://www.nmwa.go.jp/jp/exhibitions/img/2025picasso.png',
        officialUrl: 'https://www.nmwa.go.jp/jp/exhibitions/2025picasso.html',
      },
    ],
  },
]
