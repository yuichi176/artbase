import { Skeleton } from '@/components/shadcn-ui/skeleton'

export function MuseumCardSkeleton() {
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-background">
      {/* Header */}
      <div className="bg-muted/65 border-b-1 border-border py-2 px-3 md:py-3 md:px-5 flex flex-col gap-2 md:gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-16 rounded-lg" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-4" />
          </div>
        </div>

        {/* Area */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Access */}
        <Skeleton className="h-4 w-full" />
      </div>

      {/* Exhibitions */}
      <div className="p-2 space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="border border-border rounded-lg p-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0 space-y-2">
                <Skeleton className="h-5 w-full" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
              <Skeleton className="h-4 w-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function MuseumListSkeleton() {
  return (
    <div className="space-y-4 md:columns-2 xl:columns-3 md:gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="break-inside-avoid">
          <MuseumCardSkeleton />
        </div>
      ))}
    </div>
  )
}
