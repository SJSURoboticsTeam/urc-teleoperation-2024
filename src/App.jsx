import { useState } from 'react'
import './App.css'
import { styled, useTheme } from '@mui/material/styles'
import { CommandContext } from './contexts/CommandContext'

import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import Sidebar from './sidebar/Sidebar'
import ComponentPane from './panes/ComponentPane'

const drawerWidth = 600

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}))

export default function App () {
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const [rootPane, setRootPane] = useState({ type: 'test' })
  const [commands, setCommands] = useState({ 
      arm:{"speed":0,"rotunda":0,"elbow":0,"shoulder":0,"wristPitch":0,"wristRoll":0,"endEffector":0},
      drive:{"mode":"drive","speed":0,"angle":0},
      autonomy:{}, 
      science:{"play":true,"eStop":false,"samplesReceived":false} 
    })

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar theme={theme} open={open} width={drawerWidth} handleDrawerClose={() => { setOpen(false) }} />
      <AppBar position='fixed' open={open}>
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            onClick={() => { setOpen(true) }}
            edge='start'
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          {!open &&
            <Typography variant='h6' align='left' noWrap component='div'>
              SJSU Robotics
            </Typography>}
        </Toolbar>
      </AppBar>
      <Box
        component='main'
        sx={{
          p: 0,
          position: 'absolute',
          inset: 0,
          top: '64px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <CommandContext 
          commands={commands}
          setCommands={setCommands}
        >
          <ComponentPane state={rootPane} onStateChange={setRootPane} style={{ position: 'relative', flexGrow: 1 }} />
        </CommandContext>
      </Box>
    </Box>
  )
}
