import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'

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
      <pre>{JSON.stringify(armStatus, null, 2)}</pre>
    </Box>
  )
}

function DriveStatus () {
  const driveStatus = {
    mode: 'drive',
    speed: 0,
    angle: 0
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
