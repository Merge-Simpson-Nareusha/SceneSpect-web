import { useState } from 'react'
import { useNavigate } from 'react-router'
import AuthActionText from '../components/auth/AuthActionText'
import AuthFormField from '../components/auth/AuthFormField'
import Button from '../components/auth/Button'
import FormDivider from '../components/auth/FormDivider'
import SocialLoginButton from '../components/auth/SocialLoginButton'
import authImage from '../assets/images/auth/auth-side-visual.png'
import scenespectLogoLight from '../assets/logos/scenespect-logo-light.svg'
import scenespectLogoSymbol from '../assets/logos/scenespect-logo-symbol.svg'
import { ApiError, getApiErrorMessage } from '../services/api'
import { login } from '../services/auth'

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleLogin = async () => {
    if (submitting) return
    if (!email.trim() || !password) {
      setLoginError('이메일 또는 비밀번호를 입력해 주세요.')
      return
    }

    setSubmitting(true)
    setLoginError('')
    try {
      const user = await login(email.trim(), password)
      navigate('/teams', { replace: true, state: { accountName: user.nickname } })
    } catch (error) {
      setLoginError(
        error instanceof ApiError && error.status === 401
          ? '이메일 또는 비밀번호를 확인해 주세요.'
          : getApiErrorMessage(error, '로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.'),
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="@container login-page mx-auto flex h-svh w-full max-w-[2560px]">
      <div className="login-page-layout flex h-full w-full gap-[2.78cqw] px-[2.78cqw] py-[4.44svh] max-md:flex-col max-md:gap-0 max-md:px-5 max-md:py-6">
        <div className="login-page-visual flex w-[45%] shrink-0 items-center justify-center max-md:hidden">
          <img src={authImage} alt="" className="h-full w-full object-contain" />
        </div>

        <section className="login-page-panel flex min-h-0 min-w-0 flex-1 flex-col justify-center px-[9.72cqw] max-md:w-full max-md:justify-start max-md:px-0 max-md:pb-8">
          <div className="login-page-content flex w-full flex-col">
            <header className="flex w-full flex-col items-start gap-[clamp(0.5rem,1.39cqw,1.25rem)]">
              <img
                src={scenespectLogoSymbol}
                alt="SceneSpect 심볼"
                className="h-[clamp(1.5rem,2.64cqw,2.375rem)] w-auto object-contain"
              />
              <div className="flex w-full items-center gap-[clamp(0.25rem,0.56cqw,0.5rem)]">
                <img
                  src={scenespectLogoLight}
                  alt="SceneSpect"
                  className="h-[clamp(2rem,4.44cqw,4rem)] w-auto object-contain"
                />
                <h1 className="whitespace-nowrap text-[clamp(1.5rem,3.47cqw,3.125rem)] font-semibold text-[#16181D]">
                  다시하기
                </h1>
              </div>
            </header>

            <div className="login-page-fields flex flex-col">
              <AuthFormField
                name="email"
                type="email"
                label="이메일"
                labelActionText="이메일 찾기"
                placeholder="example@email.com"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.currentTarget.value)
                  setLoginError('')
                }}
              />
              <AuthFormField
                name="password"
                label="비밀번호"
                labelActionText="비밀번호 찾기"
                type="password"
                placeholder="비밀번호를 입력해주세요"
                required
                autoComplete="current-password"
                showPasswordToggle
                value={password}
                onChange={(event) => {
                  setPassword(event.currentTarget.value)
                  setLoginError('')
                }}
              />
            </div>

            <div className="login-page-actions flex flex-col">
              <div className="flex flex-col gap-[10px]">
                <p
                  aria-live="polite"
                  aria-atomic="true"
                  className={`min-h-[1.2em] max-md:min-h-[2.4em] text-[16px] leading-[1.2] text-[#EF4444] ${loginError ? 'visible' : 'invisible'}`}
                >
                  {loginError || '\u00a0'}
                </p>
                <Button onClick={handleLogin} disabled={submitting}>
                  {submitting ? '로그인 중...' : '로그인하기'}
                </Button>
              </div>
              <FormDivider label="소셜계정으로 로그인" />
              <div className="grid grid-cols-2 gap-[clamp(0.5rem,0.69cqw,0.625rem)] max-md:gap-3">
                <SocialLoginButton name="google" />
                <SocialLoginButton name="apple" />
                <SocialLoginButton name="kakao" />
                <SocialLoginButton name="x" />
              </div>
            </div>

            <AuthActionText message="아직 계정이 없으신가요?" linkText="회원가입" href="/" />
          </div>
        </section>
      </div>
    </div>
  )
}

export default LoginPage
