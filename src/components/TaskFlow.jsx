import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { Checklist, Close } from 'pcln-icons'
import Button from './Button'

// Hex values mirror pcln-design-system palette tokens
const C = {
  text: '#001833', // text.base
  textLight: '#4f6f8f', // text.light
  blue: '#0068ef', // primary.base
  lightBlue: '#e8f2ff', // primary.light
  border: '#c0cad5', // border.base
  surface: '#f4f6f8', // background.light
}

const STORAGE_KEY = 'taskFlowOpen'

// Order of the screens in the flow, used to mark steps as done
const ROUTES = ['/', '/departure', '/return', '/checkout']

const STEPS = [
  {
    route: '/',
    title: 'Search for a round-trip flight',
    detail: 'Chicago (ORD) to Sarasota (SRQ), Mar 14–20, 3 travelers.',
  },
  {
    route: '/departure',
    title: 'View and select a departure flight',
  },
  {
    route: '/departure',
    title: 'Pick a fare for the departure',
    detail: 'Cabin class is chosen here, instead of on the checkout page',
  },
  {
    route: '/departure',
    title: 'Confirm the departure details',
    detail: 'Review the flight, fare, and what the fare includes.',
  },
  {
    route: '/return',
    title: 'Review bundled return flights',
    detail: 'Bundled flights are listed first in a collapsible section; hover the info icon to learn how bundling works. Flights booked separately are listed below.',
  },
  {
    route: '/return',
    title: 'Pick the return flight',
    detail: 'Keep the same cabin class, or open the other fares.',
  },
  {
    route: '/return',
    title: 'Confirm and continue to checkout',
    detail: 'Same confirmation step as the departure.',
  },
  {
    route: '/checkout',
    title: 'Review the trip and total',
    detail: 'Expand each flight for legs and layovers, then check the charges.',
  },
]

const Trigger = styled(Button)`
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 1200;
  width: 52px;
  height: 52px;
  padding: 0;
  border-radius: 50%;
  box-shadow: 0 4px 14px rgba(0, 24, 51, 0.25);
`

const Panel = styled.div`
  position: fixed;
  right: 20px;
  bottom: 84px;
  z-index: 1200;
  display: flex;
  flex-direction: column;
  width: min(340px, calc(100vw - 32px));
  max-height: min(560px, calc(100vh - 140px));
  padding: 16px 18px 18px;
  border: 1px solid ${C.border};
  border-radius: 16px;
  background: #fff;
  color: ${C.text};
  box-shadow: 0 8px 28px rgba(0, 24, 51, 0.26);
  outline: none;
`

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`

const Title = styled.h2`
  margin: 0;
  font-size: 19px;
  font-weight: 700;
`

const Intro = styled.p`
  margin: 4px 0 12px;
  font-size: 13px;
  line-height: 1.4;
  color: ${C.textLight};
`

const CloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  margin: -4px -6px 0 0;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;

  &:hover {
    background: ${C.lightBlue};
  }
  &:focus-visible {
    outline: 2px solid ${C.blue};
    outline-offset: 2px;
  }
`

const Steps = styled.ol`
  margin: 0;
  padding: 0;
  overflow-y: auto;
  list-style: none;
  counter-reset: step;
`

const Step = styled.li`
  counter-increment: step;
  display: grid;
  grid-template-columns: 26px minmax(0, 1fr);
  gap: 4px 10px;
  padding: 8px 10px;
  border-radius: 10px;
  background: ${(p) => (p.$current ? C.lightBlue : 'transparent')};

  &::before {
    content: counter(step);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${(p) => (p.$current || p.$done ? C.blue : C.surface)};
    color: ${(p) => (p.$current || p.$done ? '#fff' : C.textLight)};
    font-size: 13px;
    font-weight: 700;
  }
`

const StepTitle = styled.div`
  font-size: 14px;
  font-weight: ${(p) => (p.$current ? 700 : 600)};
  line-height: 1.3;
`

const StepDetail = styled.div`
  grid-column: 2;
  font-size: 13px;
  line-height: 1.4;
  color: ${C.textLight};
`

const YouAreHere = styled.span`
  display: inline-block;
  margin-left: 6px;
  padding: 1px 6px;
  border-radius: 999px;
  background: ${C.blue};
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  vertical-align: 1px;
`

const readStoredOpen = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

// Floating helper that documents the flow this prototype was designed for.
// Rendered outside the routes, so it stays available on every screen.
export default function TaskFlow() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(readStoredOpen)
  const panelRef = useRef(null)
  const triggerRef = useRef(null)
  const userToggled = useRef(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(open))
    } catch {
      // Storage can be unavailable; the panel still works for this session
    }
    if (!userToggled.current) return
    userToggled.current = false
    ;(open ? panelRef : triggerRef).current?.focus({ preventScroll: true })
  }, [open])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !e.defaultPrevented) {
        userToggled.current = true
        setOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  const toggle = (value) => {
    userToggled.current = true
    setOpen(value)
  }

  const currentRouteIndex = ROUTES.indexOf(pathname)
  const firstStepOnRoute = STEPS.findIndex((step) => step.route === pathname)

  return (
    <>
      {open && (
        <Panel ref={panelRef} role="dialog" aria-labelledby="task-flow-title" tabIndex={-1}>
          <Header>
            <Title id="task-flow-title">Task flow</Title>
            <CloseButton type="button" aria-label="Hide task flow" onClick={() => toggle(false)}>
              <Close size={22} color="text.base" />
            </CloseButton>
          </Header>
          <Intro>The path this prototype is designed for.</Intro>

          <Steps>
            {STEPS.map((step, i) => {
              const stepRouteIndex = ROUTES.indexOf(step.route)
              const onThisScreen = step.route === pathname
              const done = stepRouteIndex > -1 && stepRouteIndex < currentRouteIndex
              return (
                <Step
                  key={step.title}
                  $current={onThisScreen}
                  $done={done}
                  aria-current={i === firstStepOnRoute ? 'step' : undefined}
                >
                  <StepTitle $current={onThisScreen}>
                    {step.title}
                    {i === firstStepOnRoute && <YouAreHere>You are here</YouAreHere>}
                  </StepTitle>
                  <StepDetail>{step.detail}</StepDetail>
                </Step>
              )
            })}
          </Steps>
        </Panel>
      )}

      <Trigger
        ref={triggerRef}
        aria-expanded={open}
        aria-label={open ? 'Hide task flow' : 'Show task flow'}
        onClick={() => toggle(!open)}
      >
        <Checklist size={24} aria-hidden="true" />
      </Trigger>
    </>
  )
}
