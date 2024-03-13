import CameraPane from './CameraPane'
import ManualInputPane from './ManualInput'
import TestComponent from './TestComponent'
import SplitPane from './SplitPane'
import StatusPane from './StatusPane'
import WifiPane from './WifiPane'

const panes = {
  test: { title: 'Test', Component: TestComponent },
  camera: { title: 'Camera', Component: CameraPane },
  manualInput: { title: 'Manual Input', Component: ManualInputPane },
  status: { title: 'Status', Component: StatusPane },
  vSplit: { title: 'Split Vertically', Component: (props) => (<SplitPane {...props} direction='row' />) },
  hSplit: { title: 'Split Horizontally', Component: (props) => (<SplitPane {...props} />) },
  wifi: { title: 'Wifi', Component: WifiPane }
}

export default panes
