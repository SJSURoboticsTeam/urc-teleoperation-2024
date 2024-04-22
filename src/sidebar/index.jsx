import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'
import SettingsIcon from '@mui/icons-material/Settings';

import Controllers from './Controllers'
import Layouts from './Layouts'
import Configs from './Configs'

const sidebars = {
  configs: { title: 'Configs', Icon: SettingsIcon, Component: Configs },
  controllers: { title: 'Controllers', Icon: SportsEsportsIcon, Component: Controllers },
  layouts: { title: 'Layouts', Icon: SpaceDashboardIcon, Component: Layouts }
}

export default sidebars
