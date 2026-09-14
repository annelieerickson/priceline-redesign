import styled from 'styled-components'
import { Airplane, User } from 'pcln-icons'
import Button from './Button'

const Card = styled.article`
  display: grid;
  grid-template-columns: 110px minmax(0, 1fr) auto 220px;
  align-items: center;
  gap: 24px;
  padding: 12px 20px 12px 28px;
  border: 1px solid #e0e5ea;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 24, 51, 0.14);
  color: #001833;

  @media (max-width: 1000px) {
    grid-template-columns: minmax(0, 1fr);
    padding: 20px;
  }
`

const PlaneIcon = styled.div`
  display: flex;
  justify-content: center;

  @media (max-width: 1000px) {
    display: none;
  }
`

const Title = styled.h3`
  margin: 0 0 4px;
  font-size: 26px;
  font-weight: 700;
  line-height: 1.25;
`

const Subtitle = styled.p`
  margin: 0;
  font-size: 15px;
`

const Dates = styled.dl`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(180px, 1fr);
  margin: 0;
  overflow: hidden;
  border-radius: 12px;
  background: #edf0f3;
  text-align: center;

  > div {
    padding: 14px 18px;
    font-size: 17px;
    line-height: 1.45;
  }
  > div + div {
    border-left: 2px solid #fff;
  }
  dt {
    font-size: 15px;
    font-weight: 700;
  }
  dd {
    margin: 0;
  }
`

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const Travelers = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 0;
  padding: 14px 16px;
  border-radius: 12px;
  background: #edf0f3;
  font-size: 15px;
`

const ContinueButton = styled(Button)`
  height: 40px;
  font-size: 17px;
`

export default function RecentSearchCard({ search, cabin, onContinue }) {
  const { from, to } = search
  const isOneWay = search.tripType === 'One-way'
  const travelers = `${search.travelers} ${search.travelers === 1 ? 'Adult' : 'Adults'}`

  return (
    <Card>
      <PlaneIcon>
        <Airplane size={64} color="text.base" aria-hidden="true" />
      </PlaneIcon>

      <div>
        <Title>
          {from.city} ({from.code}) - {to.city} ({to.code})
        </Title>
        <Subtitle>{search.tripType} flight</Subtitle>
      </div>

      <Dates>
        <div>
          <dt>Depart</dt>
          <dd>{search.departDate}</dd>
          <dd>
            {from.code} - {to.code}
          </dd>
        </div>
        {!isOneWay && (
          <div>
            <dt>Return</dt>
            <dd>{search.returnDate}</dd>
            <dd>
              {to.code} - {from.code}
            </dd>
          </div>
        )}
      </Dates>

      <Actions>
        <Travelers>
          <User size={18} color="text.base" aria-hidden="true" />
          {cabin ? `${travelers}, ${cabin}` : travelers}
        </Travelers>
        <ContinueButton type="button" onClick={onContinue}>
          Continue Search
        </ContinueButton>
      </Actions>
    </Card>
  )
}
