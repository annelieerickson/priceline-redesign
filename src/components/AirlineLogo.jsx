import { Flex } from 'pcln-design-system'
import { airlineLogos } from '../data/assets'

const AIRLINE_COLORS = {
  UA: '#2b2bd6',
  AA: '#0078d2',
  WN: '#304cb2',
  DL: '#c8102e',
}

// Renders flight.logo or the airlineLogos entry for the carrier; otherwise a
// brand-colored tile with the airline code
export default function AirlineLogo({ flight, size = 76 }) {
  const code = flight.flightNumber?.split(' ')[0] ?? ''
  const src = flight.logo ?? airlineLogos[code]

  if (src) {
    return (
      <img
        src={src}
        alt={flight.airline}
        width={size}
        height={size}
        style={{ flexShrink: 0, objectFit: 'contain' }}
      />
    )
  }

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      aria-label={flight.airline}
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        background: AIRLINE_COLORS[code] ?? '#4f6f8f',
        color: '#fff',
        fontSize: Math.round(size * 0.29),
        fontWeight: 700,
        letterSpacing: 1,
      }}
    >
      {code}
    </Flex>
  )
}
