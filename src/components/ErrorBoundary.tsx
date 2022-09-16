import { Component, ErrorInfo } from 'react'

interface State {
  error: string | undefined
}

class ErrorBoundary extends Component {
  public state: State = {
    error: undefined,
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(errorInfo)
    this.setState({ error: `${error.name}: ${error.message}` })
  }

  render() {
    if (this.state.error) {
      return <>{this.state.error}</>
    } else {
      return <>{this.props.children}</>
    }
  }
}

export default ErrorBoundary
