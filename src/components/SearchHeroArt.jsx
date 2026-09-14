import styled from 'styled-components'
import { Flights } from 'pcln-icons'
import { heroImage } from '../data/assets'

// Decorative shapes behind/beside the search card, modeled on priceline.com's flights hero
const Art = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 52%;
  pointer-events: none;

  @media (max-width: 1100px) {
    display: none;
  }
`

const Circle = styled.div`
  position: absolute;
  border-radius: 50%;
`

const BlueBlob = styled(Circle)`
  top: -360px;
  left: -60px;
  width: 740px;
  height: 740px;
  background: #0068ef;
`

const WhiteCutout = styled(Circle)`
  top: -250px;
  left: 150px;
  width: 400px;
  height: 300px;
  background: #fff;
`

const LightCircle = styled(Circle)`
  right: -220px;
  bottom: -300px;
  width: 640px;
  height: 640px;
  background: #e8f2ff;
`

const Panel = styled.div`
  position: absolute;
  top: 58px;
  right: 0;
  bottom: 48px;
  left: 20%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 28px;
  /* Left padding keeps the illustration clear of the search card overlapping the panel */
  padding: 0 48px 0 96px;
  overflow: hidden;
  border-radius: 999px 0 0 999px;
  background: linear-gradient(135deg, #0a63e8 0%, #0047b8 100%);

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const Phone = styled.div`
  flex-shrink: 0;
  width: 116px;
  height: 224px;
  padding: 16px 10px;
  border: 6px solid #0f1b2d;
  border-radius: 26px;
  background: #fff;
  box-shadow: 0 16px 32px rgba(0, 16, 48, 0.4);
  color: #001833;
  transform: rotate(-8deg);
  text-align: center;
`

const PhoneBrand = styled.div`
  color: #0068ef;
  font-size: 13px;
  font-weight: 800;
`

const PhoneDeal = styled.div`
  margin: 18px 0 6px;
  padding: 10px 6px;
  border-radius: 10px;
  background: #e8f2ff;
  font-size: 11px;
  font-weight: 600;

  strong {
    display: block;
    margin-top: 4px;
    color: #0a0;
    font-size: 26px;
  }
`

const Wordmark = styled.div`
  flex-shrink: 0;
  color: #fff;
  font-size: 32px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -1px;

  @media (max-width: 1320px) {
    display: none;
  }

  span {
    display: block;
    margin-top: 4px;
    color: #fedc2a;
    font-size: 42px;
    font-style: italic;
    font-weight: 900;
    letter-spacing: 0;
    text-shadow: 3px 3px 0 #0f1b2d;
  }
`

export default function SearchHeroArt() {
  return (
    <Art aria-hidden="true">
      <LightCircle />
      <BlueBlob />
      <WhiteCutout />
      <Panel>
        {heroImage ? (
          <img src={heroImage} alt="" />
        ) : (
          <>
            <Phone>
              <PhoneBrand>priceline</PhoneBrand>
              <PhoneDeal>
                Flight deals
                <strong>60%</strong>
                off select routes
              </PhoneDeal>
              <Flights size={40} color="primary.base" />
            </Phone>
            <Wordmark>
              priceline
              <span>NEGOTIATOR</span>
            </Wordmark>
          </>
        )}
      </Panel>
    </Art>
  )
}
