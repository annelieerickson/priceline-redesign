import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Notifications, PricelineSparkle, UserCircle } from 'pcln-icons'
import PageContainer from './PageContainer'

const NAV_LINKS = ['Hotels', 'Cars', 'Flights', 'Packages', 'Cruises', 'Experiences']

// Hex values mirror pcln-design-system palette tokens
const C = {
  text: '#001833', // text.base
  blue: '#0068ef', // primary.base
  lightBlue: '#e8f2ff', // primary.light
  border: '#c0cad5', // border.base
}

const focusRing = `
  &:focus-visible {
    outline: 2px solid ${C.blue};
    outline-offset: 2px;
  }
`

const Bar = styled.header`
  background: #fff;
  border-bottom: 1px solid ${C.border};
`

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
`

const Logo = styled(Link)`
  color: ${C.blue};
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.5px;
  line-height: 1;
  text-decoration: none;
  ${focusRing}
`

const NavLinks = styled.ul`
  display: flex;
  gap: 28px;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 15px;
  font-weight: 500;
  color: ${C.text};
  white-space: nowrap;
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const PillButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 36px;
  min-width: 36px;
  padding: 0 ${(p) => (p.$iconOnly ? 0 : 14)}px;
  border: 1px solid ${C.border};
  border-radius: 999px;
  background: #fff;
  color: ${C.text};
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background: ${C.lightBlue};
  }
  ${focusRing}
`

const SignInLabel = styled.span`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 11px;
  line-height: 1.1;

  strong {
    font-size: 12px;
    font-weight: 700;
  }
`

export default function TopNav() {
  return (
    <Bar>
      <PageContainer
        as="nav"
        aria-label="Main"
        alignItems="center"
        justifyContent="space-between"
        style={{ height: 56, gap: 24 }}
      >
        <Brand>
          <Logo to="/">priceline</Logo>
          <NavLinks>
            {NAV_LINKS.map((label) => (
              <li key={label} aria-current={label === 'Flights' ? 'page' : undefined}>
                {label}
              </li>
            ))}
          </NavLinks>
        </Brand>

        <Actions>
          <PillButton type="button">
            <PricelineSparkle size={18} color="primary.base" aria-hidden="true" />
            Penny
          </PillButton>
          <PillButton type="button" $iconOnly aria-label="Notifications">
            <Notifications size={18} color="text.base" />
          </PillButton>
          <PillButton type="button">Help</PillButton>
          <PillButton type="button">Find My Trip</PillButton>
          <PillButton type="button">
            <UserCircle size={20} color="text.base" aria-hidden="true" />
            <SignInLabel>
              Sign in
              <strong>JOIN VIP</strong>
            </SignInLabel>
          </PillButton>
        </Actions>
      </PageContainer>
    </Bar>
  )
}
