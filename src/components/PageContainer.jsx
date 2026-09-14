import { Flex } from 'pcln-design-system'

// Shared horizontal bounds so the nav, progress header, and page body left-align
export default function PageContainer({ style, ...props }) {
  return (
    <Flex
      width="100%"
      maxWidth="1440px"
      mx="auto"
      {...props}
      style={{ paddingLeft: 24, paddingRight: 24, ...style }}
    />
  )
}
