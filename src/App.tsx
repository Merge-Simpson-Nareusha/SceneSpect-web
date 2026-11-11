import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import LoginPage from './pages/LoginPage'
import PasswordResetPage from './pages/PasswordResetPage'
import PasswordChangePage from './pages/PasswordChangePage'
import SignupPage from './pages/SignupPage'
import TeamListPage from './pages/TeamListPage'

function App() {
  return (
    <BrowserRouter>
      <main className="min-h-svh">
        <Routes>
          <Route path="/" element={<SignupPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/password/forgot" element={<PasswordResetPage />} />
          <Route path="/password/reset" element={<PasswordChangePage />} />
          <Route path="/teams" element={<TeamListPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
