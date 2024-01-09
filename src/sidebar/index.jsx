import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'

import ControllersSidebar from './ControllersSidebar'
import Layouts from './Layouts'

const sidebars = {
  controllers: { title: 'Controllers', Icon: SportsEsportsIcon, Component: ControllersSidebar },
  layouts: { title: 'Layouts', Icon: SpaceDashboardIcon, Component: Layouts }
}

export default sidebars
