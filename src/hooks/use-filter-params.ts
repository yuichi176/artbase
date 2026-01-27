import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { Area, VenueType, venueTypeSchema, areaSchema } from '@/schema/db/museum'
import { OngoingStatusFilter } from '@/schema/ui/exhibition'

interface FilterParams {
  selectedVenueTypes: VenueType[]
  selectedAreas: Area[]
  selectedMuseumNames: string[]
  selectedOngoingStatus: OngoingStatusFilter
  searchQuery: string
}

interface FilterActions {
  setSelectedVenueTypes: (value: VenueType[]) => void
  setSelectedAreas: (value: Area[]) => void
  setSelectedMuseumNames: (value: string[]) => void
  setSelectedOngoingStatus: (value: OngoingStatusFilter) => void
  setSearchQuery: (value: string) => void
  resetFilters: () => void
}

/**
 * Parse comma-separated values from URL and validate against a Zod schema
 */
const parseArrayParam = <T>(
  value: string | null,
  schema: { safeParse: (val: unknown) => { success: boolean; data?: T } },
): T[] => {
  if (!value) return []

  return value
    .split(',')
    .map((item) => {
      const result = schema.safeParse(item)
      return result.success ? result.data : null
    })
    .filter((item): item is T => item !== null)
}

/**
 * Parse ongoing status filter from URL
 */
const parseOngoingStatus = (value: string | null): OngoingStatusFilter => {
  if (value === 'ongoing' || value === 'upcoming' || value === 'end') {
    return value
  }
  return 'all'
}

/**
 * Custom hook to manage filter state synchronized with URL query parameters
 */
export const useFilterParams = (): FilterParams & FilterActions => {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Initialize state from URL
  const [selectedVenueTypes, setSelectedVenueTypes] = useState<VenueType[]>(() =>
    parseArrayParam(searchParams.get('venueTypes'), venueTypeSchema),
  )
  const [selectedAreas, setSelectedAreas] = useState<Area[]>(() =>
    parseArrayParam(searchParams.get('areas'), areaSchema),
  )
  const [selectedMuseumNames, setSelectedMuseumNames] = useState<string[]>(() => {
    const value = searchParams.get('museums')
    return value ? value.split(',') : []
  })
  const [selectedOngoingStatus, setSelectedOngoingStatus] = useState<OngoingStatusFilter>(() =>
    parseOngoingStatus(searchParams.get('status')),
  )
  const [searchQuery, setSearchQuery] = useState<string>(() => searchParams.get('q') ?? '')

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams()

    if (selectedVenueTypes.length > 0) {
      params.set('venueTypes', selectedVenueTypes.join(','))
    }

    if (selectedAreas.length > 0) {
      params.set('areas', selectedAreas.join(','))
    }

    if (selectedMuseumNames.length > 0) {
      params.set('museums', selectedMuseumNames.join(','))
    }

    if (selectedOngoingStatus !== 'all') {
      params.set('status', selectedOngoingStatus)
    }

    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim())
    }

    const paramsString = params.toString()
    const newUrl = paramsString ? `?${paramsString}` : window.location.pathname

    router.replace(newUrl, { scroll: false })
  }, [
    selectedVenueTypes,
    selectedAreas,
    selectedMuseumNames,
    selectedOngoingStatus,
    searchQuery,
    router,
  ])

  const resetFilters = useCallback(() => {
    setSelectedVenueTypes([])
    setSelectedAreas([])
    setSelectedMuseumNames([])
    setSelectedOngoingStatus('all')
    setSearchQuery('')
  }, [])

  return {
    selectedVenueTypes,
    selectedAreas,
    selectedMuseumNames,
    selectedOngoingStatus,
    searchQuery,
    setSelectedVenueTypes,
    setSelectedAreas,
    setSelectedMuseumNames,
    setSelectedOngoingStatus,
    setSearchQuery,
    resetFilters,
  }
}
