import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { ChevronDoubleLeft, ChevronDown, Tune } from 'pcln-icons'
import { useBooking } from '../context/BookingContext'

const EXPANDED_WIDTH = 240
const COLLAPSED_WIDTH = 72

// Filter options and counts are derived from the flights shown on the page
const stopOptionsFor = (flights) => [
  { id: 'nonstop', label: `Nonstop (${flights.filter((f) => f.stops === 'Nonstop').length})` },
  { id: 'one-stop', label: `Up to 1 stop (${flights.length})` },
]
const airlinesFor = (flights) => [...new Set(flights.map((f) => f.airline))].sort()
const airportsFor = (flights, airportKey) =>
  [...new Map(flights.map((f) => [f[airportKey].code, f[airportKey]])).values()].map(
    (airport) => `${airport.code} - ${airport.name.replace(/ Airport$/, '')}`,
  )

// Hex values mirror pcln-design-system palette tokens
const C = {
  text: '#001833', // text.base
  blue: '#0068ef', // primary.base
  lightBlue: '#e8f2ff', // primary.light
  border: '#c0cad5', // border.base
  borderTone: '#868d95', // border.tone
}

const focusRing = `
  &:focus-visible {
    outline: 2px solid ${C.blue};
    outline-offset: 2px;
  }
`

// overflow: clip hides content mid-animation; the margin leaves room for focus rings
const Sidebar = styled.aside`
  flex-shrink: 0;
  width: ${(p) => (p.$collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH)}px;
  padding-right: 20px;
  overflow: clip;
  overflow-clip-margin: 4px;
  color: ${C.text};
  transition: width 200ms ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

const Panel = styled.div`
  width: ${EXPANDED_WIDTH - 20}px;
`

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${C.border};
  font-size: 18px;
  font-weight: 700;
`

const HideButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  height: 30px;
  padding: 0 8px 0 4px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: ${C.blue};
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${C.lightBlue};
  }
  ${focusRing}
`

const ShowButton = styled.button`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: ${COLLAPSED_WIDTH - 20}px;
  /* Top margin keeps the count badge inside the sidebar's clipped area */
  margin-top: 8px;
  padding: 10px 0 8px;
  border: 1px solid ${C.border};
  border-radius: 12px;
  background: #fff;
  color: ${C.blue};
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    border-color: ${C.blue};
    background: ${C.lightBlue};
  }
  ${focusRing}
`

const CountBadge = styled.span`
  position: absolute;
  top: -7px;
  right: -7px;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 999px;
  background: ${C.blue};
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  line-height: 20px;
`

const Section = styled.section`
  margin-bottom: 22px;
`

const SectionHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 10px;
  ${(p) => p.$ruled && `padding-bottom: 6px; border-bottom: 1px solid ${C.borderTone};`}
`

const Heading = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
`

const TextButton = styled.button`
  padding: 0;
  border: 0;
  background: none;
  color: ${C.blue};
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;

  &:disabled {
    color: ${C.text};
    cursor: default;
  }
  &:not(:disabled):hover {
    text-decoration: underline;
  }
  ${focusRing}
`

const SelectWrap = styled.div`
  position: relative;

  select {
    width: 100%;
    height: 44px;
    padding: 0 40px 0 12px;
    border: 1px solid ${C.border};
    border-radius: 4px;
    background: #fff;
    color: ${C.text};
    font-family: inherit;
    font-size: 14px;
    appearance: none;
    cursor: pointer;
    ${focusRing}
  }

  svg {
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
    pointer-events: none;
  }
`

const PillToggle = styled.button`
  display: block;
  width: 100%;
  height: 38px;
  padding: 0 16px;
  border: 1px solid ${(p) => (p['aria-pressed'] ? C.blue : C.border)};
  border-radius: 999px;
  background: ${(p) => (p['aria-pressed'] ? C.lightBlue : '#fff')};
  color: ${C.blue};
  font-family: inherit;
  font-size: 14px;
  text-align: left;
  cursor: pointer;

  & + & {
    margin-top: 10px;
  }
  &:hover {
    border-color: ${C.blue};
  }
  ${focusRing}
`

const BulkActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
  font-size: 13px;
`

const CheckRow = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 0;
  font-size: 14px;
  cursor: pointer;

  input {
    width: 18px;
    height: 18px;
    margin: 0;
    accent-color: ${C.blue};
    cursor: pointer;
  }
`

function CheckboxGroup({ title, options, selected, onChange }) {
  const headingId = `filters-${title.toLowerCase()}`
  const toggle = (option, checked) =>
    onChange(checked ? [...selected, option] : selected.filter((o) => o !== option))

  return (
    <Section aria-labelledby={headingId}>
      <SectionHeader $ruled>
        <Heading id={headingId}>{title}</Heading>
      </SectionHeader>
      <BulkActions>
        <TextButton type="button" disabled={selected.length === 0} onClick={() => onChange([])}>
          Select None
        </TextButton>
        <span aria-hidden="true">|</span>
        <TextButton
          type="button"
          disabled={selected.length === options.length}
          onClick={() => onChange(options)}
        >
          Select All
        </TextButton>
      </BulkActions>
      {options.map((option) => (
        <CheckRow key={option}>
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={(e) => toggle(option, e.target.checked)}
          />
          {option}
        </CheckRow>
      ))}
    </Section>
  )
}

// airportKey picks which end of the trip the Airports filter lists ('from' or 'to')
export default function FlightFilters({ flights = [], airportKey = 'from' }) {
  const { filtersCollapsed: collapsed, setFiltersCollapsed } = useBooking()
  const [sortBy, setSortBy] = useState('recommended')
  const [stops, setStops] = useState([])
  const [airlines, setAirlines] = useState([])
  const [airports, setAirports] = useState([])
  const showButtonRef = useRef(null)
  const hideButtonRef = useRef(null)
  const userToggled = useRef(false)

  const activeCount =
    stops.length + airlines.length + airports.length + (sortBy === 'recommended' ? 0 : 1)

  // The clicked toggle disappears, so move focus to its counterpart. Skipped on
  // mount so arriving on a page with filters collapsed doesn't steal focus.
  useEffect(() => {
    if (!userToggled.current) return
    userToggled.current = false
    ;(collapsed ? showButtonRef : hideButtonRef).current?.focus()
  }, [collapsed])

  const setCollapsed = (value) => {
    userToggled.current = true
    setFiltersCollapsed(value)
  }

  const toggleStop = (id) =>
    setStops((current) => (current.includes(id) ? current.filter((s) => s !== id) : [...current, id]))

  return (
    <Sidebar aria-label="Filters" $collapsed={collapsed}>
      <ShowButton
        ref={showButtonRef}
        type="button"
        hidden={!collapsed}
        aria-expanded={false}
        aria-controls="filters-panel"
        aria-label={activeCount ? `Show filters, ${activeCount} active` : 'Show filters'}
        onClick={() => setCollapsed(false)}
      >
        <Tune size={22} color="primary.base" aria-hidden="true" />
        Filters
        {activeCount > 0 && <CountBadge aria-hidden="true">{activeCount}</CountBadge>}
      </ShowButton>

      {/* Stays mounted while collapsed so filter selections are kept */}
      <Panel id="filters-panel" hidden={collapsed}>
        <PanelHeader>
          Filters
          <HideButton
            ref={hideButtonRef}
            type="button"
            aria-expanded={true}
            aria-controls="filters-panel"
            aria-label="Hide filters"
            onClick={() => setCollapsed(true)}
          >
            <ChevronDoubleLeft size={18} color="primary.base" aria-hidden="true" />
            Hide
          </HideButton>
        </PanelHeader>

        <Section>
          <SectionHeader>
            <Heading as="label" htmlFor="sort-by">
              Sort By
            </Heading>
          </SectionHeader>
          <SelectWrap>
            <select id="sort-by" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="recommended">Recommended</option>
              <option value="price">Price (Lowest)</option>
              <option value="duration">Duration</option>
              <option value="departure">Departure Time</option>
            </select>
            <ChevronDown size={20} color="text.base" />
          </SelectWrap>
        </Section>

        <Section aria-labelledby="filters-stops">
          <SectionHeader>
            <Heading id="filters-stops">Stops</Heading>
            <TextButton type="button" onClick={() => setStops([])}>
              Reset
            </TextButton>
          </SectionHeader>
          {stopOptionsFor(flights).map(({ id, label }) => (
            <PillToggle
              key={id}
              type="button"
              aria-pressed={stops.includes(id)}
              onClick={() => toggleStop(id)}
            >
              {label}
            </PillToggle>
          ))}
        </Section>

        <CheckboxGroup
          title="Airlines"
          options={airlinesFor(flights)}
          selected={airlines}
          onChange={setAirlines}
        />
        <CheckboxGroup
          title="Airports"
          options={airportsFor(flights, airportKey)}
          selected={airports}
          onChange={setAirports}
        />
      </Panel>
    </Sidebar>
  )
}
