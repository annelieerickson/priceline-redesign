import { Fragment, useId, useState } from 'react'
import styled from 'styled-components'
import { Airplane, ChevronDown, Flights } from 'pcln-icons'
import AirlineLogo from './AirlineLogo'
import { formatTime } from '../utils/format'
import { textSize } from '../config/featureFlags'

// Hex values mirror pcln-design-system palette tokens
const C = {
  text: '#001833', // text.base
  textLight: '#4f6f8f', // text.light
  blue: '#0068ef', // primary.base
  border: '#e0e5ea', // border.tint
  surface: '#f4f6f8', // background.light
  layover: '#fef2e7', // orange.light
}

const ORDINALS = ['1st', '2nd', '3rd']

const cityName = (place) => place.city.split(',')[0]

const Card = styled.section`
  overflow: hidden;
  border: 1px solid ${C.border};
  border-left: 6px solid ${C.blue};
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 24, 51, 0.14);
  color: ${C.text};
`

const Toggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  padding: 14px 28px 14px 18px;
  border: 0;
  background: transparent;
  color: inherit;
  font-family: inherit;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: #fafbfc;
  }
  &:focus-visible {
    outline: 2px solid ${C.blue};
    outline-offset: -2px;
  }
`

const When = styled.div`
  display: flex;
  gap: 20px;
  font-size: 16px;
`

const Route = styled.div`
  margin: 6px 0;
  font-size: 20px;
  font-weight: 700;
`

const Summary = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  font-size: 17px;
`

const Chevron = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  transition: transform 150ms ease;
  transform: rotate(${(p) => (p.$open ? 180 : 0)}deg);
`

const SegmentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 20px;
  border-top: 1px solid ${C.border};
  background: ${C.surface};
  font-size: 18px;

  strong {
    font-weight: 700;
  }
`

const SegmentBody = styled.div`
  padding: 14px 20px 18px 28px;
`

const Carrier = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${C.border};
  font-size: 17px;
  line-height: 1.5;
`

const Detail = styled.div`
  font-size: ${textSize(14)}px;
  color: ${(p) => (p.$muted ? C.textLight : C.text)};
`

const Times = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
  gap: 16px;
  margin-top: 14px;
`

const StopGrid = styled.div`
  display: grid;
  grid-template-columns: 20px auto minmax(0, 1fr);
  align-content: start;
  column-gap: 12px;
  row-gap: 2px;
  font-size: 17px;

  > :first-child {
    grid-row: span 2;
    padding-top: 2px;
  }
`

const Pills = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 220px;
`

const Pill = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 5px 14px;
  border-radius: 999px;
  background: ${(p) => (p.$layover ? C.layover : C.surface)};
  font-size: 15px;
`

function Stop({ icon: Icon, time, place }) {
  return (
    <StopGrid>
      <span>
        <Icon size={20} color="text.light" aria-hidden="true" />
      </span>
      <strong>{formatTime(time)}</strong>
      <span>{place.city}</span>
      <span>{place.code}</span>
      <Detail $muted>{place.name}</Detail>
    </StopGrid>
  )
}

// Collapsed: date, route, and carrier summary. Expanded: one section per flight
// leg with layovers, as on priceline.com
export default function FlightDetailsCard({ flight, fare, dateLabel }) {
  const [open, setOpen] = useState(false)
  const detailsId = useId()
  const segments = flight.segments ?? [flight]

  return (
    <Card>
      <Toggle
        type="button"
        aria-expanded={open}
        aria-controls={detailsId}
        onClick={() => setOpen((current) => !current)}
      >
        <div>
          <When>
            <span>{dateLabel}</span>
            <span>
              {formatTime(flight.departTime)} - {formatTime(flight.arriveTime)}
            </span>
          </When>
          <Route>
            {cityName(flight.from)} ({flight.from.code}) &rarr; {cityName(flight.to)} (
            {flight.to.code})
          </Route>
          <Summary>
            <AirlineLogo flight={flight} size={20} />
            <span>{flight.airline}</span>
            <span>{flight.stops}</span>
            <span>{flight.duration}</span>
          </Summary>
        </div>
        <Chevron $open={open}>
          <ChevronDown size={28} color="primary.base" aria-hidden="true" />
        </Chevron>
      </Toggle>

      <div id={detailsId} hidden={!open}>
        {segments.map((segment, i) => {
          const isLast = i === segments.length - 1
          return (
            <Fragment key={`${segment.flightNumber}-${segment.from.code}`}>
              <SegmentHeader>
                <strong>
                  {segment.from.code} to {segment.to.code}
                </strong>
                <span>{dateLabel}</span>
              </SegmentHeader>
              <SegmentBody>
                <Carrier>
                  <div>
                    <div>{flight.airline}</div>
                    <Detail>{fare.name}</Detail>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div>{segment.flightNumber}</div>
                    <Detail>{segment.plane}</Detail>
                  </div>
                </Carrier>
                <Times>
                  <Stop icon={Airplane} time={segment.departTime} place={segment.from} />
                  <Stop icon={Flights} time={segment.arriveTime} place={segment.to} />
                  <Pills>
                    <Pill>
                      <span>Flight Time</span>
                      <span>{segment.duration}</span>
                    </Pill>
                    {segment.layoverAfter && (
                      <Pill $layover>
                        <span>Layover</span>
                        <span>
                          {ORDINALS[i] ?? `${i + 1}th`} Stop {segment.layoverAfter}
                        </span>
                      </Pill>
                    )}
                    {isLast && (
                      <Pill>
                        <span>Trip Total</span>
                        <span>{flight.duration}</span>
                      </Pill>
                    )}
                  </Pills>
                </Times>
              </SegmentBody>
            </Fragment>
          )
        })}
      </div>
    </Card>
  )
}
