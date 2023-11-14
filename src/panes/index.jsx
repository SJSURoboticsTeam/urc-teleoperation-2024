import TestComponent from './TestComponent'
import SplitPane from './SplitPane'

const panes = {
  test: { title: 'Test', Component: TestComponent },
  vSplit: { title: 'Split Vertically', Component: (props) => (<SplitPane {...props} direction='row' />) },
  hSplit: { title: 'Split Horizontally', Component: (props) => (<SplitPane {...props} />) }
}

export default panes
