import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import {
  Airplane,
  Calendar,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Flights,
  Group,
  SwapHorizontal,
} from 'pcln-icons'
import { useBooking } from '../context/BookingContext'
import Button from './Button'
import { textSize, uiZoom } from '../config/featureFlags'

// Hex values mirror pcln-design-system palette tokens
const C = {
  text: '#001833', // text.base
  textLight: '#4f6f8f', // text.light
  blue: '#0068ef', // primary.base
  lightBlue: '#e8f2ff', // primary.light
  border: '#868d95', // border.tone
  borderLight: '#c0cad5', // border.base
}

const TRIP_TYPES = ['Round-trip', 'One-way', 'Multi-destination']
const MAX_TRAVELERS = 8

const focusRing = `
  &:focus-visible {
    outline: 2px solid ${C.blue};
    outline-offset: 2px;
  }
`

const Wrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`

const Trigger = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px 0 16px;
  border: 1px solid ${C.border};
  border-radius: 999px;
  background: #fff;
  color: ${C.blue};
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background: ${C.lightBlue};
  }
  ${focusRing}
`

const Rotator = styled.span`
  display: inline-flex;
  transition: transform 150ms ease;
  transform: rotate(${(p) => p.$deg}deg);
`

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 24, 51, 0.5);
`

const Panel = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 1001;
  width: 400px;
  ${uiZoom !== 1 ? `zoom: ${uiZoom};` : ''}
  max-width: calc(100vw - 32px);
  padding: 16px 18px 20px;
  border: 1px solid ${C.border};
  border-radius: 16px;
  background: #fff;
  color: ${C.text};
  box-shadow: 0 8px 24px rgba(0, 24, 51, 0.24);
  outline: none;
`

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
`

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 500;
`

const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;

  &:hover {
    background: ${C.lightBlue};
  }
  ${focusRing}
`

const Rows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Row = styled.div`
  border: 1px solid ${(p) => (p.$expanded ? C.blue : C.border)};
  border-radius: 8px;
  background: #fff;
`

const RowButton = styled.button`
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  min-height: 56px;
  padding: 8px 12px 8px 10px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: ${C.text};
  font-size: 17px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: ${C.lightBlue};
  }
  ${focusRing}
`

const IconBox = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 6px;
  background: ${C.lightBlue};
`

const Summary = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Editor = styled.div`
  display: grid;
  grid-template-columns: ${(p) => p.$columns || '1fr'};
  gap: 12px;
  padding: 4px 12px 14px;
`

const FieldLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  font-size: ${textSize(12)}px;
  font-weight: 600;
  color: ${C.textLight};
`

const TextInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1px solid ${C.borderLight};
  border-radius: 8px;
  color: ${C.text};
  font-family: inherit;
  font-size: 15px;

  &:focus {
    border-color: ${C.blue};
    outline: none;
    box-shadow: 0 0 0 1px ${C.blue};
  }
`

const Counter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 15px;
  font-weight: 500;
`

const RoundButton = styled(Button)`
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 50%;
  font-size: 20px;
  line-height: 1;
`

const Choices = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

const Choice = styled.button`
  height: 34px;
  padding: 0 14px;
  border: 1px solid ${(p) => (p['aria-checked'] ? C.blue : C.borderLight)};
  border-radius: 999px;
  background: ${(p) => (p['aria-checked'] ? C.lightBlue : '#fff')};
  color: ${(p) => (p['aria-checked'] ? C.blue : C.text)};
  font-size: ${textSize(14)}px;
  font-weight: 500;
  cursor: pointer;
  ${focusRing}
`

const UpdateButton = styled(Button)`
  display: flex;
  width: fit-content;
  height: 44px;
  margin: 20px auto 0;
  padding: 0 22px;
  font-size: 17px;
`

const travelersLabel = (n) => `${n} ${n === 1 ? 'Adult' : 'Adults'}`

function SearchRow({ id, icon: Icon, summary, expanded, onToggle, columns, children }) {
  return (
    <Row $expanded={expanded}>
      <RowButton type="button" aria-expanded={expanded} aria-controls={id} onClick={onToggle}>
        <IconBox>
          <Icon size={22} color="primary.base" />
        </IconBox>
        <Summary>{summary}</Summary>
        <Rotator $deg={expanded ? 90 : 0}>
          <ChevronRight size={24} color="text.base" />
        </Rotator>
      </RowButton>
      {expanded && (
        <Editor id={id} $columns={columns}>
          {children}
        </Editor>
      )}
    </Row>
  )
}

export default function EditSearchPopover() {
  const { search, setSearch } = useBooking()
  const [isOpen, setIsOpen] = useState(false)
  const [draft, setDraft] = useState(search)
  const [expandedRow, setExpandedRow] = useState(null)
  const triggerRef = useRef(null)
  const panelRef = useRef(null)

  const open = () => {
    setDraft(search)
    setExpandedRow(null)
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
    triggerRef.current?.focus()
  }

  useEffect(() => {
    if (!isOpen) return
    panelRef.current?.focus()
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handleUpdate = () => {
    setSearch(draft)
    close()
  }

  const toggleRow = (row) => setExpandedRow((current) => (current === row ? null : row))

  const setPlace = (key, field, value) =>
    setDraft((d) => ({ ...d, [key]: { ...d[key], [field]: value } }))

  const isOneWay = draft.tripType === 'One-way'
  const dateSummary = isOneWay ? draft.departDate : `${draft.departDate} - ${draft.returnDate}`

  const placeEditor = (key) => (
    <>
      <FieldLabel>
        City
        <TextInput
          value={draft[key].city}
          onChange={(e) => setPlace(key, 'city', e.target.value)}
        />
      </FieldLabel>
      <FieldLabel>
        Airport
        <TextInput
          value={draft[key].code}
          maxLength={3}
          onChange={(e) => setPlace(key, 'code', e.target.value.toUpperCase())}
        />
      </FieldLabel>
    </>
  )

  return (
    <Wrapper>
      <Trigger
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={isOpen ? close : open}
      >
        Edit Search
        <Rotator $deg={isOpen ? 180 : 0}>
          <ChevronDown size={18} color="primary.base" />
        </Rotator>
      </Trigger>

      {isOpen && (
        <>
          <Overlay onClick={close} />
          <Panel ref={panelRef} role="dialog" aria-labelledby="edit-search-title" tabIndex={-1}>
            <PanelHeader>
              <Title id="edit-search-title">Edit Search</Title>
              <IconButton type="button" aria-label="Close edit search" onClick={close}>
                <ChevronUp size={24} color="text.base" />
              </IconButton>
            </PanelHeader>

            <Rows>
              <SearchRow
                id="edit-from"
                icon={Airplane}
                summary={`${draft.from.city} (${draft.from.code})`}
                expanded={expandedRow === 'from'}
                onToggle={() => toggleRow('from')}
                columns="1fr 84px"
              >
                {placeEditor('from')}
              </SearchRow>

              <SearchRow
                id="edit-to"
                icon={Flights}
                summary={`${draft.to.city} (${draft.to.code})`}
                expanded={expandedRow === 'to'}
                onToggle={() => toggleRow('to')}
                columns="1fr 84px"
              >
                {placeEditor('to')}
              </SearchRow>

              <SearchRow
                id="edit-dates"
                icon={Calendar}
                summary={dateSummary}
                expanded={expandedRow === 'dates'}
                onToggle={() => toggleRow('dates')}
                columns={isOneWay ? '1fr' : '1fr 1fr'}
              >
                <FieldLabel>
                  Departing
                  <TextInput
                    value={draft.departDate}
                    onChange={(e) => setDraft({ ...draft, departDate: e.target.value })}
                  />
                </FieldLabel>
                {!isOneWay && (
                  <FieldLabel>
                    Returning
                    <TextInput
                      value={draft.returnDate}
                      onChange={(e) => setDraft({ ...draft, returnDate: e.target.value })}
                    />
                  </FieldLabel>
                )}
              </SearchRow>

              <SearchRow
                id="edit-travelers"
                icon={Group}
                summary={travelersLabel(draft.travelers)}
                expanded={expandedRow === 'travelers'}
                onToggle={() => toggleRow('travelers')}
              >
                <Counter>
                  <RoundButton
                    type="button"
                    aria-label="Remove traveler"
                    disabled={draft.travelers <= 1}
                    onClick={() => setDraft({ ...draft, travelers: draft.travelers - 1 })}
                  >
                    &minus;
                  </RoundButton>
                  <span aria-live="polite">{travelersLabel(draft.travelers)}</span>
                  <RoundButton
                    type="button"
                    aria-label="Add traveler"
                    disabled={draft.travelers >= MAX_TRAVELERS}
                    onClick={() => setDraft({ ...draft, travelers: draft.travelers + 1 })}
                  >
                    +
                  </RoundButton>
                </Counter>
              </SearchRow>

              <SearchRow
                id="edit-trip-type"
                icon={SwapHorizontal}
                summary={draft.tripType}
                expanded={expandedRow === 'tripType'}
                onToggle={() => toggleRow('tripType')}
              >
                <Choices role="radiogroup" aria-label="Trip type">
                  {TRIP_TYPES.map((type) => (
                    <Choice
                      key={type}
                      type="button"
                      role="radio"
                      aria-checked={draft.tripType === type}
                      onClick={() => setDraft({ ...draft, tripType: type })}
                    >
                      {type}
                    </Choice>
                  ))}
                </Choices>
              </SearchRow>
            </Rows>

            <UpdateButton type="button" onClick={handleUpdate}>
              Update Search
            </UpdateButton>
          </Panel>
        </>
      )}
    </Wrapper>
  )
}
