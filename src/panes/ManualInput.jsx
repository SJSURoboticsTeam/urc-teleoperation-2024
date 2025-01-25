import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown'
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp'

import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { useCommands } from '../contexts/CommandContext'

function TooltipButton ({ onClick, tooltipTitle, children, sx }) {
  return (
    <Tooltip title={tooltipTitle}>
      <Button onClick={onClick} sx={sx}>
        {children}
      </Button>
    </Tooltip>
  )
}

function NumericValueAdjuster ({ label, value, onValueChange, min, max }) {
  const [inputValue, setInputValue] = useState(value.toString())
  const largeIncrement = 5
  const smallIncrement = 1

  const handleInputChange = (event) => {
    setInputValue(event.target.value)
  }

  const handleInputCommit = () => {
    const newValue = Math.max(min, Math.min(max, Number(inputValue)))
    setInputValue((isNaN(newValue) ? 0 : newValue).toString())
    onValueChange(isNaN(newValue) ? 0 : newValue)
  }

  const increment = (step) => () => {
    setInputValue((Math.max(min, Math.min(max, value + step))).toString())
    onValueChange(Math.max(min, Math.min(max, value + step)))
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 1 }}>
      <FormControl variant='standard'>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TooltipButton onClick={increment(-largeIncrement)} tooltipTitle={`-${largeIncrement}`} sx={{ minWidth: '30px', padding: '6px' }}><KeyboardDoubleArrowDownIcon /></TooltipButton>
          <TooltipButton onClick={increment(-smallIncrement)} tooltipTitle={`-${smallIncrement}`} sx={{ minWidth: '30px', padding: '6px' }}><KeyboardArrowDownIcon /></TooltipButton>
          <TextField
            id={label}
            type='text'
            value={inputValue}
            onChange={handleInputChange}
            onFocus={(e) => { e.target.select() }}
            onBlur={handleInputCommit}
            onKeyDown={(e) => { if (e.key === 'Enter') handleInputCommit() }}
            sx={{ mx: 0, width: '100px' }}
            variant='outlined'
            label={label}
            InputLabelProps={{ shrink: true }}
          />
          <TooltipButton onClick={increment(smallIncrement)} tooltipTitle={`${smallIncrement}`} sx={{ minWidth: '30px', padding: '6px' }}><KeyboardArrowUpIcon /></TooltipButton>
          <TooltipButton onClick={increment(largeIncrement)} tooltipTitle={`${largeIncrement}`} sx={{ minWidth: '30px', padding: '6px' }}><KeyboardDoubleArrowUpIcon /></TooltipButton>
        </Box>
      </FormControl>
    </Box>
  )
}

function ArmManualInput ({commands, setCommands}) {
  const controlConfigs = [
    { name: 'base', label: 'Base', min: 0, max: 5 },
    { name: 'shoulder', label: 'Shoulder', min: -180, max: 180 },
    { name: 'elbow', label: 'Elbow', min: -75, max: 90 },
    { name: 'roll', label: 'Wrist Roll', min: -45, max: 90 },
    { name: 'pitch', label: 'Wrist Pitch', min: -90, max: 90 },
    { name: 'yaw', label: 'Wrist Yaw', min: -180, max: 180 },
    { name: 'endEff', label: 'End Effector', min: 0, max: 90 }
  ]

  const initialControlValues = controlConfigs.reduce((acc, control) => {
    acc[control.name] = 0
    return acc
  }, {})

  const [controlValues, setControlValues] = useState(commands.arm)

  const handleControlChange = (controlName) => (newValue) => {
    setControlValues(prevValues => ({
      ...prevValues,
      [controlName]: newValue
    }))
  }

  const resetControlValues = () => {
    setControlValues(initialControlValues)
  }

  useEffect(() => {
    setCommands((commands) => {return JSON.parse(JSON.stringify({...commands, arm:{...controlValues}}))})
  }, [setCommands, controlValues])

  // console.log(controlValues)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {controlConfigs.map(control => (
        <NumericValueAdjuster
          key={`${control.name}-${controlValues[control.name]}`}
          label={control.label}
          value={controlValues[control.name]}
          onValueChange={handleControlChange(control.name)}
          min={control.min}
          max={control.max}
        />
      ))}
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Button variant="contained" onClick={resetControlValues}>
          Reset All
        </Button>
        <Button variant="contained" onClick={resetControlValues}>
        Home
        </Button>
      </Box>
    </Box>
  )
}

function DriveManualInput ({commands, setCommands}) {
  const defaults = {
    mode: 'drive',
    speed: 0,
    angle: 0
  }
  const driveModes = [
    { name: 'spin', label: 'Spin' },
    { name: 'translate', label: 'Translate' },
    { name: 'drive', label: 'Drive' }
  ]
  const [driveParams, setDriveParams] = useState(commands.drive)

  const handleParamChange = (paramName) => (newValue) => {
    setDriveParams(prevParams => ({
      ...prevParams,
      [paramName]: newValue
    }))
  }

  useEffect(() => {
    setCommands((commands) => {return JSON.parse(JSON.stringify({...commands, drive:{...driveParams}}))})
  }, [setCommands, driveParams])

  // console.log(driveParams)
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 1 }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', mb: 2 }}>
        {driveModes.map(mode => (
          <Button
            key={mode.name}
            variant={driveParams.mode === mode.name ? 'contained' : 'outlined'}
            onClick={() => (handleParamChange('mode'))(mode.name)}
            sx={{ mx: 1 }}
          >
            {mode.label}
          </Button>
        ))}
      </Box>
      <NumericValueAdjuster
        key={`speed-${driveParams.speed}`} 
        label='Speed'
        value={driveParams.speed}
        onValueChange={handleParamChange('speed')}
        min={-100}
        max={100}
      />
      <NumericValueAdjuster
        key={`angle-${driveParams.angle}`} 
        label='Angle'
        value={driveParams.angle}
        onValueChange={handleParamChange('angle')}
        min={-180}
        max={180}
      />
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Button variant="contained" onClick={() => setDriveParams(defaults)}>
          Reset All
         </Button>
        <Button variant="contained" onClick={() => setDriveParams(defaults)}>
          Home
        </Button>
      </Box>
    </Box>
  )
}

function ScienceManualInput ({commands, setCommands}) {
  const scienceDefault = {
    play: true,
    eStop: false,
    samplesReceived: false
  }

  const [scienceValues, setScienceValues] = useState(scienceDefault)

  const handleToggle = (toggleName) => (e) => {
    e.preventDefault()
    setScienceValues(prevValues => ({
      ...prevValues,
      [toggleName]: !prevValues[toggleName]
    }))
  }

  useEffect(() => {
    setCommands((commands) => {return JSON.parse(JSON.stringify({...commands, science:{...scienceValues}}))})
  }, [setCommands, scienceValues])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 15, height: '90vh' }}>
      <Button value={scienceValues.play} variant='contained' color={scienceValues.play ? 'warning' : 'primary'} size='large' startIcon={<PlayArrowIcon />} onClick={handleToggle('play')}>
        {scienceValues.play ? 'Paused' : 'Playing'}
      </Button>

      <Button value={scienceValues.eStop} variant='contained' color={scienceValues.eStop ? 'error' : 'primary'}  style={{ width: 500, height: 300 }} onClick={handleToggle('eStop')}>
        {scienceValues.eStop ? 'Emergency Stopped' : 'Emergency Stop'}
      </Button>
    </Box>
  )
}

export default function ManualInputPane ({ style }) {
  const [activeTab, setActiveTab] = useState(0)
  const [commands, setCommands] = useCommands()

  const tabConfig = [
    { label: 'Arm', Component: ArmManualInput },
    { label: 'Drive', Component: DriveManualInput },
    { label: 'Science', Component: ScienceManualInput }
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
        aria-label='Manual Input Tabs'
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        {tabConfig.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>
      {ActiveComponent ? <ActiveComponent key={JSON.stringify(commands)} commands={commands} setCommands={setCommands}/> : <Box>Invalid tab selected.</Box>}
    </Box>
  )
}
