import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

export default function Layouts () {
  return (
    <Box sx={{ width: 1, height: 1, position: 'relative' }}>
      <Button variant="contained" onClick={() => setDriveParams(defaults)}>
          Layout 1
      </Button>
      <Typography>
        Layout saving and loading options go here
      </Typography>
    </Box>
  )
}
