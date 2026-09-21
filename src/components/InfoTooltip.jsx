import { useEffect, useId, useState } from 'react'
import styled from 'styled-components'
import { InformationOutline } from 'pcln-icons'

// Hex values mirror pcln-design-system palette tokens
const C = {
  navy: '#001833', // text.base
  blue: '#0068ef', // primary.base
  lightBlue: '#e8f2ff', // primary.light
}

const Wrapper = styled.span`
  position: relative;
  display: inline-flex;
`

const Trigger = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: ${C.blue};
  cursor: help;

  &:hover {
    background: ${C.lightBlue};
  }
  &:focus-visible {
    outline: 2px solid ${C.blue};
    outline-offset: 2px;
  }
`

const Bubble = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  z-index: 50;
  width: 320px;
  max-width: calc(100vw - 32px);
  padding: 12px 14px;
  border-radius: 10px;
  background: ${C.navy};
  color: #fff;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.45;
  text-align: left;
  box-shadow: 0 6px 20px rgba(0, 24, 51, 0.3);
  transform: translateX(-50%);

  /* Arrow pointing at the icon */
  &::before {
    content: '';
    position: absolute;
    top: -6px;
    left: 50%;
    width: 12px;
    height: 12px;
    background: ${C.navy};
    transform: translateX(-50%) rotate(45deg);
  }
  /* Invisible bridge over the gap so moving the pointer onto the bubble keeps it open */
  &::after {
    content: '';
    position: absolute;
    top: -12px;
    right: 0;
    left: 0;
    height: 12px;
  }

  strong {
    display: block;
    margin-bottom: 4px;
    font-size: 15px;
  }
  p {
    margin: 0;
  }
`

// Info icon that reveals `children` on hover or keyboard focus. The bubble can be
// hovered and dismissed with Escape, and is linked to the icon for screen readers.
export default function InfoTooltip({ label, children }) {
  const [open, setOpen] = useState(false)
  const id = useId()

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  return (
    <Wrapper onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Trigger
        type="button"
        aria-label={label}
        aria-describedby={id}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen(true)}
      >
        <InformationOutline size={20} aria-hidden="true" />
      </Trigger>
      <Bubble id={id} role="tooltip" hidden={!open}>
        {children}
      </Bubble>
    </Wrapper>
  )
}
