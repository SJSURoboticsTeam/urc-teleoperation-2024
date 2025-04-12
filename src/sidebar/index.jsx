import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'
import SettingsIcon from '@mui/icons-material/Settings';
import EditNoteIcon from '@mui/icons-material/EditNote';

import Controllers from './Controllers'
import Layouts from './Layouts'
import Configs from './Configs'
import Notepad from './Notepad' 

const sidebars = {
  configs: { title: 'Configs', Icon: SettingsIcon, Component: Configs },
  controllers: { title: 'Controllers', Icon: SportsEsportsIcon, Component: Controllers },
  layouts: { title: 'Layouts', Icon: SpaceDashboardIcon, Component: Layouts },
  notepad: { title: 'Notepad', Icon: EditNoteIcon, Component: Notepad }
}

export default sidebars
