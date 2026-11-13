import { BrowserRouter, Route, Routes, useLocation } from 'react-router'
import LoginPage from './pages/LoginPage'
import PasswordResetPage from './pages/PasswordResetPage'
import PasswordChangePage from './pages/PasswordChangePage'
import SignupPage from './pages/SignupPage'
import TeamListPage from './pages/TeamListPage'
import ErrorPage from './pages/ErrorPage'
import ErrorBoundary from './components/feedback/ErrorBoundary'

function AppRoutes() {
  const location = useLocation()
  return (
    <ErrorBoundary key={location.key}>
      <Routes>
        <Route path="/" element={<SignupPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/password/forgot" element={<PasswordResetPage />} />
        <Route path="/password/reset" element={<PasswordChangePage />} />
        <Route path="/teams" element={<TeamListPage />} />
        <Route path="/404" element={<ErrorPage kind="notFound" />} />
        <Route path="/403" element={<ErrorPage kind="forbidden" />} />
        <Route path="/500" element={<ErrorPage kind="server" />} />
        <Route path="/503" element={<ErrorPage kind="unavailable" />} />
        <Route path="/network-error" element={<ErrorPage kind="network" />} />
        <Route path="/session-expired" element={<ErrorPage kind="sessionExpired" />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </ErrorBoundary>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
