import { Box, Button } from '@mui/material'
import Typography from '@mui/material/Typography'


import { useLayouts } from '../contexts/LayoutContext'

const layouts = {
  front : { type: 'vSplit', children: [{ type: 'status' }, { type: 'camera'}] },
  science : { type: 'vSplit', children: [{ type: 'manual' }, { type: 'camera' }]}
}

export default function Layouts () {
  const [,setLayout] = useLayouts()
  
  return (
    <Box sx={{ width: 1, height: 1, position: 'relative' }}>
      <Button variant="contained" onClick={() => setLayout(layouts.front)}>
          Front View
      </Button>
      <Button variant="contained" onClick={() => setLayout(layouts.science)}>
          Science
      </Button>
      <Typography>
        Layout saving and loading options go here
      </Typography>
    </Box>
  )
}
