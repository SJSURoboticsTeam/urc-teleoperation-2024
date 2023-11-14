import { useState } from 'react'
import { styled } from '@mui/material/styles'

import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

import sidebars from '.'
import { Card } from '@mui/material'

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end'
}))

export default function Sidebar ({ theme, open, width, handleDrawerClose }) {
  const [tabIndex, setTabIndex] = useState(0)
  const currentSidebar = Object.values(sidebars)[tabIndex]
  const SidebarComponent = currentSidebar?.Component

  return (
    <Drawer
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box'
        }
      }}
      variant='persistent'
      anchor='left'
      open={open}
    >
      <DrawerHeader sx={{ justifyContent: 'space-between' }}>
        {open &&
          <Typography variant='h6' noWrap component='div'>
            SJSU Robotics
          </Typography>}
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <Box
        sx={{
          overflow: 'auto',
          display: 'grid',
          gridTemplateColumns: '11em 1fr',
          gap: '1rem'
        }}
      >
        <Tabs
          orientation='vertical'
          variant='scrollable'
          value={tabIndex}
          onChange={(e, newValue) => setTabIndex(newValue)}
        >
          {Object.values(sidebars).map(({ title, Icon }, index) => (
            <Tab
              label={title}
              key={`sidebar-tab=${index}`}
              sx={{ justifyContent: 'flex-start', alignItems: 'flex-center' }}
              icon={<Icon />}
              iconPosition='start'
            />
          ))}
        </Tabs>
        <Card>
          <Box>
            <SidebarComponent />
          </Box>
        </Card>
      </Box>

    </Drawer>
  )
}
