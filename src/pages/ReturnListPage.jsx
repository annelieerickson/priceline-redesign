import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Box, Flex, Text } from 'pcln-design-system'
import Button from '../components/Button'
import DepartureSummary from '../components/DepartureSummary'
import TopNav from '../components/TopNav'
import ProgressHeader from '../components/ProgressHeader'
import FlightFilters from '../components/FlightFilters'
import FlightCard from '../components/FlightCard'
import FareOptions from '../components/FareOptions'
import FareRail from '../components/FareRail'
import PageContainer from '../components/PageContainer'
import ConfirmDialog from '../components/ConfirmDialog'
import KeepCabinBar from '../components/KeepCabinBar'
import { returnFlights } from '../data/flights'
import { featureFlags } from '../config/featureFlags'
import { useBooking } from '../context/BookingContext'

const GROUPS = ['Recommended Flights to Chicago', 'Other Flights to Chicago']
const showFareRail = featureFlags.fareOptionsView === 'rail'

// Sized to sit beside the "Select Return Flight" heading
const ViewToggleButton = styled(Button)`
  flex-shrink: 0;
  height: 36px;
  padding: 0 16px;
  font-size: 15px;
`

export default function ReturnListPage() {
  const navigate = useNavigate()
  const { search, departure, bundleMode, setBundleMode, setReturnSelection, resetTrip } =
    useBooking()

  const [keepBarFlightId, setKeepBarFlightId] = useState(null)
  const [faresFlight, setFaresFlight] = useState(null)
  const [confirmFlight, setConfirmFlight] = useState(null)
  const [confirmFare, setConfirmFare] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (!departure) {
    navigate('/departure')
    return null
  }

  const isBundleEligible = (flight) => flight.bundledRoundTrip && bundleMode === 'bundled'

  // Bundled mode compares add-on deltas among bundle flights; otherwise full prices
  const comparable =
    bundleMode === 'bundled' ? returnFlights.filter((f) => f.bundledRoundTrip) : returnFlights
  const comparePrice = (f) => (bundleMode === 'bundled' ? f.bundleDelta : f.separatePrice)
  const cheapestPrice = Math.min(...comparable.map(comparePrice))
  const isCheapest = (f) => comparable.includes(f) && comparePrice(f) === cheapestPrice

  // Clicking a flight whose cabin bar or fares are already showing collapses them
  const handleSelectFlight = (flight) => {
    const isOpen = keepBarFlightId === flight.id || faresFlight?.id === flight.id
    setKeepBarFlightId(!isOpen && isBundleEligible(flight) ? flight.id : null)
    setFaresFlight(!isOpen && !isBundleEligible(flight) ? flight : null)
  }

  const openConfirm = (flight, fare) => {
    setConfirmFlight(flight)
    setConfirmFare(fare)
    setConfirmOpen(true)
  }

  const handleKeepCabin = (flight) => {
    const fare = {
      ...departure.fare,
      price: departure.fare.price + (flight.bundleDelta || 0),
    }
    openConfirm(flight, fare)
  }

  const handleSeeOtherOptions = (flight) => {
    setKeepBarFlightId(null)
    setFaresFlight(flight)
  }

  const handleSelectFare = (fare) => {
    openConfirm(faresFlight, fare)
    setFaresFlight(null)
  }

  const handleBack = () => {
    setConfirmOpen(false)
    setConfirmFlight(null)
    setConfirmFare(null)
  }

  const handleContinue = () => {
    setConfirmOpen(false)
    setReturnSelection({ flight: confirmFlight, fare: confirmFare })
    navigate('/checkout')
  }

  const handleChangeDeparture = () => {
    resetTrip()
    navigate('/departure')
  }

  const currentStep = keepBarFlightId || faresFlight || confirmFlight ? 3 : 2

  const dropdownFor = (flight) => {
    if (keepBarFlightId === flight.id) {
      return (
        <KeepCabinBar
          cabinName={departure.fare.name}
          onKeep={() => handleKeepCabin(flight)}
          onSeeOptions={() => handleSeeOtherOptions(flight)}
        />
      )
    }
    if (!showFareRail && faresFlight?.id === flight.id) {
      return (
        <FareOptions
          flight={flight}
          onSelectFare={handleSelectFare}
          onHide={() => setFaresFlight(null)}
        />
      )
    }
    return null
  }

  return (
    <Box>
      <TopNav />
      <ProgressHeader currentStep={currentStep} />
      <Flex>
        <Box style={{ flex: 1, minWidth: 0 }}>
          <PageContainer py={4}>
            <FlightFilters flights={returnFlights} airportKey="to" />
            {/* Capped to the wireframe's results width */}
            <Box style={{ flex: 1, minWidth: 0, maxWidth: 800 }}>
              <DepartureSummary
                flight={departure.flight}
                fare={departure.fare}
                onChangeFlight={handleChangeDeparture}
              />

              <Flex justifyContent="space-between" alignItems="center" mb={1}>
                <Text textStyle="heading3">Select Return Flight</Text>
                <ViewToggleButton
                  onClick={() => setBundleMode(bundleMode === 'bundled' ? 'separate' : 'bundled')}
                >
                  {bundleMode === 'bundled' ? 'View all flights' : 'View bundled deals'}
                </ViewToggleButton>
              </Flex>
              <Text textStyle="caption" color="text.light" mb={3}>
                {bundleMode === 'bundled' ? 'Showing bundled deals' : 'Showing all flights'} to{' '}
                {search.from.city} ({search.from.code}), {search.returnDate}
              </Text>

              {GROUPS.map((group) => {
                const flights = returnFlights.filter((f) => f.group === group)
                if (!flights.length) return null
                return (
                  <Box key={group} mb={4}>
                    <Text textStyle="paragraphBold" mb={2}>
                      {group}
                    </Text>
                    {flights.map((flight) => {
                      const bundled = isBundleEligible(flight)
                      return (
                        <FlightCard
                          key={flight.id}
                          flight={flight}
                          selected={keepBarFlightId === flight.id || faresFlight?.id === flight.id}
                          onClick={() => handleSelectFlight(flight)}
                          priceMain={
                            bundled ? `+$${flight.bundleDelta}` : `$${flight.separatePrice}`
                          }
                          highlightPrice={isCheapest(flight)}
                          tags={[
                            ...(flight.tags ?? []),
                            ...(isCheapest(flight) ? ['Cheapest Option'] : []),
                          ]}
                          bundleLabel={bundled ? 'Bundled Round-Trip' : null}
                          bundleNote={
                            bundled
                              ? `$${flight.bundleFromPrice.toLocaleString()} round-trip for ${search.travelers}`
                              : null
                          }
                          actionSlot={dropdownFor(flight)}
                        />
                      )
                    })}
                  </Box>
                )
              })}
            </Box>
          </PageContainer>
        </Box>

        {showFareRail && (
          <FareRail
            flight={faresFlight}
            isOpen={!!faresFlight}
            onClose={() => setFaresFlight(null)}
            onSelectFare={handleSelectFare}
          />
        )}
      </Flex>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        flight={confirmFlight}
        fare={confirmFare}
        dateLabel={search.returnDate}
        backLabel="Back to Return Flights"
        onBack={handleBack}
        continueLabel="Continue to Checkout"
        onContinue={handleContinue}
      />
    </Box>
  )
}
