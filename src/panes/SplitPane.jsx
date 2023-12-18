import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'

import ComponentPane from './ComponentPane'
import { Stack } from '@mui/material'
import { useRef } from 'react'

function SplitDivider ({ direction, ...rest }) {
  return (
    <Box sx={{ position: 'relative', flexGrow: 0 }}>
      <Divider orientation={direction === 'row' ? 'vertical' : 'horizontal'} />
      <Box
        sx={{
          background: (theme) => theme.palette.primary.main,
          position: 'absolute',
          inset: (theme) => `-${theme.spacing(0.5)}`,
          zIndex: (theme) => theme.zIndex.fab,
          opacity: 0,
          transition: (theme) => theme.transitions.create(['opacity'], {
            duration: theme.transitions.duration.shorter
          }),
          '&:hover': {
            opacity: 1
          },
          cursor: direction === 'row' ? 'e-resize' : 'n-resize'
        }}
        {...rest}
      />
    </Box>
  )
}

function Split ({ split, direction, onChange, style, children }) {
  split = typeof(split) === 'undefined' ? 0.5 : split
  const root = useRef()
  const pane1 = useRef()
  const pane2 = useRef()

  // If user starts dragging a split, resize the divide between children accordingly
  const startDragging = dragStartEvent => {
    dragStartEvent.target.setPointerCapture(dragStartEvent.pointerId)
    let previousDragPos = null
    const handleMouseMove = e => {
      if(direction === 'row') {
        if (previousDragPos !== null) {
          split += (e.clientX - previousDragPos) / root.current.offsetWidth
        }
        previousDragPos = e.clientX
      } else {
        if (previousDragPos !== null) {
          split += (e.clientY - previousDragPos) / root.current.offsetHeight
        }
        previousDragPos = e.clientY
      }
      // constrain split to [0,1]
      split = Math.min(Math.max(0, split), 1)
      pane1.current.style.flexGrow = split
      pane2.current.style.flexGrow = 1 - split
      e.preventDefault()
      e.stopPropagation()
    }
    document.addEventListener('mousemove', handleMouseMove)

    const handleMouseDown = e => {
      e.preventDefault()
      e.stopPropagation()
    }
    document.addEventListener('mousedown', handleMouseDown)

    const handleMouseUp = e => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      e.preventDefault()
      e.stopPropagation()
      dragStartEvent.target.releasePointerCapture(dragStartEvent.pointerId)
      if (onChange) {
        onChange(split)
      }
    }
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <Stack
      ref={root}
      direction={direction}
      style={style}
    >
      <Box
        ref={pane1} 
        style={{ flexGrow: split, position: 'relative' }}>
        {children[0]}
      </Box>
      <SplitDivider 
        direction={direction} 
        onPointerDown={startDragging}
      />
      <Box 
        ref={pane2}
        style={{ flexGrow: 1 - split, position: 'relative' }}>
        {children[1]}
      </Box>
    </Stack>
  )
}

export default function SplitPane ({ state, onStateChange, direction, style }) {
  const children = state?.children || [null, null]

  return (
    <Split
      split={state?.split}
      direction={direction}
      onChange={split => {onStateChange({...state, split})}}
      style={style}
    >
      <ComponentPane
        style={{ position: 'absolute', inset: 0 }}
        state={children[0]}
        onStateChange={childState => {
          onStateChange({ ...state, children: [childState, children[1]] })
        }}
        onClose={() => {
          onStateChange(children[1])
        }}
      />
      <ComponentPane
        style={{ position: 'absolute', inset: 0 }}
        state={children[1]}
        onStateChange={childState => {
          onStateChange({ ...state, children: [children[0], childState] })
        }}
        onClose={() => {
          onStateChange(children[0])
        }}
      />
    </Split>
  )
}
