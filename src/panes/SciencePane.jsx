import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

export default function SciencePane () {
  const [playButton, setPlayButton] = useState(false)
  const [eStopButton, setEStopButton] = useState(false)

  const togglePlay = () => {
    setPlayButton(prevState => !prevState)
  }

  const toggleEStop = () => {
    setEStopButton(prevState => !prevState)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 15, height: '90vh' }}>
      <Button variant='contained' color='primary' size='large' startIcon={<PlayArrowIcon />} onClick={togglePlay}>
        {playButton ? 'Paused' : 'Playing'}
      </Button>

      <Button variant='contained' color='warning' style={{ width: 500, height: 300 }} onClick={toggleEStop}>
        EMERGENCY STOP
      </Button>
    </Box>
  )
}
