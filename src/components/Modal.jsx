import styled from 'styled-components'
import { Dialog } from 'pcln-design-system'
import { Close } from 'pcln-icons'
import Button from './Button'

// Hex values mirror pcln-design-system palette tokens
const C = {
  text: '#001833', // text.base
  blue: '#0068ef', // primary.base
  lightBlue: '#e8f2ff', // primary.light
}

const focusRing = `
  &:focus-visible {
    outline: 2px solid ${C.blue};
    outline-offset: 2px;
  }
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
  min-height: ${(p) => (p.$minHeight ? `${p.$minHeight}px` : 'auto')};
  padding: 22px 24px 24px;
  color: ${C.text};
`

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
`

const Title = styled.h2`
  margin: 0;
  font-size: 26px;
  font-weight: 600;
  line-height: 1.25;
`

const CloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  margin: -4px -8px 0 0;
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

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
  padding-top: 22px;
`

const OutlineButton = styled(Button)`
  height: 44px;
  padding: 0 18px;
`

// Design-system Dialog (overlay, focus trap, Escape) with the wireframe's header and pill actions
export default function Modal({ open, onOpenChange, title, description, minHeight, actions = [], children }) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      ariaTitle={title}
      ariaDescription={description}
      showCloseButton={false}
      size="md"
    >
      {/* data-modal-body lets index.css widen this dialog to the wireframe width */}
      <Body data-modal-body $minHeight={minHeight}>
        <Header>
          <Title aria-hidden="true">{title}</Title>
          <CloseButton type="button" aria-label="Close" onClick={() => onOpenChange(false)}>
            <Close size={28} color="text.base" />
          </CloseButton>
        </Header>

        {children}

        {actions.length > 0 && (
          <Actions>
            {actions.map(({ label, onClick }) => (
              <OutlineButton key={label} type="button" onClick={onClick}>
                {label}
              </OutlineButton>
            ))}
          </Actions>
        )}
      </Body>
    </Dialog>
  )
}
