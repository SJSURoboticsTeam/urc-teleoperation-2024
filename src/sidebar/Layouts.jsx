import { Box, Button, Grid } from '@mui/material'


import { useLayouts } from '../contexts/LayoutContext'

const layouts = {
  front : { type: 'vSplit', children: [{ type: 'status' }, { type: 'camera'}] },
  science : { type: 'vSplit', children: [{ type: 'manualInput' }, { type: 'hSplit', children: [{type: 'camera' }, {type: 'manualInput'}]}]}
}

export default function Layouts () {
  const [,setLayout] = useLayouts()
  
  return (
    <Box sx={{ width: 1, height: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={6} sm={3}>
          <Button variant="outlined" fullWidth onClick={() => setLayout(layouts.front)}>
            Front View
          </Button>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Button variant="outlined" fullWidth onClick={() => setLayout(layouts.science)}>
            Science View
          </Button>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Button variant="outlined" fullWidth onClick={() => setLayout(layouts.science)}>
            Layout 3
          </Button>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Button variant="outlined" fullWidth onClick={() => setLayout(layouts.science)}>
            Layout 4
          </Button>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Button variant="outlined" fullWidth onClick={() => setLayout(layouts.science)}>
            Layout 5
          </Button>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Button variant="outlined" fullWidth onClick={() => setLayout(layouts.science)}>
            Layout 6
          </Button>
        </Grid>
      </Grid>
      {/* <Button variant="outlined" onClick={() => setLayout(layouts.front)}>
          Front View
      </Button> */}
      {/* <Button variant="outlined" onClick={() => setLayout(layouts.science)}>
          Science
      </Button> */}
    </Box>
  )
}
