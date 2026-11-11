import { Component, type ErrorInfo, type ReactNode } from 'react'
import ErrorPage from '../../pages/ErrorPage'

export default class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[UI] 화면을 표시하지 못했습니다.', error, info.componentStack)
  }

  render() {
    return this.state.hasError ? (
      <ErrorPage kind="server" onRetry={() => this.setState({ hasError: false })} />
    ) : (
      this.props.children
    )
  }
}
