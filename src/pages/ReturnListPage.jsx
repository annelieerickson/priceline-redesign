import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Flex, Text } from 'pcln-design-system'
import CollapsibleSection from '../components/CollapsibleSection'
import DepartureSummary from '../components/DepartureSummary'
import InfoTooltip from '../components/InfoTooltip'
import TopNav from '../components/TopNav'
import ProgressHeader from '../components/ProgressHeader'
import FlightFilters from '../components/FlightFilters'
import FlightCard from '../components/FlightCard'
import FareOptions from '../components/FareOptions'
import FareRail from '../components/FareRail'
import PageContainer from '../components/PageContainer'
import ConfirmDialog from '../components/ConfirmDialog'
import KeepCabinBar from '../components/KeepCabinBar'
import { getReturnFlights, returnFlights } from '../data/flights'
import { featureFlags } from '../config/featureFlags'
import { useBooking } from '../context/BookingContext'

const GROUPS = ['Bundled Flights to Chicago', 'Other Flights to Chicago']
// The first group holds the flights bundled with the departure
const BUNDLED_GROUP = GROUPS[0]
const showFareRail = featureFlags.fareOptionsView === 'rail'

// Bundled flights are priced as an add-on to the departure and separate flights at
// full price, so each section gets its own cheapest option. Prices are the same
// whichever airline getReturnFlights() puts the bundled deals on.
const cheapestBundleDelta = Math.min(
  ...returnFlights.filter((f) => f.bundledRoundTrip).map((f) => f.bundleDelta),
)
const cheapestSeparatePrice = Math.min(
  ...returnFlights.filter((f) => !f.bundledRoundTrip).map((f) => f.separatePrice),
)
const isCheapest = (f) =>
  f.bundledRoundTrip
    ? f.bundleDelta === cheapestBundleDelta
    : f.separatePrice === cheapestSeparatePrice

export default function ReturnListPage() {
  const navigate = useNavigate()
  const { search, departure, setReturnSelection, resetTrip } = useBooking()

  const [keepBarFlightId, setKeepBarFlightId] = useState(null)
  const [faresFlight, setFaresFlight] = useState(null)
  const [confirmFlight, setConfirmFlight] = useState(null)
  const [confirmFare, setConfirmFare] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  // The cheapest bundled return is offered on the departure's airline
  const flights = useMemo(
    () => getReturnFlights(departure?.flight.airline),
    [departure?.flight.airline],
  )

  if (!departure) {
    navigate('/departure')
    return null
  }

  // Clicking a flight whose cabin bar or fares are already showing collapses them.
  // Bundled flights ask whether to keep the departure's cabin; others show all fares.
  const handleSelectFlight = (flight) => {
    const isOpen = keepBarFlightId === flight.id || faresFlight?.id === flight.id
    setKeepBarFlightId(!isOpen && flight.bundledRoundTrip ? flight.id : null)
    setFaresFlight(!isOpen && !flight.bundledRoundTrip ? flight : null)
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

  // The keep-cabin question hangs below the card's price column (FlightCard attachedSlot)
  const keepBarFor = (flight) =>
    keepBarFlightId === flight.id ? (
      <KeepCabinBar
        cabinName={departure.fare.name}
        onKeep={() => handleKeepCabin(flight)}
        onSeeOptions={() => handleSeeOtherOptions(flight)}
      />
    ) : null

  const faresFor = (flight) => {
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

  const renderFlightCards = (flights) =>
    flights.map((flight) => {
      const bundled = flight.bundledRoundTrip
      return (
        <FlightCard
          key={flight.id}
          flight={flight}
          selected={keepBarFlightId === flight.id || faresFlight?.id === flight.id}
          onClick={() => handleSelectFlight(flight)}
          priceMain={bundled ? `+$${flight.bundleDelta}` : `$${flight.separatePrice}`}
          // A bundled add-on price is for keeping the departure cabin, so name it
          priceLabel={bundled ? departure.fare.name : 'Starting at'}
          highlightPrice={isCheapest(flight)}
          tags={[...(flight.tags ?? []), ...(isCheapest(flight) ? ['Cheapest Option'] : [])]}
          bundleLabel={bundled ? 'Bundled Round-Trip' : null}
          bundleNote={
            bundled
              ? `$${flight.bundleFromPrice.toLocaleString()} round-trip for ${search.travelers}`
              : null
          }
          actionSlot={faresFor(flight)}
          attachedSlot={keepBarFor(flight)}
        />
      )
    })

  return (
    <Box>
      <TopNav />
      <ProgressHeader currentStep={currentStep} />
      <Flex>
        <Box style={{ flex: 1, minWidth: 0 }}>
          <PageContainer py={4}>
            <FlightFilters flights={flights} airportKey="to" />
            {/* Capped to the wireframe's results width */}
            <Box style={{ flex: 1, minWidth: 0, maxWidth: 800 }}>
              <DepartureSummary
                flight={departure.flight}
                fare={departure.fare}
                onChangeFlight={handleChangeDeparture}
              />

              <Text textStyle="heading3" mb={1}>
                Select Return Flight
              </Text>
              <Text textStyle="caption" color="text.light" mb={3}>
                {search.to.city} ({search.to.code}) &rarr; {search.from.city} ({search.from.code}),{' '}
                {search.returnDate}
              </Text>

              {GROUPS.map((group) => {
                const groupFlights = flights.filter((f) => f.group === group)
                if (!groupFlights.length) return null

                // Bundled flights sit in a collapsible section (open by default); the
                // tooltip carries the explanation the old bundle popup used to show
                if (group === BUNDLED_GROUP) {
                  return (
                    <CollapsibleSection
                      key={group}
                      title={group}
                      meta={`· ${groupFlights.length} flights`}
                      info={
                        <InfoTooltip label="How bundled flights work">
                          <strong>Your return flight options are bundled with your outbound flight</strong>
                          <p>
                            Priceline bundles outbound and return flights together when it unlocks a
                            lower price &mdash; sometimes on the same airline, sometimes not. If
                            you&rsquo;d rather pick your return flight and cabin class
                            independently, choose from the other flights below, though the price
                            may be higher.
                          </p>
                        </InfoTooltip>
                      }
                    >
                      {renderFlightCards(groupFlights)}
                    </CollapsibleSection>
                  )
                }

                return (
                  <Box key={group} mb={4}>
                    <Text textStyle="paragraphBold" mb={2}>
                      {group}
                    </Text>
                    {renderFlightCards(groupFlights)}
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
