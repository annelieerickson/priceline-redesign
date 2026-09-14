import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useToast } from 'pcln-design-system'
import { Baggage, Check, ChevronLeft, Close, Refund, Seat } from 'pcln-icons'
import TopNav from '../components/TopNav'
import FlightDetailsCard from '../components/FlightDetailsCard'
import Button from '../components/Button'
import { useBooking } from '../context/BookingContext'
import { formatMoney } from '../utils/format'
import { textSize, uiZoom } from '../config/featureFlags'

// Hex values mirror pcln-design-system palette tokens
const C = {
  text: '#001833', // text.base
  heading: '#003c8a', // text.heading
  blue: '#0068ef', // primary.base
  lightBlue: '#e8f2ff', // primary.light
  green: '#0a0', // secondary.base
  greenTone: '#080', // secondary.tone
  greenDark: '#060', // secondary.dark
  greenLight: '#ecf7ec', // secondary.light
  surface: '#f4f6f8', // background.light
  grey: '#edf0f3', // background.base
  border: '#c0cad5', // border.base
  navy: '#001833', // background.darkest
  navyInner: '#0b2a4a',
}

const CONTENT_WIDTH = 1180

const focusRing = (color = C.blue) => `
  &:focus-visible {
    outline: 2px solid ${color};
    outline-offset: 2px;
  }
`

const TripBar = styled.div`
  border-bottom: 1px solid ${C.border};
  background: ${C.grey};
`

const TripBarInner = styled.div`
  display: flex;
  align-items: center;
  max-width: ${CONTENT_WIDTH}px;
  height: 64px;
  margin: 0 auto;
  padding: 0 24px;
  color: ${C.text};
`

const BackSlot = styled.div`
  flex-shrink: 0;
  width: 300px;
`

const BackLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0;
  border: 0;
  background: none;
  color: ${C.blue};
  font-family: inherit;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;

  &:hover span {
    text-decoration: underline;
  }
  ${focusRing()}
`

const TripRoute = styled.p`
  margin: 0;
  font-size: 18px;

  strong {
    margin-right: 12px;
    font-weight: 700;
  }
`

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  align-items: start;
  gap: 48px;
  /* Width and side padding are divided by the zoom so the content keeps its
     on-screen width and lines up with the trip bar above it */
  max-width: ${CONTENT_WIDTH / uiZoom}px;
  margin: 0 auto;
  padding: 24px ${24 / uiZoom}px 64px;
  color: ${C.text};
  ${uiZoom !== 1 ? `zoom: ${uiZoom};` : ''}

  @media (max-width: 960px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

const Banner = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
  border-radius: 12px;
  background: ${(p) => (p.$success ? C.greenLight : C.surface)};
  font-size: 15px;

  & + & {
    margin-top: 12px;
  }
`

const BannerText = styled.p`
  flex: 1;
  margin: 0;
`

const SuccessIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${C.green};
`

const SuccessText = styled(BannerText)`
  color: ${C.greenDark};
  font-size: 17px;

  strong {
    font-weight: 700;
  }
`

const DismissButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;

  &:hover {
    background: rgba(0, 102, 0, 0.1);
  }
  ${focusRing(C.greenDark)}
`

const SectionHeading = styled.h2`
  margin: 32px 0 14px;
  font-size: 30px;
  font-weight: 700;
  line-height: 1.2;
  color: ${C.heading};
`

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 0 24px;
`

const InfoCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 132px;
  padding: 16px 20px;
  border: 1px solid ${C.border};
  border-radius: 12px;
  font-size: 15px;
  line-height: 1.5;

  p {
    margin: 0;
  }
`

const AirlineLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: auto;
`

const AirlineLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  border: 0;
  background: none;
  color: ${C.blue};
  font-family: inherit;
  font-size: 15px;
  text-align: left;
  text-decoration: underline;
  cursor: pointer;
  ${focusRing()}
`

const SummaryCard = styled.aside`
  position: sticky;
  top: 16px;
  padding: 20px;
  border-radius: 16px;
  background: ${C.navy};
  color: #fff;
`

const Breakdown = styled.div`
  padding: 14px 20px;
  border-radius: 8px;
  background: ${C.navyInner};
  font-size: 16px;

  h2 {
    margin: 0 0 6px;
    font-size: 17px;
    font-weight: 700;
  }
`

const BreakdownRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding-left: 20px;
  line-height: 1.7;
`

const TotalRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 18px 0 16px;
`

const TotalLabel = styled.span`
  font-size: 24px;
`

const TotalAmount = styled.span`
  font-size: 32px;
  font-weight: 700;
  line-height: 1;

  sup {
    position: relative;
    top: -2px;
    font-size: ${textSize(14)}px;
    vertical-align: top;
  }
`

const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
`

// White focus ring stays visible against the navy summary card
const CheckoutButton = styled(Button)`
  width: 100%;
  height: 48px;
  font-size: 17px;
  ${focusRing('#fff')}
`

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { search, departure, returnSelection } = useBooking()
  const { addToast } = useToast()
  const [showPriceBanner, setShowPriceBanner] = useState(true)

  if (!departure || !returnSelection) {
    navigate('/departure')
    return null
  }

  const costPerPerson = departure.fare.price + returnSelection.fare.price
  const totalCharges = costPerPerson * search.travelers
  const [totalDollars, totalCents] = formatMoney(totalCharges).split('.')
  const airlines = [...new Set([departure.flight.airline, returnSelection.flight.airline])]

  const handleContinue = () => {
    addToast({
      children:
        "This is the end of the redesigned flow's scope — Priceline's existing seat, baggage, and payment checkout picks up from here.",
      lifespan: 5000,
    })
  }

  const openAirlineInfo = (airline, topic) => {
    addToast({
      children: `${airline} ${topic} information opens on the airline's website.`,
      lifespan: 4000,
    })
  }

  return (
    <div>
      <TopNav />
      <TripBar>
        <TripBarInner>
          <BackSlot>
            <BackLink type="button" onClick={() => navigate('/return')}>
              <ChevronLeft size={18} color="primary.base" aria-hidden="true" />
              <span>Back to Listings</span>
            </BackLink>
          </BackSlot>
          <TripRoute>
            <strong>
              {search.from.code} &rarr; {search.to.code}
            </strong>
            {search.departDate} - {search.returnDate}
          </TripRoute>
        </TripBarInner>
      </TripBar>

      <Layout>
        <main>
          {showPriceBanner && (
            <Banner $success role="status">
              <SuccessIcon>
                <Check size={18} color="white" aria-hidden="true" />
              </SuccessIcon>
              <SuccessText>
                <strong>Price confirmed.</strong> It&rsquo;s time to book!
              </SuccessText>
              <DismissButton
                type="button"
                aria-label="Dismiss price confirmation"
                onClick={() => setShowPriceBanner(false)}
              >
                <Close size={24} color="secondary.dark" />
              </DismissButton>
            </Banner>
          )}
          <Banner>
            <Refund size={28} color="secondary.base" aria-hidden="true" />
            <BannerText>
              <strong>Fully refundable</strong> on Priceline if cancelled within{' '}
              <strong>24 hours after booking</strong>
            </BannerText>
          </Banner>

          <SectionHeading>Departure Information</SectionHeading>
          <FlightDetailsCard
            flight={departure.flight}
            fare={departure.fare}
            dateLabel={search.departDate}
          />

          <SectionHeading>Return Information</SectionHeading>
          <FlightDetailsCard
            flight={returnSelection.flight}
            fare={returnSelection.fare}
            dateLabel={search.returnDate}
          />

          <InfoGrid>
            <section>
              <SectionHeading>Seat Information</SectionHeading>
              <InfoCard>
                <p>Secure your preferred seat in the next step, or on the airline&rsquo;s website later.</p>
                <AirlineLinks>
                  {airlines.map((airline) => (
                    <AirlineLink key={airline} type="button" onClick={() => openAirlineInfo(airline, 'seat')}>
                      <Seat size={20} color="primary.base" aria-hidden="true" />
                      {airline} Seat Information
                    </AirlineLink>
                  ))}
                </AirlineLinks>
              </InfoCard>
            </section>
            <section>
              <SectionHeading>Baggage Information</SectionHeading>
              <InfoCard>
                <p>Extra bags for this flight can be purchased through the airline after booking.</p>
                <AirlineLinks>
                  {airlines.map((airline) => (
                    <AirlineLink key={airline} type="button" onClick={() => openAirlineInfo(airline, 'baggage')}>
                      <Baggage size={20} color="primary.base" aria-hidden="true" />
                      {airline} Baggage Information
                    </AirlineLink>
                  ))}
                </AirlineLinks>
              </InfoCard>
            </section>
          </InfoGrid>
        </main>

        <SummaryCard aria-labelledby="charges-heading">
          <Breakdown>
            <h2 id="charges-heading">Summary of Charges</h2>
            <BreakdownRow>
              <span>Cost per person</span>
              <span>${formatMoney(costPerPerson)}</span>
            </BreakdownRow>
            <BreakdownRow>
              <span>Number of travelers</span>
              <span>{search.travelers}</span>
            </BreakdownRow>
          </Breakdown>
          <TotalRow>
            <TotalLabel>Total price</TotalLabel>
            <TotalAmount>
              <VisuallyHidden>${formatMoney(totalCharges)}</VisuallyHidden>
              <span aria-hidden="true">
                <sup>$</sup>
                {totalDollars}
                <sup>.{totalCents}</sup>
              </span>
            </TotalAmount>
          </TotalRow>
          <CheckoutButton type="button" onClick={handleContinue}>
            Continue to Checkout
          </CheckoutButton>
        </SummaryCard>
      </Layout>
    </div>
  )
}
