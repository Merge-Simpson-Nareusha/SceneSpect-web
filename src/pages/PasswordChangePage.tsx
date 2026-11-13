import { useState } from 'react'
import { Link } from 'react-router'
import AuthFormField from '../components/auth/AuthFormField'
import Button from '../components/auth/Button'
import scenespectLogoLight from '../assets/logos/scenespect-logo-light.svg'
import scenespectLogoSymbol from '../assets/logos/scenespect-logo-symbol.svg'
import { getApiErrorMessage } from '../services/api'
import { resetPassword } from '../services/auth'

function PasswordChangePage() {
  const token = new URLSearchParams(window.location.search).get('token')?.trim() ?? ''
  const tokenError = token
    ? ''
    : '재설정 링크가 올바르지 않거나 만료되었습니다. 이메일에서 다시 열어 주세요.'
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleReset = async () => {
    if (submitting) return
    if (!token) return
    if (password.length < 12 || password.length > 72) {
      setError('비밀번호는 12자 이상 72자 이하로 입력해 주세요.')
      return
    }
    if (!/[A-Za-z]/.test(password) || !/[^\p{L}\p{N}\s]/u.test(password)) {
      setError('비밀번호에 영문과 특수문자를 포함해 주세요.')
      return
    }
    if (password !== passwordConfirmation) {
      setError('비밀번호 확인이 일치하지 않습니다.')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      const response = await resetPassword(token, password, passwordConfirmation)
      if (!response.reset) {
        setError('비밀번호를 변경하지 못했습니다. 재설정 링크를 확인해 주세요.')
        return
      }
      setSuccess(true)
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          '비밀번호를 변경하지 못했습니다. 재설정 링크를 확인한 뒤 다시 시도해 주세요.',
        ),
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-white px-6 py-10">
      <section className="w-full max-w-[420px]">
        <header className="mb-8 flex flex-col items-start gap-3">
          <img src={scenespectLogoSymbol} alt="SceneSpect 심볼" className="h-8 w-auto" />
          <img src={scenespectLogoLight} alt="SceneSpect" className="h-10 w-auto" />
        </header>

        <h1 className="text-2xl font-semibold text-[#16181D]">
          {success ? '비밀번호 변경 완료' : '새 비밀번호 설정'}
        </h1>

        {success ? (
          <div className="mt-6 flex flex-col gap-5">
            <p className="text-sm leading-6 text-[#16A34A]">
              비밀번호가 변경되었습니다. 새 비밀번호로 로그인해 주세요.
            </p>
            <Link
              to="/login"
              className="flex w-full items-center justify-center rounded-[0.3125rem] bg-[#16181D] px-4 py-3 text-base font-medium text-white hover:bg-[#2A2D34]"
            >
              로그인으로 이동
            </Link>
          </div>
        ) : (
          <>
            <p className="mt-3 text-sm leading-6 text-[#6B7280]">
              새 비밀번호를 입력해 주세요. 비밀번호는 12자 이상 72자 이하이며, 영문과 특수문자를 포함해야
              합니다.
            </p>

            <div className="mt-8 flex flex-col gap-5">
              <AuthFormField
                name="password"
                type="password"
                label="새 비밀번호"
                placeholder="새 비밀번호를 입력해 주세요"
                required
                autoComplete="new-password"
                showPasswordToggle
                showPasswordRule
                maxLength={72}
                value={password}
                onChange={(event) => {
                  setPassword(event.currentTarget.value)
                  setError('')
                }}
              />
              <AuthFormField
                name="passwordConfirmation"
                type="password"
                label="새 비밀번호 확인"
                placeholder="새 비밀번호를 다시 입력해 주세요"
                required
                autoComplete="new-password"
                showPasswordToggle
                maxLength={72}
                value={passwordConfirmation}
                onChange={(event) => {
                  setPasswordConfirmation(event.currentTarget.value)
                  setError('')
                }}
              />

              {tokenError && (
                <p role="alert" className="text-sm text-[#EF4444]">
                  {tokenError}
                </p>
              )}
              <p
                aria-live="polite"
                aria-atomic="true"
                className={`min-h-[1.5em] text-sm ${error ? 'text-[#EF4444]' : 'invisible'}`}
              >
                {error || '\u00a0'}
              </p>

              <Button onClick={handleReset} disabled={submitting || !token}>
                {submitting ? '변경 중...' : '비밀번호 변경'}
              </Button>

              <Link to="/login" className="text-center text-sm text-[#6B7280] hover:text-[#16181D]">
                로그인으로 돌아가기
              </Link>
            </div>
          </>
        )}
      </section>
    </main>
  )
}

export default PasswordChangePage
