import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useToast } from 'pcln-design-system'
import {
  Calendar,
  CardTravel,
  Cars,
  Cruises,
  DollarCircle,
  Flights,
  Hotels,
  Search,
  User,
} from 'pcln-icons'
import TopNav from '../components/TopNav'
import SearchHeroArt from '../components/SearchHeroArt'
import RecentSearchCard from '../components/RecentSearchCard'
import Button from '../components/Button'
import { useBooking } from '../context/BookingContext'

const PRODUCT_TABS = [
  { label: 'Hotels', icon: Hotels },
  { label: 'Flights', icon: Flights },
  { label: 'Packages', icon: CardTravel },
  { label: 'Cars', icon: Cars },
  { label: 'Cruises', icon: Cruises },
]
const TRIP_TYPES = ['Round-trip', 'One-way', 'Multi-destination']
const MAX_TRAVELERS = 8

// Hex values mirror pcln-design-system palette tokens
const C = {
  text: '#001833', // text.base
  textLight: '#4f6f8f', // text.light
  blue: '#0068ef', // primary.base
  blueTone: '#0055c4', // primary.tone
  border: '#c0cad5', // border.base
  grey: '#edf0f3', // background.base
  bundle: '#d0f1ac', // highlight.light
  greenDark: '#060', // secondary.dark
}

const focusRing = `
  &:focus-visible {
    outline: 2px solid ${C.blue};
    outline-offset: 2px;
  }
`

const placeLabel = (place) => (place.code ? `${place.city} (${place.code})` : place.city)

// "Chicago, IL (ORD)" -> { city: 'Chicago, IL', code: 'ORD' }
const parsePlace = (value, previous) => {
  const match = value.match(/^(.*?)\s*\(([A-Za-z]{3})\)\s*$/)
  return match
    ? { ...previous, city: match[1], code: match[2].toUpperCase() }
    : { ...previous, city: value, code: '' }
}

const Hero = styled.section`
  position: relative;
  overflow: hidden;
  padding-bottom: 56px;
`

const Container = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 24px;
  color: ${C.text};
`

const Heading = styled.h1`
  margin: 0;
  padding: 36px 0 20px;
  font-size: 44px;
  font-weight: 700;
  letter-spacing: -0.5px;
`

const SearchCard = styled.form`
  max-width: 790px;
  padding: 20px 20px 16px;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 6px 20px rgba(0, 24, 51, 0.18);
`

const Tabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px 26px;
  margin-bottom: 14px;
`

const Tab = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 46px;
  padding: ${(p) => (p['aria-pressed'] ? '0 18px 0 6px' : '0')};
  border: 2px solid ${(p) => (p['aria-pressed'] ? C.blue : 'transparent')};
  border-radius: 999px;
  background: #fff;
  color: ${C.blue};
  font-family: inherit;
  font-size: 18px;
  font-weight: ${(p) => (p['aria-pressed'] ? 700 : 400)};
  cursor: pointer;
  ${focusRing}
`

const TabIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: ${(p) => (p.$active ? 'transparent' : C.grey)};
`

const TripTypes = styled.fieldset`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  margin: 0 0 14px;
  padding: 0;
  border: 0;
  font-size: 15px;

  legend {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
  }
  label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }
  input {
    width: 18px;
    height: 18px;
    margin: 0;
    accent-color: ${C.blue};
  }
`

const Row = styled.div`
  display: grid;
  grid-template-columns: ${(p) => p.$columns || '1fr 1fr'};
  gap: 14px;

  & + & {
    margin-top: 14px;
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`

const Field = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
  height: 58px;
  padding: 0 16px;
  border: 1px solid ${C.border};
  border-radius: 12px;
  background: #fff;
  cursor: text;

  &:focus-within {
    border-color: ${C.blue};
    box-shadow: 0 0 0 1px ${C.blue};
  }

  input {
    flex: 1;
    min-width: 0;
    border: 0;
    outline: none;
    background: transparent;
    color: ${C.text};
    font-family: inherit;
    font-size: 18px;
  }
  input::placeholder {
    color: ${C.textLight};
  }

  /* Native select stretched invisibly over the field keeps keyboard and screen reader support */
  select {
    position: absolute;
    inset: 0;
    width: 100%;
    opacity: 0;
    cursor: pointer;
  }
`

const StackedValue = styled.span`
  display: flex;
  flex-direction: column;
  min-width: 0;
  font-size: 18px;
  line-height: 1.2;

  small {
    font-size: 13px;
    color: ${C.textLight};
  }
`

const Bundle = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 14px;
  min-height: 58px;
  padding: 8px 12px;
  border-radius: 12px;
  background: ${C.bundle};
  font-size: 14px;

  label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
  }
  input {
    width: 18px;
    height: 18px;
    margin: 0;
    accent-color: ${C.blue};
  }
`

const BundleTitle = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${C.greenDark};
  font-weight: 500;
`

// Squared corners match the neighboring search fields
const FindButton = styled(Button)`
  height: 58px;
  border-radius: 12px;
  font-size: 20px;
`

const Footnote = styled.p`
  margin: 16px 0 0;
  padding-top: 14px;
  border-top: 1px solid ${C.border};
  color: #3a78d8;
  font-size: 15px;
  text-align: center;
`

const RecentSection = styled(Container)`
  padding-bottom: 64px;
`

const RecentHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 18px;
  margin-bottom: 20px;
`

const RecentHeading = styled.h2`
  margin: 0;
  font-size: 40px;
  font-weight: 700;
  letter-spacing: -0.5px;
`

const ViewAllButton = styled(Button)`
  height: 38px;
  padding: 0 16px;
  font-size: 17px;
`

export default function SearchPage() {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { search, setSearch, departure, returnSelection, resetTrip, hasSearched, setHasSearched } =
    useBooking()
  const [form, setForm] = useState(search)
  const [bundleAdds, setBundleAdds] = useState({ hotel: false, car: false })

  const isOneWay = form.tripType === 'One-way'
  const dateLabel = isOneWay ? form.departDate : `${form.departDate} – ${form.returnDate}`
  const resumePath = returnSelection ? '/checkout' : departure ? '/return' : '/departure'

  const outOfScope = (feature) =>
    addToast({
      children: `${feature} isn't part of this redesign — only the flight search flow is interactive.`,
      lifespan: 4000,
    })

  const handleDatesChange = (value) => {
    const [departDate = '', returnDate = form.returnDate] = value.split(/\s+[–-]\s+/)
    setForm({ ...form, departDate, returnDate: isOneWay ? form.returnDate : returnDate })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSearch(form)
    resetTrip()
    setHasSearched(true)
    navigate('/departure')
  }

  return (
    <div>
      <TopNav />

      <Hero>
        <SearchHeroArt />
        <Container>
          <Heading>Book your flight with confidence</Heading>

          <SearchCard onSubmit={handleSubmit} aria-labelledby="search-heading">
            <h2 id="search-heading" hidden>
              Flight search
            </h2>
            <Tabs>
              {PRODUCT_TABS.map(({ label, icon: Icon }) => {
                const active = label === 'Flights'
                return (
                  <Tab
                    key={label}
                    type="button"
                    aria-pressed={active}
                    onClick={active ? undefined : () => outOfScope(`${label} search`)}
                  >
                    <TabIcon $active={active}>
                      <Icon size={24} color="primary.base" aria-hidden="true" />
                    </TabIcon>
                    {label}
                  </Tab>
                )
              })}
            </Tabs>

            <TripTypes>
              <legend>Trip type</legend>
              {TRIP_TYPES.map((type) => (
                <label key={type}>
                  <input
                    type="radio"
                    name="tripType"
                    checked={form.tripType === type}
                    onChange={() => setForm({ ...form, tripType: type })}
                  />
                  {type}
                </label>
              ))}
            </TripTypes>

            <Row>
              <Field>
                <Search size={26} color="primary.base" aria-hidden="true" />
                <input
                  aria-label="Departing from"
                  placeholder="Departing from?"
                  value={placeLabel(form.from)}
                  onChange={(e) => setForm({ ...form, from: parsePlace(e.target.value, form.from) })}
                />
              </Field>
              <Field>
                <Search size={26} color="primary.base" aria-hidden="true" />
                <input
                  aria-label="Going to"
                  placeholder="Going to?"
                  value={placeLabel(form.to)}
                  onChange={(e) => setForm({ ...form, to: parsePlace(e.target.value, form.to) })}
                />
              </Field>
            </Row>

            <Row>
              <Field>
                <Calendar size={26} color="primary.base" aria-hidden="true" />
                <input
                  aria-label={isOneWay ? 'Departing' : 'Departing – Returning'}
                  placeholder={isOneWay ? 'Departing' : 'Departing – Returning'}
                  value={dateLabel}
                  onChange={(e) => handleDatesChange(e.target.value)}
                />
              </Field>
              <Field>
                <User size={26} color="primary.base" aria-hidden="true" />
                <StackedValue>
                  <small>Travelers</small>
                  {form.travelers} {form.travelers === 1 ? 'Adult' : 'Adults'}
                </StackedValue>
                <select
                  value={form.travelers}
                  onChange={(e) => setForm({ ...form, travelers: Number(e.target.value) })}
                >
                  {Array.from({ length: MAX_TRAVELERS }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'Adult' : 'Adults'}
                    </option>
                  ))}
                </select>
              </Field>
            </Row>

            {/* Slightly wider bundle box keeps its three options on one line */}
            <Row $columns="1.2fr 1fr">
              <Bundle>
                <BundleTitle>
                  <DollarCircle size={20} color="secondary.dark" aria-hidden="true" />
                  Bundle + Save
                </BundleTitle>
                <label>
                  <input
                    type="checkbox"
                    checked={bundleAdds.hotel}
                    onChange={(e) => setBundleAdds({ ...bundleAdds, hotel: e.target.checked })}
                  />
                  Add a hotel
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={bundleAdds.car}
                    onChange={(e) => setBundleAdds({ ...bundleAdds, car: e.target.checked })}
                  />
                  Add a car
                </label>
              </Bundle>
              <FindButton type="submit">Find Your Flight</FindButton>
            </Row>

            <Footnote>
              Pick your cabin class after choosing flights, so the price you see is the price you pay.
            </Footnote>
          </SearchCard>
        </Container>
      </Hero>

      {hasSearched && (
        <RecentSection as="section" aria-labelledby="recent-heading">
          <RecentHeader>
            <RecentHeading id="recent-heading">Pick up where you left off</RecentHeading>
            <ViewAllButton type="button" onClick={() => outOfScope('Recent activity')}>
              View all recent activity
            </ViewAllButton>
          </RecentHeader>
          <RecentSearchCard
            search={search}
            cabin={departure?.fare.cabin}
            onContinue={() => navigate(resumePath)}
          />
        </RecentSection>
      )}
    </div>
  )
}
