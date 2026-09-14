import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Close } from 'pcln-icons'
import { fareOptions } from '../data/flights'
import { useBooking } from '../context/BookingContext'
import { formatTime } from '../utils/format'
import AirlineLogo from './AirlineLogo'
import RailFareCard from './RailFareCard'

const RAIL_WIDTH = 340
const BASE_FARE_PRICE = Math.min(...fareOptions.map((f) => f.price))

// Full-height column flush with the right edge of the page body. The slot
// animates its width so the content beside it smoothly narrows to make room;
// overflow: clip (unlike hidden) keeps the sticky panel inside it working.
const Slot = styled.div`
  display: flex;
  justify-content: flex-end;
  flex: 0 0 auto;
  width: ${(p) => (p.$open ? RAIL_WIDTH : 0)}px;
  overflow: clip;
  transition: width 250ms ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

const Panel = styled.aside`
  position: sticky;
  top: 0;
  align-self: flex-start;
  flex-shrink: 0;
  width: ${RAIL_WIDTH}px;
  height: 100vh;
  max-height: 100%;
  overflow-y: auto;
  padding: 16px 14px 20px;
  border-left: 1px solid #c0cad5;
  background: #fff;
  color: #001833;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`

const Airline = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  font-size: 18px;
`

const CloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;

  &:hover {
    background: #e8f2ff;
  }
  &:focus-visible {
    outline: 2px solid #0068ef;
    outline-offset: 2px;
  }
`

const Times = styled.h2`
  margin: 12px 0 0;
  font-size: 26px;
  font-weight: 700;
  line-height: 1.15;
  outline: none;
`

const Route = styled.p`
  margin: 2px 0 14px;
  font-size: 17px;
`

const Fares = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export default function FareRail({ flight, isOpen, onClose, onSelectFare }) {
  const { search } = useBooking()
  const headingRef = useRef(null)

  // Keep rendering the last flight while the rail animates closed
  const [shownFlight, setShownFlight] = useState(flight)
  if (flight && flight !== shownFlight) setShownFlight(flight)

  useEffect(() => {
    if (isOpen) headingRef.current?.focus({ preventScroll: true })
  }, [isOpen, flight])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !e.defaultPrevented) onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Fare ladder is defined for the cheapest flight; shift it by this flight's premium
  const flightPrice = shownFlight?.startingPrice ?? shownFlight?.separatePrice ?? BASE_FARE_PRICE
  const offset = flightPrice - BASE_FARE_PRICE

  return (
    <Slot $open={isOpen} aria-hidden={!isOpen} inert={isOpen ? undefined : ''}>
      {shownFlight && (
        <Panel aria-labelledby="fare-rail-heading">
          <Header>
            <Airline>
              <AirlineLogo flight={shownFlight} size={32} />
              {shownFlight.airline}
            </Airline>
            <CloseButton type="button" aria-label="Close fare options" onClick={onClose}>
              <Close size={24} color="text.base" />
            </CloseButton>
          </Header>

          <Times id="fare-rail-heading" ref={headingRef} tabIndex={-1}>
            {formatTime(shownFlight.departTime)}-{formatTime(shownFlight.arriveTime)}
          </Times>
          <Route>
            {shownFlight.from.code} &rarr; {shownFlight.to.code} ({shownFlight.duration})
          </Route>

          <Fares>
            {fareOptions.map((fare) => {
              const price = fare.price + offset
              return (
                <RailFareCard
                  key={fare.id}
                  fare={{ ...fare, price }}
                  highlightPrice={fare.price === BASE_FARE_PRICE}
                  note={
                    shownFlight.bundledRoundTrip
                      ? `$${(fare.bundleFromPrice + offset * search.travelers).toLocaleString()} round-trip for ${search.travelers}`
                      : null
                  }
                  onSelect={onSelectFare}
                />
              )
            })}
          </Fares>
        </Panel>
      )}
    </Slot>
  )
}
