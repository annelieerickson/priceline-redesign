import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Flex, Text } from 'pcln-design-system'
import TopNav from '../components/TopNav'
import ProgressHeader from '../components/ProgressHeader'
import FlightFilters from '../components/FlightFilters'
import FlightCard from '../components/FlightCard'
import FareOptions from '../components/FareOptions'
import FareRail from '../components/FareRail'
import PageContainer from '../components/PageContainer'
import ConfirmDialog from '../components/ConfirmDialog'
import BundleDialog from '../components/BundleDialog'
import { departureFlights } from '../data/flights'
import { featureFlags } from '../config/featureFlags'
import { useBooking } from '../context/BookingContext'

const GROUPS = ['Recommended Flights to Sarasota', 'Other Flights to Sarasota']
const cheapestPrice = Math.min(...departureFlights.map((f) => f.startingPrice))
const showFareRail = featureFlags.fareOptionsView === 'rail'

export default function DepartureListPage() {
  const navigate = useNavigate()
  const { search, setDeparture, setBundleMode } = useBooking()

  const [selectedFlight, setSelectedFlight] = useState(null)
  const [faresOpen, setFaresOpen] = useState(false)
  const [selectedFare, setSelectedFare] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [bundleOpen, setBundleOpen] = useState(false)

  // Clicking the flight whose fares are already showing collapses them
  const handleSelectFlight = (flight) => {
    if (faresOpen && selectedFlight?.id === flight.id) {
      setFaresOpen(false)
      return
    }
    setSelectedFlight(flight)
    setFaresOpen(true)
  }

  const handleSelectFare = (fare) => {
    setSelectedFare(fare)
    setFaresOpen(false)
    setConfirmOpen(true)
  }

  const handleBack = () => {
    setConfirmOpen(false)
    setSelectedFlight(null)
    setSelectedFare(null)
  }

  const handleContinue = () => {
    setConfirmOpen(false)
    setDeparture({ flight: selectedFlight, fare: selectedFare })
    setBundleOpen(true)
  }

  const goToReturn = (mode) => {
    setBundleMode(mode)
    setBundleOpen(false)
    navigate('/return')
  }

  const currentStep = selectedFlight ? 1 : 0

  return (
    <Box>
      <TopNav />
      <ProgressHeader currentStep={currentStep} />
      <Flex>
        <Box style={{ flex: 1, minWidth: 0 }}>
          <PageContainer py={4}>
            <FlightFilters flights={departureFlights} airportKey="from" />
            {/* Capped to the wireframe's results width */}
            <Box style={{ flex: 1, minWidth: 0, maxWidth: 800 }}>
              <Text textStyle="heading3" mb={1}>
                Select Departure Flight
              </Text>
              <Text textStyle="caption" color="text.light" mb={3}>
                {search.from.city} ({search.from.code}) &rarr; {search.to.city} (
                {search.to.code}), {search.departDate}
              </Text>

              {GROUPS.map((group) => {
                const flights = departureFlights.filter((f) => f.group === group)
                if (!flights.length) return null
                return (
                  <Box key={group} mb={4}>
                    <Text textStyle="paragraphBold" mb={2}>
                      {group}
                    </Text>
                    {flights.map((flight) => {
                      const showInlineFares =
                        !showFareRail && faresOpen && selectedFlight?.id === flight.id
                      return (
                        <FlightCard
                          key={flight.id}
                          flight={flight}
                          priceMain={`$${flight.startingPrice}`}
                          highlightPrice={flight.startingPrice === cheapestPrice}
                          tags={[
                            ...(flight.tags ?? []),
                            ...(flight.startingPrice === cheapestPrice ? ['Cheapest Option'] : []),
                          ]}
                          selected={selectedFlight?.id === flight.id}
                          onClick={() => handleSelectFlight(flight)}
                          bundleLabel={flight.bundledRoundTrip ? 'Bundled Round-Trip' : null}
                          bundleNote={
                            flight.bundledRoundTrip
                              ? `$${flight.bundleFromPrice.toLocaleString()} round-trip for ${search.travelers}`
                              : null
                          }
                          actionSlot={
                            showInlineFares ? (
                              <FareOptions
                                flight={flight}
                                onSelectFare={handleSelectFare}
                                onHide={() => setFaresOpen(false)}
                              />
                            ) : null
                          }
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
            flight={selectedFlight}
            isOpen={faresOpen}
            onClose={() => setFaresOpen(false)}
            onSelectFare={handleSelectFare}
          />
        )}
      </Flex>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        flight={selectedFlight}
        fare={selectedFare}
        dateLabel={search.departDate}
        backLabel="Back to Departure Flights"
        onBack={handleBack}
        continueLabel="Continue to Return Flight"
        onContinue={handleContinue}
      />

      <BundleDialog
        open={bundleOpen}
        onOpenChange={setBundleOpen}
        onBrowseSeparately={() => goToReturn('separate')}
        onShowBundled={() => goToReturn('bundled')}
      />
    </Box>
  )
}
