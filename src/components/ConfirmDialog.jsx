import styled from 'styled-components'
import { Airplane, Close, Flights } from 'pcln-icons'
import Modal from './Modal'
import AirlineLogo from './AirlineLogo'
import { formatTime } from '../utils/format'

// Perks are listed not-included first, then paid add-ons, then included
const PERK_GROUPS = [false, 'fee', true]

const cityName = (place) => place.city.split(',')[0]

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`

const RouteTitle = styled.h3`
  margin: 0;
  font-size: 21px;
  font-weight: 600;
`

const DateLabel = styled.p`
  margin: 2px 0 0;
  font-size: 16px;
  white-space: nowrap;
`

const FlightInfo = styled(Row)`
  align-items: center;
  margin-top: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #868d95;
  font-size: 16px;
  line-height: 1.5;
`

const Airline = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`

const Segments = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-top: 12px;
  font-size: 13px;
  line-height: 1.4;
`

// Sized from content so the longer airport name gets proportionally more room
const Segment = styled.div`
  display: flex;
  flex: 1 1 auto;
  gap: 8px;
  min-width: 0;
`

const IconCircle = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e8f2ff;
`

const Time = styled.div`
  font-weight: 700;
  white-space: nowrap;
`

const City = styled.div`
  font-weight: 500;
`

const FlightTime = styled.span`
  flex-shrink: 0;
  padding: 4px 12px;
  border-radius: 999px;
  background: #e0e5ea;
  font-size: 12px;
  white-space: nowrap;
`

const FareName = styled.h3`
  margin: 14px 0 4px;
  font-size: 22px;
  font-weight: 600;
`

// Wraps perk groups onto another line for fares with many perks
const FareDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 8px 14px;
  font-size: 13px;
  line-height: 1.4;
`

const Cabin = styled.p`
  flex-shrink: 0;
  margin: 0;
  font-size: 15px;
  white-space: nowrap;
`

// Fills columns top-to-bottom, three items per column
const PerkGroup = styled.ul`
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(3, auto);
  column-gap: 18px;
  margin: 0;
  padding: 0;
  list-style: none;

  & + & {
    padding-left: 14px;
    border-left: 1px solid #001833;
  }
`

const Perk = styled.li`
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
`

function FlightSegment({ icon: Icon, time, place }) {
  return (
    <Segment>
      <IconCircle>
        <Icon size={16} color="primary.base" aria-hidden="true" />
      </IconCircle>
      <div>
        <Time>{formatTime(time)}</Time>
        <div>{place.code}</div>
      </div>
      <div>
        <City>{place.city}</City>
        <div>{place.name}</div>
      </div>
    </Segment>
  )
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  flight,
  fare,
  dateLabel,
  backLabel,
  onBack,
  continueLabel,
  onContinue,
}) {
  if (!flight || !fare) return null

  const perkGroups = PERK_GROUPS.map((status) =>
    fare.perks.filter((perk) => perk.included === status),
  ).filter((perks) => perks.length > 0)

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Confirm Details"
      description="Confirm your flight and fare selection"
      actions={[
        { label: backLabel, onClick: onBack },
        { label: continueLabel, onClick: onContinue },
      ]}
    >
      <Row>
        <RouteTitle>
          {cityName(flight.from)} ({flight.from.code}) &rarr; {cityName(flight.to)} (
          {flight.to.code})
        </RouteTitle>
        <DateLabel>{dateLabel}</DateLabel>
      </Row>

      <FlightInfo>
        <Airline>
          <AirlineLogo flight={flight} size={48} />
          <div>
            <div>{flight.airline}</div>
            <div>{flight.stops}</div>
          </div>
        </Airline>
        <div style={{ textAlign: 'right' }}>
          <div>{flight.flightNumber}</div>
          <div>{flight.plane}</div>
        </div>
      </FlightInfo>

      <Segments>
        <FlightSegment icon={Airplane} time={flight.departTime} place={flight.from} />
        <FlightSegment icon={Flights} time={flight.arriveTime} place={flight.to} />
        <FlightTime>Flight Time&nbsp;&nbsp;{flight.duration}</FlightTime>
      </Segments>

      <FareName>{fare.name}</FareName>
      <FareDetails>
        <Cabin>Cabin: {fare.cabin}</Cabin>
        {perkGroups.map((perks) => (
          <PerkGroup key={String(perks[0].included)}>
            {perks.map((perk) => (
              <Perk key={perk.label}>
                {perk.included === false && (
                  <Close size={12} color="text.base" aria-hidden="true" />
                )}
                {perk.label}
              </Perk>
            ))}
          </PerkGroup>
        ))}
      </FareDetails>
    </Modal>
  )
}
