import styled from 'styled-components'
import Modal from './Modal'

const Explanation = styled.p`
  margin: 6px 0 0;
  font-size: 16px;
  line-height: 1.5;
`

export default function BundleDialog({ open, onOpenChange, onBrowseSeparately, onShowBundled }) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Your return flight options are bundled with your outbound flight"
      description="Choose whether to browse bundled deals or all return flights separately"
      minHeight={380}
      actions={[
        { label: 'Browse flights separately', onClick: onBrowseSeparately },
        { label: 'Show bundled deals', onClick: onShowBundled },
      ]}
    >
      <Explanation>
        Priceline bundles outbound and return flights together when it unlocks a lower price
        &mdash; sometimes on the same airline, sometimes not. If you&rsquo;d rather pick your
        return flight and cabin class independently, you can browse all options, though the price
        may be higher.
      </Explanation>
    </Modal>
  )
}
