import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'

import ComponentPane from './ComponentPane'
import { Stack } from '@mui/material'

function SplitDivider ({ direction }) {
  return (
    <Box sx={{ position: 'relative', flexGrow: 0 }}>
      <Divider orientation={direction === 'row' ? 'vertical' : 'horizontal'} />
    </Box>
  )
}

function Split ({ split, direction, style, children }) {
  split = typeof (split) === 'undefined' ? 0.5 : split

  return (
    <Stack
      direction={direction}
      style={style}
    >
      <Box style={{ flexGrow: split, position: 'relative' }}>
        {children[0]}
      </Box>
      <SplitDivider direction={direction} />
      <Box style={{ flexGrow: split, position: 'relative' }}>
        {children[1]}
      </Box>
    </Stack>
  )
}

export default function SplitPane ({ state, onStateChange, direction, style }) {
  const children = state?.children || [null, null]

  return (
    <Split
      direction={direction}
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
