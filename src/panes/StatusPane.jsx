import { useState } from 'react'

import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'

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

  return (
    <Box>
      <Typography variant='body1' sx={{ whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(armStatus, null, 2)}
      </Typography>
    </Box>
  )
}

function DriveStatus () {
  const driveStatus = {
    mode: 'drive',
    speed: 36,
    angle: 90
  }

  return (
    <Box>
      <pre>{JSON.stringify(driveStatus, null, 2)}</pre>
    </Box>
  )
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
