import styled from 'styled-components'

const STEPS = ['Departure', 'Fare Selection', 'Return', 'Fare Selection']

// Horizontal offset of the diagonal seams between segments
const SLANT = 24

// Hex values mirror pcln-design-system palette tokens
const STATUS_STYLES = {
  completed: { bg: '#99c3f9', color: '#fff' }, // primary.tint
  current: { bg: '#0068ef', color: '#fff' }, // primary.base
  upcoming: { bg: '#fff', color: '#0b2a4a' }, // text.base
}
const BORDER = '#0b2a4a' // border.tone

// The border is drawn as an overlay rather than on the element itself: a real
// border would clip the segment fills to the inside of the rounded edge, leaving
// a hairline gap between the fill and the border.
const Bar = styled.ol`
  position: relative;
  display: flex;
  flex: 1;
  min-width: 0;
  height: 32px;
  margin: 0;
  padding: 0;
  list-style: none;
  border-radius: 999px;
  background: #fff;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border: 1px solid ${BORDER};
    border-radius: 999px;
    pointer-events: none;
  }
`

// Middle segments center their label symmetrically; the end segments have one
// straight edge, so shift their padding to keep the label visually centered.
const Segment = styled.li`
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: ${(p) => (p.$first ? 12 : 12 + SLANT / 2)}px;
  padding-right: ${(p) => (p.$last ? 12 : 12 + SLANT / 2)}px;

  & + & {
    margin-left: -${SLANT}px;
  }
`

const Fill = styled.span`
  position: absolute;
  inset: 0;
  background: ${(p) => p.$bg};
  clip-path: ${(p) =>
    p.$first
      ? `polygon(0 0, 100% 0, calc(100% - ${SLANT}px) 100%, 0 100%)`
      : p.$last
        ? `polygon(${SLANT}px 0, 100% 0, 100% 100%, 0 100%)`
        : `polygon(${SLANT}px 0, 100% 0, calc(100% - ${SLANT}px) 100%, 0 100%)`};
`

const Seam = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: ${SLANT}px;
  height: 100%;
  overflow: visible;
`

const Label = styled.span`
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 15px;
  color: ${(p) => p.$color};
`

const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
`

const statusOf = (i, currentStep) =>
  i < currentStep ? 'completed' : i === currentStep ? 'current' : 'upcoming'

// currentStep is 0-indexed into STEPS
export default function StepProgress({ currentStep }) {
  return (
    <Bar aria-label="Booking progress">
      {STEPS.map((label, i) => {
        const status = statusOf(i, currentStep)
        const first = i === 0
        const last = i === STEPS.length - 1
        // Adjacent white segments need a drawn divider; colored ones show their own edge
        const showSeam = !first && status === 'upcoming' && statusOf(i - 1, currentStep) === 'upcoming'
        const { bg, color } = STATUS_STYLES[status]

        return (
          <Segment
            key={label + i}
            $first={first}
            $last={last}
            aria-current={status === 'current' ? 'step' : undefined}
          >
            <Fill $bg={bg} $first={first} $last={last} />
            {showSeam && (
              <Seam viewBox={`0 0 ${SLANT} 30`} preserveAspectRatio="none" aria-hidden="true">
                <line
                  x1={SLANT}
                  y1="0"
                  x2="0"
                  y2="30"
                  stroke={BORDER}
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              </Seam>
            )}
            <Label $color={color}>{label}</Label>
            {status === 'completed' && <VisuallyHidden> (completed)</VisuallyHidden>}
          </Segment>
        )
      })}
    </Bar>
  )
}
