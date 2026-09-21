import styled from 'styled-components'
import { Animate, Flex } from 'pcln-design-system'
import Button from './Button'
import { textSize, uiZoom } from '../config/featureFlags'

// Must match the card radius: FlightCard tucks this tab that far up under the card
const TUCKED_UNDER_CARD = 16

// Tab hanging below a flight card's price column (rendered through FlightCard's
// attachedSlot). The extra top padding sits hidden under the card's bottom edge.
const Tab = styled.div`
  padding: ${TUCKED_UNDER_CARD + 12}px 16px 14px;
  border: 2px solid #868d95; /* border.base */
  border-top: 0;
  border-radius: 0 0 16px 16px;
  background: #f4f6f8; /* background.light */
  color: #001833; /* text.base */
`

// Sized from the on-screen target: the card may be scaled by the uiScale flag,
// so divide by the zoom to land at the intended size as rendered.
const Question = styled.p`
  margin: 0;
  font-size: ${Math.round(14 / uiZoom)}px;
  font-weight: 700;
  line-height: 1.3;
  text-align: right;
`

const SmallButton = styled(Button)`
  height: 36px;
  padding: 0 16px;
  font-size: ${textSize(16)}px;
`

export default function KeepCabinBar({ cabinName, onKeep, onSeeOptions }) {
  return (
    <Animate variant="expandDown">
      <Tab>
        <Flex flexDirection="column" alignItems="flex-end" style={{ gap: 10 }}>
          <Question>Keep cabin class: {cabinName}?</Question>
          <Flex style={{ gap: 8, flexShrink: 0 }}>
            <SmallButton onClick={onSeeOptions}>See other options</SmallButton>
            <SmallButton onClick={onKeep}>Yes</SmallButton>
          </Flex>
        </Flex>
      </Tab>
    </Animate>
  )
}
