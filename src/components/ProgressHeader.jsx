import { Box } from 'pcln-design-system'
import EditSearchPopover from './EditSearchPopover'
import StepProgress from './StepProgress'
import PageContainer from './PageContainer'

export default function ProgressHeader({ currentStep }) {
  return (
    <Box
      borderBottom="1px solid"
      borderColor="border.base"
      style={{ background: '#edf0f3' /* background.base */ }}
    >
      <PageContainer alignItems="center" style={{ gap: 24, paddingTop: 10, paddingBottom: 10 }}>
        <EditSearchPopover />
        <StepProgress currentStep={currentStep} />
      </PageContainer>
    </Box>
  )
}
