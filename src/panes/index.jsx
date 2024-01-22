import CameraPane from './CameraPane'
import ManualInputPane from './ManualInput'
import TestComponent from './TestComponent'
import SplitPane from './SplitPane'
import StatusPane from './StatusPane'
import SciencePane from './SciencePane'

const panes = {
  test: { title: 'Test', Component: TestComponent },
  camera: { title: 'Camera', Component: CameraPane },
  manualInput: { title: 'Manual Input', Component: ManualInputPane },
  status: { title: 'Status', Component: StatusPane },
  science: { title: 'Science', Component: SciencePane },
  vSplit: { title: 'Split Vertically', Component: (props) => (<SplitPane {...props} direction='row' />) },
  hSplit: { title: 'Split Horizontally', Component: (props) => (<SplitPane {...props} />) }
}

export default panes
