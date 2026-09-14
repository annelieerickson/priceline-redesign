import { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Animate } from 'pcln-design-system'
import { ChevronLeft, ChevronRight, ChevronUp } from 'pcln-icons'
import { fareOptions } from '../data/flights'
import { useBooking } from '../context/BookingContext'
import Button from './Button'
import FareCard from './FareCard'
import { textSize } from '../config/featureFlags'

const CARD_WIDTH = 250
const GAP = 14
const BASE_FARE_PRICE = Math.min(...fareOptions.map((f) => f.price))

// Matches KeepCabinBar's expansion so both in-card dropdowns read as one pattern
const Panel = styled.div`
  margin-top: 16px;
  padding: 14px 16px 6px;
  border-radius: 8px;
  background: #f4f6f8; /* background.light */
  color: #001833;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
`

const Title = styled.h3`
  margin: 0;
  font-size: 17px;
  font-weight: 700;
`

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const ArrowButton = styled(Button)`
  width: 34px;
  height: 34px;
  padding: 0;
`

const HideButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  height: 34px;
  margin-right: 4px;
  padding: 0 6px;
  border: 0;
  background: none;
  color: #0068ef;
  font-family: inherit;
  font-size: ${textSize(14)}px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
  &:focus-visible {
    outline: 2px solid #0068ef;
    outline-offset: 2px;
  }
`

// Fades the right edge while more fares are off-screen, hinting that the row scrolls
const ScrollArea = styled.div`
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 10px;
    width: 48px;
    background: linear-gradient(to right, rgba(244, 246, 248, 0), #f4f6f8);
    opacity: ${(p) => (p.$fade ? 1 : 0)};
    pointer-events: none;
    transition: opacity 150ms ease;
  }
`

const Scroller = styled.ul`
  display: flex;
  gap: ${GAP}px;
  margin: 0;
  padding: 4px 2px 12px;
  list-style: none;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scroll-padding: 0 2px;

  > li {
    display: flex;
    flex: 0 0 ${CARD_WIDTH}px;
    scroll-snap-align: start;
  }
`

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Fare cards for one flight, shown inside its flight card as a horizontally scrolling row
export default function FareOptions({ flight, onSelectFare, onHide }) {
  const { search } = useBooking()
  const scrollerRef = useRef(null)
  const [canScroll, setCanScroll] = useState({ prev: false, next: false })

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    setCanScroll({
      prev: el.scrollLeft > 1,
      next: el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
    })
  }, [])

  useEffect(() => {
    const el = scrollerRef.current
    updateScrollState()
    const observer = new ResizeObserver(updateScrollState)
    observer.observe(el)
    return () => observer.disconnect()
  }, [updateScrollState])

  const scrollByCard = (direction) =>
    scrollerRef.current?.scrollBy({
      left: direction * (CARD_WIDTH + GAP),
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })

  // Fare ladder is defined for the cheapest flight; shift it by this flight's premium
  const flightPrice = flight.startingPrice ?? flight.separatePrice ?? BASE_FARE_PRICE
  const offset = flightPrice - BASE_FARE_PRICE
  const titleId = `fare-options-${flight.id}`

  return (
    <Animate variant="expandDown">
      <Panel>
        <Header>
          <Title id={titleId}>Choose your fare</Title>
          <Controls>
            <HideButton type="button" onClick={onHide}>
              <ChevronUp size={18} color="primary.base" aria-hidden="true" />
              Hide
            </HideButton>
            <ArrowButton
              aria-label="Previous fares"
              disabled={!canScroll.prev}
              onClick={() => scrollByCard(-1)}
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </ArrowButton>
            <ArrowButton
              aria-label="More fares"
              disabled={!canScroll.next}
              onClick={() => scrollByCard(1)}
            >
              <ChevronRight size={20} aria-hidden="true" />
            </ArrowButton>
          </Controls>
        </Header>

        <ScrollArea $fade={canScroll.next}>
          <Scroller ref={scrollerRef} aria-labelledby={titleId} onScroll={updateScrollState}>
            {fareOptions.map((fare) => (
              <li key={fare.id}>
                <FareCard
                  fare={{ ...fare, price: fare.price + offset }}
                  flight={flight}
                  highlightPrice={fare.price === BASE_FARE_PRICE}
                  note={
                    flight.bundledRoundTrip
                      ? `$${(fare.bundleFromPrice + offset * search.travelers).toLocaleString()} round-trip for ${search.travelers}`
                      : null
                  }
                  onSelect={onSelectFare}
                />
              </li>
            ))}
          </Scroller>
        </ScrollArea>
      </Panel>
    </Animate>
  )
}
