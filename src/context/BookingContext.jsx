import { createContext, useContext, useMemo, useState } from 'react'
import { defaultSearch } from '../data/flights'

const BookingContext = createContext(null)

export function BookingProvider({ children }) {
  const [search, setSearch] = useState(defaultSearch)
  const [departure, setDeparture] = useState(null) // { flight, fare }
  const [bundleMode, setBundleMode] = useState(null) // 'bundled' | 'separate'
  const [returnSelection, setReturnSelection] = useState(null) // { flight, fare }
  // Set once a search is submitted; shows "Pick up where you left off" on the search page
  const [hasSearched, setHasSearched] = useState(false)
  // Kept here so the filter sidebar stays collapsed between the departure and return pages
  const [filtersCollapsed, setFiltersCollapsed] = useState(false)

  const resetTrip = () => {
    setDeparture(null)
    setBundleMode(null)
    setReturnSelection(null)
  }

  const value = useMemo(
    () => ({
      search,
      setSearch,
      departure,
      setDeparture,
      bundleMode,
      setBundleMode,
      returnSelection,
      setReturnSelection,
      resetTrip,
      hasSearched,
      setHasSearched,
      filtersCollapsed,
      setFiltersCollapsed,
    }),
    [search, departure, bundleMode, returnSelection, hasSearched, filtersCollapsed],
  )

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used within BookingProvider')
  return ctx
}
