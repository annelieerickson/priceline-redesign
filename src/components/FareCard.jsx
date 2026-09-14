import { createElement } from 'react'
import styled from 'styled-components'
import {
  Bed,
  CarryOnBag,
  Check,
  CheckedBag,
  Close,
  Refund,
  Restaurant,
  SeatEconomy,
  Star,
  SwapCurved,
  UserChecked,
  Wifi,
} from 'pcln-icons'
import AirlineLogo from './AirlineLogo'
import Button from './Button'
import { textSize } from '../config/featureFlags'

// Hex values mirror pcln-design-system palette tokens
const C = {
  text: '#001833', // text.base
  textLight: '#4f6f8f', // text.light
  green: '#0a0', // secondary.base
  orange: '#c35000', // alert.dark
  grey: '#868d95', // border.tone
  border: '#c0cad5', // border.base
  divider: '#e0e5ea', // border.tint
}

// Perks are listed not-included first, then paid add-ons, then included
const PERK_GROUPS = [false, 'fee', true]

// First matching pattern picks the icon; order matters ("Carry-On Bag" before "Checked Bag")
const PERK_ICONS = [
  [/wifi/i, Wifi],
  [/lie-flat/i, Bed],
  [/recliner|legroom|seat/i, SeatEconomy],
  [/carry-on/i, CarryOnBag],
  [/checked bag/i, CheckedBag],
  [/cancel/i, Refund],
  [/change/i, SwapCurved],
  [/lounge/i, Star],
  [/dining/i, Restaurant],
  [/boarding/i, UserChecked],
]
const iconFor = (label) => PERK_ICONS.find(([pattern]) => pattern.test(label))?.[1] ?? Check

const Card = styled.article`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 14px 16px 16px;
  border: 1px solid ${C.border};
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 24, 51, 0.12);
  color: ${C.text};
`

const Name = styled.h4`
  margin: 10px 0 8px;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
`

const Perks = styled.div`
  flex: 1;
`

const PerkGroup = styled.ul`
  margin: 0;
  padding: 6px 0;
  list-style: none;

  & + & {
    border-top: 1px solid ${C.divider};
  }
`

const Perk = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 0;
  font-size: ${textSize(14)}px;
  line-height: 1.3;
`

const PerkIcon = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 26px;
  height: 26px;
`

// Small status badge on the icon's lower-right corner, as on priceline.com
const Badge = styled.span`
  position: absolute;
  right: -4px;
  bottom: -2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border: 1.5px solid #fff;
  border-radius: 50%;
  background: ${(p) => (p.$fee ? C.orange : C.green)};
  color: #fff;
  font-size: 9px;
  font-weight: 800;
  line-height: 1;
`

const PriceBlock = styled.div`
  margin-top: 12px;
  text-align: center;
`

const Price = styled.div`
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: ${(p) => (p.$highlight ? C.green : C.text)};
`

const Note = styled.div`
  margin-top: 2px;
  font-size: ${textSize(13)}px;
  color: ${C.textLight};
`

const SelectButton = styled(Button)`
  align-self: center;
  height: 38px;
  margin-top: 10px;
  padding: 0 30px;
`

function PerkRow({ perk }) {
  return (
    <Perk>
      <PerkIcon aria-hidden="true">
        {perk.included === false ? (
          <Close size={22} color="border.tone" />
        ) : (
          <>
            {/* createElement: the icon is looked up, not a component defined during render */}
            {createElement(iconFor(perk.label), { size: 22, color: 'text.base' })}
            <Badge $fee={perk.included === 'fee'}>
              {perk.included === 'fee' ? '$' : <Check size={10} color="white" />}
            </Badge>
          </>
        )}
      </PerkIcon>
      {perk.label}
    </Perk>
  )
}

export default function FareCard({ fare, flight, highlightPrice = false, note, onSelect }) {
  const groups = PERK_GROUPS.map((status) =>
    fare.perks.filter((perk) => perk.included === status),
  ).filter((perks) => perks.length > 0)

  return (
    <Card>
      <AirlineLogo flight={flight} size={28} />
      <Name>{fare.name}</Name>

      <Perks>
        {groups.map((perks) => (
          <PerkGroup key={String(perks[0].included)}>
            {perks.map((perk) => (
              <PerkRow key={perk.label} perk={perk} />
            ))}
          </PerkGroup>
        ))}
      </Perks>

      <PriceBlock>
        <Price $highlight={highlightPrice}>${fare.price.toLocaleString()}</Price>
        {note && <Note>{note}</Note>}
      </PriceBlock>

      <SelectButton
        aria-label={`Select ${fare.name}, $${fare.price.toLocaleString()}`}
        onClick={() => onSelect(fare)}
      >
        Select
      </SelectButton>
    </Card>
  )
}
