import { useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

export default function CameraPane () {
  // TODO: replace with context provider and hooks model
  const cameras = [
    { name: 'Test', url: 'https://images.unsplash.com/photo-1580757468214-c73f7062a5cb?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8MTYlM0E5fGVufDB8fDB8fHww', ratio: 1000 / 563 },
    { name: 'Mast Cam', url: 'http://192.168.1.204:8081/', ratio: 16 / 9  },
    { name: 'Under Chasis Cam', url: 'http://192.168.1.201:8081/', ratio: 16 / 9 },
    { name: 'Front Left Cam', url: 'http://192.168.1.202:8081/', ratio: 16 / 9 },
    { name: 'Front Right Cam', url: 'http://192.168.1.203:8081/', ratio: 16 / 9 },

  ]
  const [currentCamera, setCurrentCamera] = useState(0)
  const containerRef = useRef(null)

  const [anchorPosition, setAnchorPosition] = useState(null)
  const open = Boolean(anchorPosition)
  
  const handleClick = (e) => {
    e.preventDefault()
    setAnchorPosition({ left: e.clientX, top: e.clientY })
  }
  const handleClose = () => {
    setAnchorPosition(null)
  }

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
      ref={containerRef}
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <div style={{backgroundColor: 'white', position: 'relative', zIndex:5}}>{cameras[currentCamera]['name']}</div>

      
      <img
        style={{ ...imageStyle, objectFit: 'contain', position: 'absolute', zIndex: 1}}
        alt='Video Feed.'
        src={cameras[currentCamera].url}
        onContextMenu={handleClick}
      />
      <Menu
        anchorPosition={anchorPosition}
        anchorReference='anchorPosition'
        open={open}
        onClose={handleClose}
        onChange={(e) => { setCurrentCamera(e.target.value) }}
      >
        {cameras.map((camera, index) => (<MenuItem key={`${camera.name}-${index}`} onClick={() => { setCurrentCamera(index); setAnchorPosition(null) }}>{camera.name}</MenuItem>))}
      </Menu>

    
    </Box>
  )
}
