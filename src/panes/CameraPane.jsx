import { useRef, useState } from 'react'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'

export default function CameraPane () {
  // TODO: replace with context provider and hooks model
  const cameras = [
    { name: 'Chassis Cam', url: 'https://images.unsplash.com/photo-1580757468214-c73f7062a5cb?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8MTYlM0E5fGVufDB8fDB8fHww', ratio: 1000 / 563 },
    { name: 'Mast Cam', url: 'http://192.168.1.202:8081/', ratio: 16 / 9 },
    { name: 'Arm Cam', url: 'http://192.168.1.203:8081/', ratio: 16 / 9 }]
  const [currentCamera, setCurrentCamera] = useState(0)
  const containerRef = useRef(null)

  const calculateImageDimensions = () => {
    if (!containerRef.current) { return { height: '100%', width: 'auto' } }
    if (containerRef.current.offsetWidth / containerRef.current.offsetHeight < cameras[currentCamera].ratio) {
      // Container is narrower than the image
      return { width: '100%', height: 'auto' }
    } else {
      // Container is wider than the image
      return { height: '100%', width: 'auto' }
    }
  }

  const imageStyle = calculateImageDimensions()
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxHeight: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        paddingTop: 2
      }}
    >
      {/* Move this into a context menu */}
      {/* <TextField
        value={currentCamera}
        label='Camera Select'
        select
        onChange={(e) => { setCurrentCamera(e.target.value) }}
      >
        {cameras.map((camera, index) => (<MenuItem value={index} key={camera.name}>{camera.name}</MenuItem>))}
      </TextField> */}

      <Box
        ref={containerRef}
        sx={{
          // ...imageStyle,
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <img
          style={{ ...imageStyle, maxHeight: '100%', maxWidth: '100%' }}
          alt='Video Feed.'
          src={cameras[currentCamera].url}
        />
      </Box>
    </Box>
  )
}
