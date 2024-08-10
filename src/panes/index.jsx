import CameraPane from './CameraPane'
import ManualInputPane from './ManualInput'
import TestComponent from './TestComponent'
import SplitPane from './SplitPane'
import StatusPane from './StatusPane'
import MimicInputPane from './MimicPane'

const panes = {
  test: { title: 'Test', Component: TestComponent },
  camera: { title: 'Camera', Component: CameraPane },
  manualInput: { title: 'Manual Input', Component: ManualInputPane },
  mimicInput: {title: 'Mimic Input', Component: MimicInputPane},
  status: { title: 'Status', Component: StatusPane },
  vSplit: { title: 'Split Vertically', Component: (props) => (<SplitPane {...props} direction='row' />) },
  hSplit: { title: 'Split Horizontally', Component: (props) => (<SplitPane {...props} />) },
}

export default panes
