import styled, { css } from 'styled-components'

const BLUE = '#0068ef' // primary.base

// Shared look for every action button: white with a blue outline and text,
// filling solid blue with white text on hover. Icons inside should omit their
// color prop so they inherit currentColor and turn white with the text.
const outlineButtonStyles = css`
  border: 1.5px solid ${BLUE};
  background: #fff;
  color: ${BLUE};
  font-family: inherit;
  cursor: pointer;
  transition:
    background-color 120ms ease,
    color 120ms ease;

  &:hover:not(:disabled) {
    background: ${BLUE};
    color: #fff;
  }
  &:focus-visible {
    outline: 2px solid ${BLUE};
    outline-offset: 2px;
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

// Pill button with the shared look. Extend with styled(Button) to adjust size.
const Button = styled.button.attrs((p) => ({ type: p.type ?? 'button' }))`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 42px;
  padding: 0 20px;
  border-radius: 999px;
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;
  ${outlineButtonStyles}
`

export default Button
