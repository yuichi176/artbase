import { Badge } from '@/components/ui/badge'
import { CalendarDays } from 'lucide-react'

export default function Home() {
  return (
    <main className="py-15 px-15">
      <h1 className="font-ubuntu font-bold text-5xl mb-10">Artbase Tokyo</h1>
      <div className="flex flex-col gap-8">
        {artMuseums.map((museum) => (
          <section className="px-5" key={museum.name}>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-xl font-bold">{museum.name}</h2>
              <Badge>{`${museum.exhibitions.length}件`}</Badge>
            </div>
            <ul
              className="grid grid-cols-3 gap-5"
              style={{
                gridTemplateColumns: 'repeat(auto-fit, 280px);',
              }}
            >
              {museum.exhibitions.map((exhibition) => (
                <li
                  key={exhibition.id}
                  className="row-span-3 grid grid-cols-subgrid gap-3 relative border-1 rounded-md py-3 w-full"
                >
                  <div className="w-full h-[282px] rounded-t-md">
                    <img
                      src={exhibition.imageUrl}
                      alt={`${exhibition.title}のポスター画像`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col justify-between px-3">
                    <a href={exhibition.officialUrl} target="_blank" rel="noopener noreferrer">
                      <span
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          inset: 0,
                        }}
                      />
                      <h3 className="text-sm font-semibold line-clamp-3">{exhibition.title}</h3>
                    </a>
                  </div>
                  <div className="text-xs text-gray-600 flex gap-2 items-center px-3">
                    <CalendarDays size={15} />
                    <p>
                      {exhibition.startDate} 〜 {exhibition.endDate}
                    </p>
                  </div>
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
