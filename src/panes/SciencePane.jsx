import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

export default function SciencePane () {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 15, height: '90vh' }}>
      <Button variant='contained' color='primary'>
        Pause/Play
      </Button>

      <Button variant='outlined' color='secondary'>
        EMERGENCY STOP
      </Button>
    </Box>
  )
}
