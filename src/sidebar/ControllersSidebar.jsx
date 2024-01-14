import { useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import Tooltip from '@mui/material/Tooltip'

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

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

function ControllerListItem ({ controller, onEdit, onRemove, onToggleActive, onToggleDTR }) {
  const isSerial = controller.type === 'Serial'
  const statusText = isSerial ? `Endpoint: ${controller.endpoint}` : `System: ${controller.system}`

  return (
    <ListItem>
      <ListItemText primary={controller.name} secondary={statusText} />
      <ListItemSecondaryAction>
        {isSerial && (
          <ThemedToggleButton
            key={`${controller.id}-DTR-${controller.isDTR}`}
            label='DTR'
            tooltipText='Toggle DTR'
            isSelected={controller.isDTR}
            onChange={() => onToggleDTR(controller.id)}
          />
        )}
        <ThemedToggleButton
          key={`${controller.id}-Active-${controller.isActive}`}
          label='Active'
          tooltipText='Toggle sending commands'
          isSelected={controller.isActive}
          onChange={() => onToggleActive(controller.id)}
        />
        <Button size='small' sx={{ minWidth: 'auto', padding: '6px', marginX: '4px' }} aria-label='edit' onClick={() => onEdit(controller.id)}>
          <EditIcon />
        </Button>
        <Button size='small' sx={{ minWidth: 'auto', padding: '6px', marginX: '4px' }} aria-label='delete' onClick={() => onRemove(controller.id)}>
          <DeleteIcon />
        </Button>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

function ControllerList ({ controllers, onEdit, onRemove, onConnect, onToggleActive }) {
  return (
    <List>
      {controllers.map((controller) => (
        <ControllerListItem
          key={controller.id}
          controller={controller}
          onEdit={onEdit}
          onRemove={onRemove}
          onConnect={onConnect}
          onToggleActive={onToggleActive}
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

  const handleEditController = (id) => { /* TODO */ }
  const handleRemoveController = (id) => { /* TODO */ }
  const handleToggleActive = (id) => {
    const updatedControllers = controllers.map(controller => {
      if (controller.id === id) {
        return { ...controller, isActive: !controller.isActive }
      }
      return { ...controller }
    })
    setControllers(updatedControllers)
  }

  return (
    <Box sx={{ width: 1, height: 1, position: 'relative' }}>
      <ControllerList
        controllers={controllers}
        onEdit={handleEditController}
        onRemove={handleRemoveController}
        onToggleActive={handleToggleActive}
      />
    </Box>
  )
}
