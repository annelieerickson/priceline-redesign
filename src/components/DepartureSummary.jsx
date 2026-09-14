import styled from 'styled-components'
import AirlineLogo from './AirlineLogo'
import Button from './Button'
import { uiZoom } from '../config/featureFlags'
import { formatTime } from '../utils/format'

// Hex values mirror pcln-design-system palette tokens
const C = {
  text: '#001833', // text.base
  blue: '#0068ef', // primary.base
  lightBlue: '#e8f2ff', // primary.light
  tintBlue: '#99c3f9', // primary.tint
}

const Card = styled.section`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 24px;
  padding: 14px 24px 16px 20px;
  border-radius: 12px;
  background: ${C.lightBlue};
  color: ${C.text};
  ${uiZoom !== 1 ? `zoom: ${uiZoom};` : ''}
`

const Flight = styled.div`
  flex: 1;
  min-width: 0;
`

const Label = styled.h2`
  margin: 0 0 8px;
  font-size: 17px;
  font-weight: 700;
`

const Details = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`

const Info = styled.div`
  flex: 1;
  min-width: 0;
  font-size: 15px;
  line-height: 1.4;

  strong {
    display: block;
    font-size: 17px;
    font-weight: 700;
  }
`

const Stops = styled.span`
  padding-right: 8px;
  font-size: 17px;
  font-weight: 700;
  white-space: nowrap;
`

const Divider = styled.div`
  align-self: stretch;
  width: 1px;
  background: ${C.tintBlue};
`

const Fare = styled.div`
  min-width: 130px;
`

const FareName = styled.div`
  font-size: 17px;
  font-weight: 700;
`

const Price = styled.div`
  font-size: 36px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.5px;

  sup {
    position: relative;
    top: 4px;
    margin-right: 1px;
    font-size: 16px;
    vertical-align: top;
  }
`

const ChangeButton = styled(Button)`
  flex-shrink: 0;
`

// Recap of the chosen departure shown above the return flight list
export default function DepartureSummary({ flight, fare, onChangeFlight }) {
  return (
    <Card aria-labelledby="departure-summary-label">
      <Flight>
        <Label id="departure-summary-label">Your departure flight:</Label>
        <Details>
          <AirlineLogo flight={flight} size={52} />
          <Info>
            <strong>
              {formatTime(flight.departTime)}-{formatTime(flight.arriveTime)}
            </strong>
            <div>
              {flight.from.code} &rarr; {flight.to.code} ({flight.duration})
            </div>
            <div>{flight.airline}</div>
          </Info>
          <Stops>{flight.stops}</Stops>
        </Details>
      </Flight>

      <Divider />

      <Fare>
        <FareName>{fare.name}</FareName>
        <Price>
          <sup>$</sup>
          {fare.price.toLocaleString()}
        </Price>
      </Fare>

      <ChangeButton type="button" onClick={onChangeFlight}>
        Change Flight
      </ChangeButton>
    </Card>
  )
}
