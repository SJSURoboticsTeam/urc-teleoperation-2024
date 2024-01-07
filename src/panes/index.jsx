import ManualInputPane from './ManualInput'
import TestComponent from './TestComponent'
import SplitPane from './SplitPane'

const panes = {
  test: { title: 'Test', Component: TestComponent },
  manualInput: { title: 'Manual Input', Component: ManualInputPane },
  vSplit: { title: 'Split Vertically', Component: (props) => (<SplitPane {...props} direction='row' />) },
  hSplit: { title: 'Split Horizontally', Component: (props) => (<SplitPane {...props} />) }
}

export default panes
