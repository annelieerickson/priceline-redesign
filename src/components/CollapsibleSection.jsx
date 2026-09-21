import { useId, useState } from 'react'
import styled from 'styled-components'
import { ChevronDown } from 'pcln-icons'

// Hex values mirror pcln-design-system palette tokens
const C = {
  text: '#001833', // text.base
  textLight: '#4f6f8f', // text.light
  blue: '#0068ef', // primary.base
}

// Spacing matches the plain flight group headings on the list pages
const Section = styled.section`
  margin-bottom: 32px;
`

const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2px 6px;
  margin-bottom: ${(p) => (p.$open ? 8 : 0)}px;
`

const Toggle = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 4px 2px 0;
  border: 0;
  background: none;
  color: ${C.text};
  font-family: inherit;
  font-size: 16px;
  font-weight: 700;
  text-align: left;
  cursor: pointer;

  &:hover .section-title {
    text-decoration: underline;
  }
  &:focus-visible {
    outline: 2px solid ${C.blue};
    outline-offset: 2px;
  }
`

const Chevron = styled.span`
  display: inline-flex;
  transition: transform 150ms ease;
  transform: rotate(${(p) => (p.$open ? 0 : -90)}deg);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

const Meta = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${C.textLight};
`

// Flight group whose cards can be collapsed. `info` renders beside the title,
// outside the toggle button so it can hold its own control (e.g. an InfoTooltip).
export default function CollapsibleSection({ title, meta, info, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()

  return (
    <Section aria-labelledby={`${id}-title`}>
      <Header $open={open}>
        <Toggle
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-body`}
          onClick={() => setOpen((current) => !current)}
        >
          <Chevron $open={open}>
            <ChevronDown size={22} color="text.base" aria-hidden="true" />
          </Chevron>
          <span id={`${id}-title`} className="section-title">
            {title}
          </span>
          {meta && <Meta>{meta}</Meta>}
        </Toggle>
        {info}
      </Header>
      <div id={`${id}-body`} hidden={!open}>
        {children}
      </div>
    </Section>
  )
}
