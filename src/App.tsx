import SignupPage from './pages/SignupPage'
import HeaderPreviewPage from './pages/HeaderPreviewPage'

function App() {
  if (new URLSearchParams(window.location.search).get('preview') === 'header') {
    return <HeaderPreviewPage />
  }
  return (
    <main className="min-h-svh">
      <SignupPage />
    </main>
  )
}

export default App
