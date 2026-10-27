import { useState } from 'react'
import AuthActionText from '../components/auth/AuthActionText'
import AuthFormField from '../components/auth/AuthFormField'
import Button from '../components/auth/Button'
import FormDivider from '../components/auth/FormDivider'
import SocialLoginButton from '../components/auth/SocialLoginButton'
import authImage from '../assets/images/auth/auth-side-visual.png'
import scenespectLogoLight from '../assets/logos/scenespect-logo-light.svg'
import scenespectLogoSymbol from '../assets/logos/scenespect-logo-symbol.svg'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="@container mx-auto flex h-svh w-full max-w-[2560px] max-md:h-auto max-md:min-h-svh max-md:max-w-none">
      <div className="flex h-svh w-full gap-[2.78cqw] px-[2.78cqw] py-[4.44svh] max-md:h-auto max-md:min-h-svh max-md:flex-col max-md:gap-0 max-md:px-5 max-md:py-6">
        <div className="flex w-[45%] shrink-0 items-center justify-center max-md:hidden">
          <img src={authImage} alt="" className="h-full w-full object-contain" />
        </div>

        <section className="flex min-h-0 min-w-0 flex-1 flex-col justify-center px-[9.72cqw] pb-[8.89svh] max-md:w-full max-md:justify-start max-md:px-0 max-md:pb-8">
          <div className="flex w-full flex-col gap-[clamp(1.5rem,2.78cqw,2.5rem)] max-md:gap-10">
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

            <div className="flex flex-col gap-[clamp(1rem,1.67cqw,1.5rem)] max-md:gap-6">
              <AuthFormField
                name="email"
                type="email"
                label="이메일"
                labelActionText="이메일 찾기"
                placeholder="example@email.com"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.currentTarget.value)}
              />
              <AuthFormField
                name="password"
                label="비밀번호"
                labelActionText="비밀번호 찾기"
                type="password"
                placeholder="비밀번호를 입력해주세요"
                autoComplete="current-password"
                showPasswordToggle
                value={password}
                onChange={(event) => setPassword(event.currentTarget.value)}
              />
            </div>

            <div className="flex flex-col gap-[clamp(1rem,1.67cqw,1.5rem)] max-md:gap-6">
              <Button>로그인하기</Button>
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
