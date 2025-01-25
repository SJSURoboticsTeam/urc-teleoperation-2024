import { useState } from 'react'
import { useTheme } from '@mui/material/styles'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

import ArrowDropUp from '@mui/icons-material/ArrowDropUp'
import Close from '@mui/icons-material/Close'

import panes from '.'

export default function ComponentPane ({ style, state, onStateChange, onClose }) {
  state = state || {}
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = useState(null)

  const menuOptions = panes

  const paneChoice = state && state.type && menuOptions[state.type] ? state.type : 'test'
  const InnerComponent = menuOptions[paneChoice]?.Component
  const innerStyle = { position: 'absolute', left: 0, top: 0, bottom: 0, right: 0, overflowX: 'hidden', overflowY: 'hidden' }

  return (
    <Box
      style={style}
    >
      <InnerComponent
        style={innerStyle}
        state={state}
        onStateChange={newState => {
          console.log(newState)
          onStateChange(newState)
        }}
      />
      {state.type !== 'vSplit' && state.type !== 'hSplit' && (
        <>
          <Button
            variant='contained'
            onClick={e => setAnchorEl(e.target)}
            sx={{
              position: 'absolute',
              padding: 0,
              minWidth: theme => theme.spacing(3),
              height: theme => theme.spacing(3),
              zIndex: (theme) => theme.zIndex.fab,
              opacity: 0.5,
              '&:hover': { opacity: 1 },
              transition: (theme) => theme.transitions.create(['opacity'], {
                duration: theme.transitions.duration.standard
              }),
              right: theme.spacing(1),
              bottom: theme.spacing(1)
            }}
          >
            <ArrowDropUp />
          </Button>
          {onClose && (
            <Button
              variant='contained'
              onClick={onClose}
              sx={{
                position: 'absolute',
                padding: 0,
                minWidth: theme => theme.spacing(3),
                height: theme => theme.spacing(3),
                zIndex: (theme) => theme.zIndex.fab,
                opacity: 0.5,
                '&:hover': { opacity: 1 },
                transition: (theme) => theme.transitions.create(['opacity'], {
                  duration: theme.transitions.duration.standard
                }),
                right: theme.spacing(1),
                top: theme.spacing(1)
              }}
            >
              <Close />
            </Button>
          )}
        </>
      )}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {Object.keys(menuOptions).map((key, index) => (
          <MenuItem
            key={key}
            onClick={() => {
              if (key === 'vSplit' || key === 'hSplit') {
                onStateChange({
                  type: key,
                  children: [state, state]
                })
              } else {
                onStateChange({ type: key })
              }
              setAnchorEl(null)
            }}
            selected={key === paneChoice}
          >
            <ListItemText>
              {menuOptions[key].title}
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}
