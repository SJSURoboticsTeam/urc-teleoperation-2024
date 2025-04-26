import { useState } from 'react'

import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'


function ArmStatus () {
  const armStatus = {
    speed: 0,
    rotunda: 90,
    elbow: 0,
    shoulder: 0,
    wristPitch: 0,
    wristRoll: 0,
    endEffector: 0
  }
  const {speed, rotunda, elbow, shoulder, wristPitch, wristRoll, endEffector} = armStatus;

  return (
    <Box sx={{
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center',
      margin: '0 auto',
      alignItems: 'center', 
      textAlign: 'center',
      width: '300px',              
      height: '500px',                        
      padding: 25,                 
    }}>
    <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          border: '2px solid #000000',
          backgroundColor: '#ADD8E6',
          width: '100px',
          height: '60px',
          borderRadius: 2,
          padding: 2,
          marginBottom: 1,
        }}
      >
        <Typography variant="body1">Speed:</Typography>
        <Typography variant="body1">{speed}</Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          border: '2px solid #000000',
          backgroundColor: '#ADD8E6',
          width: '100px',
          height: '60px',
          borderRadius: 2,
          padding: 2,
          marginBottom: 1,
        }}
      >
        <Typography variant="body1">Rotunda:</Typography>
        <Typography variant="body1">{rotunda}</Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          border: '2px solid #000000',
          backgroundColor: '#ADD8E6',
          width: '100px',
          height: '60px',
          borderRadius: 2,
          padding: 2,
          marginBottom: 1,
        }}
      >
        <Typography variant="body1">Elbow:</Typography>
        <Typography variant="body1">{elbow}</Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          border: '2px solid #000000',
          backgroundColor: '#ADD8E6',
          width: '100px',
          height: '60px',
          borderRadius: 2,
          padding: 2,
          marginBottom: 1,
        }}
      >
        <Typography variant="body1">Shoulder:</Typography>
        <Typography variant="body1">{shoulder}</Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          border: '2px solid #000000',
          backgroundColor: '#ADD8E6',
          width: '100px',
          height: '60px',
          borderRadius: 2,
          padding: 2,
          marginBottom: 1,
        }}
      >
        <Typography variant="body1">WristPitch:</Typography>
        <Typography variant="body1">{wristPitch}</Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          border: '2px solid #000000',
          backgroundColor: '#ADD8E6',
          width: '100px',
          height: '60px',
          borderRadius: 2,
          padding: 2,
          marginBottom: 1,
        }}
      >
        <Typography variant="body1">WristRoll:</Typography>
        <Typography variant="body1">{wristRoll}</Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          border: '2px solid #000000',
          backgroundColor: '#ADD8E6',
          width: '100px',
          height: '60px',
          borderRadius: 2,
          padding: 2,
          marginBottom: 1,
        }}
      >
        <Typography variant="body1">EndEffector:</Typography>
        <Typography variant="body1">{endEffector}</Typography>
      </Box>
    </Box>
  );
}

function DriveStatus () {
  const driveStatus = {
    mode: 'drive',
    speed: 36,
    angle: 90
  }
  const { mode, speed, angle } = driveStatus;

  return (
    <Box sx={{
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center',
      margin: '0 auto',
      alignItems: 'center', 
      textAlign: 'center',
      width: '300px',              
      height: '300px',                        
      padding: 5,                 
    }}>
    <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          border: '2px solid #000000',
          backgroundColor: '#ADD8E6',
          width: '100px',
          height: '60px',
          borderRadius: 2,
          padding: 2,
          marginBottom: 1,
        }}
      >
        <Typography variant="body1">Mode:</Typography>
        <Typography variant="body1">{mode}</Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          border: '2px solid #000000',
          backgroundColor: '#ADD8E6',
          width: '100px',
          height: '60px',
          borderRadius: 2,
          padding: 2,
          marginBottom: 1,
        }}
      >
        <Typography variant="body1">Speed:</Typography>
        <Typography variant="body1">{speed}</Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          border: '2px solid #000000',
          backgroundColor: '#ADD8E6',
          width: '100px',
          height: '60px',
          borderRadius: 2,
          padding: 2,
        }}
      >
        <Typography variant="body1">Angle:</Typography>
        <Typography variant="body1">{angle}</Typography>
      </Box>
    </Box>
  );
}


export default function StatusPane ({ style }) {
  const [activeTab, setActiveTab] = useState(0)

  const tabConfig = [
    { label: 'Arm', Component: ArmStatus },
    { label: 'Drive', Component: DriveStatus }
  ]

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue)
  }

  const ActiveComponent = tabConfig[activeTab]?.Component

  return (
    <Box style={style}>
      <Tabs
        value={activeTab}
        onChange={handleChangeTab}
        variant='scrollable'
        scrollButtons='auto'
        aria-label='Status Tabs'
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        {tabConfig.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>
      {ActiveComponent ? <ActiveComponent /> : <Box>Invalid tab selected.</Box>}
    </Box>
  )
}
