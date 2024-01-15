import { useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'

import DeleteIcon from '@mui/icons-material/Delete'

const ThemedToggleButton = ({ label, tooltipText, isSelected, onChange }) => {
  return (
    <Tooltip title={tooltipText}>
      <Button
        size='small'
        onClick={onChange}
        color={isSelected ? 'success' : 'error'}
      >
        {label}
      </Button>
    </Tooltip>
  )
}

function SerialListItem ({ controller, onEdit, onRemove }) {
  const [name, setName] = useState(controller.name)
  const [endpoint, setEndpoint] = useState(controller.endpoint)

  const updateName = () => {
    onEdit(controller.id, { name })
  }

  const updateEndpoint = () => {
    onEdit(controller.id, { endpoint })
  }

  return (
    <ListItem divider>
      <Grid container spacing={2} alignItems='center'>
        <Grid item xs={3}>
          <TextField
            variant='filled'
            size='small'
            sx={{ width: 'auto' }}
            label='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={updateName}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            variant='filled'
            size='small'
            sx={{ width: 'auto' }}
            label='Endpoint'
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            onBlur={updateEndpoint}
          />
        </Grid>
        <Grid item xs={5} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <ThemedToggleButton
            key={`${controller.id}-DTR-${controller.isDTR}`}
            label='DTR'
            tooltipText='Toggle DTR'
            isSelected={controller.isDTR}
            onChange={() => onEdit(controller.id, { isDTR: !controller.isDTR })}
          />
          <ThemedToggleButton
            key={`${controller.id}-Active-${controller.isActive}`}
            label='Active'
            tooltipText='Toggle sending commands'
            isSelected={controller.isActive}
            onChange={() => onEdit(controller.id, { isActive: !controller.isActive })}
          />
          <Button
            size='small'
            sx={{ minWidth: 'auto', padding: '6px', marginX: '4px' }}
            aria-label='delete'
            onClick={() => onRemove(controller.id)}
          >
            <DeleteIcon />
          </Button>
        </Grid>
      </Grid>
    </ListItem>
  )
}

function GamepadListItem ({ controller, systemOptions, onEdit, onRemove }) {
  const [name, setName] = useState(controller.name)
  const [system, setSystem] = useState(controller.system)

  const updateName = () => {
    onEdit(controller.id, { name })
  }

  const updateSystem = () => {
    onEdit(controller.id, { system })
  }

  return (
    <ListItem divider>
      <Grid container spacing={2} alignItems='center'>
        <Grid item xs={3}>
          <TextField
            variant='filled'
            size='small'
            sx={{ width: 'auto' }}
            label='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={updateName}
          />
        </Grid>
        <Grid item xs={4}>
          <Select
            variant='filled'
            size='small'
            sx={{ width: '100%' }}
            value={system}
            onChange={(e) => setSystem(e.target.value)}
            onBlur={updateSystem}
          >
            {systemOptions.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={5} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <ThemedToggleButton
            key={`${controller.id}-Active-${controller.isActive}`}
            label='Active'
            tooltipText='Toggle sending commands'
            isSelected={controller.isActive}
            onChange={() => onEdit(controller.id, { isActive: !controller.isActive })}
          />
          <Button
            size='small'
            sx={{ minWidth: 'auto', padding: '6px', marginX: '4px' }}
            aria-label='delete'
            onClick={() => onRemove(controller.id)}
          >
            <DeleteIcon />
          </Button>
        </Grid>
      </Grid>
    </ListItem>
  )
}

function ControllerListItem ({ controller, systemOptions, onEdit, onRemove }) {
  switch (controller.type) {
    case 'Serial':
      return <SerialListItem controller={controller} onEdit={onEdit} onRemove={onRemove} />
    case 'Gamepad':
      return <GamepadListItem controller={controller} systemOptions={systemOptions} onEdit={onEdit} onRemove={onRemove} />
    default:
      return null
  }
}

function ControllerList ({ controllers, systemOptions, onEdit, onRemove }) {
  return (
    <List>
      {controllers.map((controller) => (
        <ControllerListItem
          key={controller.id}
          controller={controller}
          systemOptions={systemOptions}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      ))}
    </List>
  )
}

export default function ControllersSidebar () {
  // TODO: this will need to live in global state so it isn't lost when the sidebar is closed/reloaded
  const [controllers, setControllers] = useState([
    { id: 1, name: 'Gamepad 1', type: 'Gamepad', system: 'Drive', isDTR: false, isActive: false },
    { id: 2, name: 'Serial 1', type: 'Serial', endpoint: '/drive', isDTR: false, isActive: false }
  ])

  const systemOptions = ['Drive', 'Arm', 'Science']

  const handleEditController = (id, newValues) => {
    const updatedControllers = controllers.map(controller => {
      if (controller.id === id) {
        return { ...controller, ...newValues }
      }
      return { ...controller }
    })
    setControllers(updatedControllers)
  }
  const handleRemoveController = (id) => { /* TODO */ }

  return (
    <Box sx={{ width: 1, height: 1, position: 'relative' }}>
      <ControllerList
        controllers={controllers}
        systemOptions={systemOptions}
        onEdit={handleEditController}
        onRemove={handleRemoveController}
      />
    </Box>
  )
}
