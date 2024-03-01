import CameraPane from './CameraPane'
import ManualInputPane from './ManualInput'
import TestComponent from './TestComponent'
import SplitPane from './SplitPane'
import { ArmOrthoView } from './3DArmViewport'

const panes = {
  test: { title: 'Test', Component: TestComponent },
  camera: { title: 'Camera', Component: CameraPane },
  manualInput: { title: 'Manual Input', Component: ManualInputPane },
  vSplit: { title: 'Split Vertically', Component: (props) => (<SplitPane {...props} direction='row' />) },
  hSplit: { title: 'Split Horizontally', Component: (props) => (<SplitPane {...props} />) },
  armViewport3D: { title: '3D Arm Viewport', Component: ArmOrthoView },
}

export default panes
