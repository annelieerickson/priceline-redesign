import styled from 'styled-components'
import { Animate, Box, Flex, Text } from 'pcln-design-system'
import Button from './Button'
import { textSize } from '../config/featureFlags'

const SmallButton = styled(Button)`
  height: 36px;
  padding: 0 16px;
  font-size: ${textSize(14)}px;
`

export default function KeepCabinBar({ cabinName, onKeep, onSeeOptions }) {
  return (
    <Animate variant="expandDown">
      <Box bg="background.light" p={3} mt={2} borderRadius="sm">
        <Flex alignItems="center" justifyContent="space-between" style={{ gap: 12 }}>
          <Text textStyle="paragraphBold">Keep cabin class: {cabinName}?</Text>
          <Flex style={{ gap: 8, flexShrink: 0 }}>
            <SmallButton onClick={onSeeOptions}>See other options</SmallButton>
            <SmallButton onClick={onKeep}>Yes</SmallButton>
          </Flex>
        </Flex>
      </Box>
    </Animate>
  )
}
