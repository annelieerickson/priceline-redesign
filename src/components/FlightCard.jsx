import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Box, Flex, Text } from 'pcln-design-system'
import AirlineLogo from './AirlineLogo'
import { formatTime } from '../utils/format'
import { textSize, uiZoom } from '../config/featureFlags'

// Below this content width the card switches to its narrower layout
const COMPACT_BELOW = 660

// Price column width. Wider when zoomed, since textSize() enlarges the bundle pill
// and note there and they'd otherwise wrap onto two lines.
const PRICE_COLUMN_BASIS = uiZoom !== 1 ? 370 : 330

const CARD_RADIUS = 16

// Hex values mirror pcln-design-system palette tokens so the card can use
// exact wireframe measurements via inline styles.
const COLORS = {
  text: '#001833', // text.base
  textMuted: '#364049', // darkGray
  textLight: '#4f6f8f', // text.light
  green: '#0a0', // secondary.base
  greenLight: '#ecf7ec', // secondary.light
  border: '#868d95', // border.tone
  borderSelected: '#0068ef', // border.dark
}

function TagPill({ children }) {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      style={{
        height: 22,
        // Wireframe width on desktop; shrinks to fit its label on narrower cards
        flex: '0 1 168px',
        padding: '0 14px',
        borderRadius: 999,
        background: COLORS.greenLight,
        color: COLORS.green,
        fontSize: textSize(13),
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </Flex>
  )
}

function BundlePill({ children }) {
  return (
    <Flex
      alignItems="center"
      style={{
        height: 28,
        padding: '0 10px',
        borderRadius: 8,
        background: COLORS.greenLight,
        color: COLORS.green,
        fontSize: textSize(13),
        fontWeight: 500,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </Flex>
  )
}

export default function FlightCard({
  flight,
  priceMain,
  priceLabel = 'Starting at',
  tags = [],
  highlightPrice = false,
  bundleLabel,
  bundleNote,
  onClick,
  selected,
  // Full-width content inside the card, below its main row (e.g. fare options)
  actionSlot,
  // A tab hanging below the card, right-aligned with it (e.g. the keep-cabin question).
  // It spans at least the price column and grows left to fit its content on one line.
  // Its top is tucked CARD_RADIUS px under the card, so it should pad its own top by that much.
  attachedSlot,
}) {
  const cardRef = useRef(null)
  const dividerRef = useRef(null)
  const [compact, setCompact] = useState(false)
  const [tabMinWidth, setTabMinWidth] = useState(0)
  const hasAttachedSlot = !!attachedSlot

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) =>
      setCompact(entry.contentRect.width < COMPACT_BELOW),
    )
    observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  // The attached tab is at least as wide as the price column (divider to right edge)
  useLayoutEffect(() => {
    if (!hasAttachedSlot) return
    const measure = () => {
      // offsetLeft is measured from inside the card's 1px left border
      const width = cardRef.current.offsetWidth - (dividerRef.current.offsetLeft + 1)
      setTabMinWidth((prev) => (prev === width ? prev : width))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [hasAttachedSlot, compact])

  const borderColor = selected ? COLORS.borderSelected : COLORS.border

  const handleKeyDown = (e) => {
    // Ignore keys pressed on controls inside the card (e.g. actionSlot buttons)
    if (e.target !== e.currentTarget) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }

  return (
    // uiScale flag; zooming the wrapper scales the card and anything attached to it
    <div style={{ marginBottom: 16, ...(uiZoom !== 1 && { zoom: uiZoom }) }}>
      <Box
        ref={cardRef}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        aria-pressed={onClick ? !!selected : undefined}
        onClick={onClick}
        onKeyDown={onClick ? handleKeyDown : undefined}
        style={{
          // Positioned above the attached tab so the card's rounded corner overlaps it
          position: 'relative',
          zIndex: 1,
          background: '#fff',
          border: `1px solid ${borderColor}`,
          // Inset shadow thickens the selected border to 3px without shifting layout
          boxShadow: selected ? `inset 0 0 0 2px ${borderColor}` : 'none',
          borderRadius: CARD_RADIUS,
          padding: '16px 18px',
          color: COLORS.text,
          cursor: onClick ? 'pointer' : 'default',
        }}
      >
        <Flex alignItems="stretch">
          <Flex
            flexDirection="column"
            style={{ flex: '1 1 auto', minWidth: 0, paddingRight: compact ? 18 : 26 }}
          >
            {tags.length > 0 && (
              <Flex style={{ gap: compact ? 8 : 12, marginBottom: 10 }}>
                {tags.map((tag) => (
                  <TagPill key={tag}>{tag}</TagPill>
                ))}
              </Flex>
            )}
            <Flex
              alignItems="center"
              style={{ gap: compact ? 16 : 'clamp(16px, 2.5vw, 28px)', flex: 1 }}
            >
              <AirlineLogo flight={flight} size={compact ? 56 : 76} />
              <Box style={{ flex: '1 1 auto', minWidth: 0, fontSize: 16, lineHeight: '25px' }}>
                <Text style={{ fontSize: 16, fontWeight: 600, lineHeight: '25px' }}>
                  {formatTime(flight.departTime)}-{formatTime(flight.arriveTime)}
                </Text>
                <Text style={{ color: COLORS.textMuted }}>
                  {flight.from.code} &rarr; {flight.to.code} ({flight.duration})
                </Text>
                <Text style={{ color: COLORS.textMuted }}>
                  {flight.airline}
                  {compact && ` · ${flight.stops}`}
                </Text>
              </Box>
              {!compact && (
                <Text style={{ fontSize: 16, fontWeight: 500, whiteSpace: 'nowrap' }}>
                  {flight.stops}
                </Text>
              )}
            </Flex>
          </Flex>

          <Box ref={dividerRef} style={{ width: 1, flexShrink: 0, background: COLORS.text }} />

          <Flex
            flexDirection="column"
            justifyContent="space-between"
            style={{
              flex: compact ? '0 0 220px' : `0 1 ${PRICE_COLUMN_BASIS}px`,
              minWidth: compact ? 0 : 240,
              paddingLeft: 12,
              minHeight: 104,
            }}
          >
            <Flex justifyContent="space-between" alignItems="flex-start">
              <Text style={{ fontSize: 15, color: COLORS.textMuted }}>{priceLabel}</Text>
              <Text
                style={{
                  fontSize: compact ? 34 : 44,
                  fontWeight: 600,
                  lineHeight: 1,
                  marginTop: 10,
                  letterSpacing: -0.5,
                  color: highlightPrice ? COLORS.green : COLORS.text,
                }}
              >
                {priceMain}
              </Text>
            </Flex>
            {(bundleLabel || bundleNote) && (
              <Flex
                justifyContent="space-between"
                alignItems="center"
                style={{ gap: '4px 8px', marginTop: 8, flexWrap: 'wrap' }}
              >
                {bundleLabel && <BundlePill>{bundleLabel}</BundlePill>}
                {bundleNote && (
                  <Text
                    style={{
                      marginLeft: 'auto',
                      fontSize: textSize(12),
                      color: COLORS.textLight,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {bundleNote}
                  </Text>
                )}
              </Flex>
            )}
          </Flex>
        </Flex>
        {actionSlot && (
          // Keeps clicks on the slot's buttons from also re-selecting the card
          <div onClick={(e) => e.stopPropagation()} style={{ cursor: 'default' }}>
            {actionSlot}
          </div>
        )}
      </Box>

      {attachedSlot && (
        // Right-aligned at its natural width, so it only wraps when the card is too narrow
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -CARD_RADIUS }}>
          <div style={{ minWidth: tabMinWidth, maxWidth: '100%' }}>{attachedSlot}</div>
        </div>
      )}
    </div>
  )
}
