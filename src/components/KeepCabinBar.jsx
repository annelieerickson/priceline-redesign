import styled from 'styled-components'
import { Animate, Box, Flex } from 'pcln-design-system'
import Button from './Button'
import { textSize, uiZoom } from '../config/featureFlags'

// Sized from the on-screen target: the bar sits inside a flight card, which the
// uiScale flag may be shrinking, so divide by the zoom to land at 16px as rendered.
const Question = styled.p`
  margin: 0;
  font-size: ${Math.round(14 / uiZoom)}px;
  font-weight: 700;
  line-height: 1.3;
`

const SmallButton = styled(Button)`
  height: 36px;
  padding: 0 16px;
  font-size: ${textSize(16)}px;
`

export default function KeepCabinBar({ cabinName, onKeep, onSeeOptions }) {
  return (
    <Animate variant="expandDown">
      <Box bg="background.light" p={3} mt={2} borderRadius="sm">
        {/* Question and buttons stacked on the right, under the card's price column */}
        <Flex flexDirection="column" alignItems="flex-end" style={{ gap: 10 }}>
          <Question style={{ textAlign: 'right' }}>Keep cabin class: {cabinName}?</Question>
          <Flex style={{ gap: 8, flexShrink: 0 }}>
            <SmallButton onClick={onSeeOptions}>See other options</SmallButton>
            <SmallButton onClick={onKeep}>Yes</SmallButton>
          </Flex>
        </Flex>
      </Box>
    </Animate>
  )
}
