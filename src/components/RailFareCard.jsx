import styled from 'styled-components'
import { Close } from 'pcln-icons'
import Button from './Button'

// Compact fare card used by FareRail (featureFlags.fareOptionsView === 'rail')

// Hex values mirror pcln-design-system palette tokens
const C = {
  text: '#001833', // text.base
  textLight: '#4f6f8f', // text.light
  green: '#0a0', // secondary.base
  border: '#868d95', // border.tone
}

// Perks are listed not-included first, then paid add-ons, then included
const PERK_GROUPS = [false, 'fee', true]

const Card = styled.article`
  padding: 12px 14px;
  border: 1px solid ${C.border};
  border-radius: 12px;
  background: #fff;
  color: ${C.text};
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
`

const Name = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.2;
`

const Price = styled.span`
  flex-shrink: 0;
  font-size: 28px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.5px;
  color: ${(p) => (p.$highlight ? C.green : C.text)};
`

const PerkList = styled.ul`
  margin: 0;
  padding: 6px 0;
  list-style: none;
  font-size: 13px;
  line-height: 1.35;

  &:first-of-type {
    padding-top: 0;
  }
  & + & {
    border-top: 1px solid ${C.border};
  }
`

const Perk = styled.li`
  display: flex;
  align-items: center;
  gap: 4px;
`

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 10px;
`

const Note = styled.span`
  font-size: 12px;
  color: ${C.textLight};
`

const SelectButton = styled(Button)`
  flex-shrink: 0;
  height: 36px;
  margin-left: auto;
  padding: 0 26px;
  font-size: 14px;
`

export default function RailFareCard({ fare, highlightPrice = false, note, onSelect }) {
  const groups = PERK_GROUPS.map((status) =>
    fare.perks.filter((perk) => perk.included === status),
  ).filter((perks) => perks.length > 0)

  return (
    <Card>
      <Header>
        <Name>{fare.name}</Name>
        <Price $highlight={highlightPrice}>${fare.price.toLocaleString()}</Price>
      </Header>

      {groups.map((perks) => (
        <PerkList key={String(perks[0].included)}>
          {perks.map((perk) => (
            <Perk key={perk.label}>
              {perk.included === false && <Close size={12} color="text.base" aria-hidden="true" />}
              {perk.label}
            </Perk>
          ))}
        </PerkList>
      ))}

      <Footer>
        {note && <Note>{note}</Note>}
        <SelectButton
          aria-label={`Select ${fare.name}, $${fare.price.toLocaleString()}`}
          onClick={() => onSelect(fare)}
        >
          Select
        </SelectButton>
      </Footer>
    </Card>
  )
}
