import { useState } from 'react'
import AuthFormField from '../components/auth/AuthFormField'
import Button from '../components/auth/Button'
import scenespectLogoLight from '../assets/logos/scenespect-logo-light.svg'
import scenespectLogoSymbol from '../assets/logos/scenespect-logo-symbol.svg'
import { getApiErrorMessage } from '../services/api'
import { requestPasswordReset } from '../services/auth'

function PasswordResetPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleRequest = async () => {
    if (submitting) return
    if (!email.trim()) {
      setError('가입한 이메일을 입력해 주세요.')
      setNotice('')
      return
    }

    setSubmitting(true)
    setError('')
    setNotice('')
    try {
      const response = await requestPasswordReset(email.trim())
      setNotice(response.message)
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          '비밀번호 재설정 안내를 요청하지 못했습니다. 잠시 후 다시 시도해 주세요.',
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

        <h1 className="text-2xl font-semibold text-[#16181D]">비밀번호 찾기</h1>
        <p className="mt-3 text-sm leading-6 text-[#6B7280]">
          가입한 이메일을 입력하면, 계정이 존재하는 경우 비밀번호 재설정 안내를 보내드립니다.
        </p>

        <div className="mt-8 flex flex-col gap-5">
          <AuthFormField
            name="email"
            type="email"
            label="이메일"
            placeholder="example@email.com"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.currentTarget.value)
              setError('')
              setNotice('')
            }}
          />

          <p
            aria-live="polite"
            aria-atomic="true"
            className={`min-h-[1.5em] text-sm ${error ? 'text-[#EF4444]' : notice ? 'text-[#16A34A]' : 'invisible'}`}
          >
            {error || notice || '\u00a0'}
          </p>

          <Button onClick={handleRequest} disabled={submitting}>
            {submitting ? '요청 중...' : '재설정 안내 받기'}
          </Button>

          <button
            type="button"
            onClick={() => window.close()}
            className="w-full cursor-pointer py-2 text-sm text-[#6B7280] hover:text-[#16181D]"
          >
            창 닫기
          </button>
        </div>
      </section>
    </main>
  )
}

export default PasswordResetPage
