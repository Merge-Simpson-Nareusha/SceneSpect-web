// 회원가입 화면을 조립하는 페이지입니다.
// - AuthLayout 안에 AuthProgress와 현재 회원가입 단계의 콘텐츠를 배치합니다.
// - 계정 정보, 비밀번호, 이메일 인증, 약관 동의, 가입 완료 단계를 다룹니다.
// - 약관 체크박스/전체 동의나 인증번호 칸은 화면에서 반복될 때 별도 컴포넌트로 분리합니다.
// - 서버 요청 함수는 services/auth.ts에 직접 작성하지 않고, 그 파일의 함수를 연결합니다.
import FormDivider from '../components/auth/FormDivider'
import Button from '../components/auth/Button'
import SocialLoginButton from '../components/auth/SocialLoginButton'
import AuthActionText from '../components/auth/AuthActionText'
import AuthProgress from '../components/auth/AuthProgress'
import SignupStepHeader from '../components/auth/SignupStepHeader'
import authImage from '../assets/images/auth/auth-side-visual.png'
import AuthFormField from '../components/auth/AuthFormField'
import EmailEditField from '../components/auth/EmailEditField'
import TermsAgreement from '../components/auth/TermsAgreement'
import completionIcon from '../assets/icons/signup/signup-complete.svg'
import scenespectLogoFull from '../assets/logos/scenespect-logo-full.svg'

import { useState } from 'react'

type SignupError = 'invalidCredentials' | 'alreadyRegistered'

type SignupPageProps = {
  error?: SignupError | null
  // 인증 코드를 검증해 true/false를 반환합니다. false이면 입력 필드를 오류 상태로 표시합니다.
  verifyVerificationCode?: (code: string) => boolean | Promise<boolean>
  // 인증 코드를 다시 발송합니다. 생략하면 API 연결 전 화면 흐름만 재현합니다.
  resendVerificationCode?: (email: string) => void | Promise<void>
}

const errorMessages = {
  invalidCredentials: {
    text: '이메일 또는 비밀번호를 확인해 주세요.',
    textSize: 'text-[clamp(0.75rem,1.11cqw,1rem)]',
  },
  alreadyRegistered: {
    text: '이미 가입한 계정입니다.',
    textSize: 'text-[clamp(0.75rem,1.11cqw,1rem)]',
  },
} as const

const SignupPage = ({
  error = null,
  verifyVerificationCode,
  resendVerificationCode,
}: SignupPageProps) => {
  const selectedError = error ? errorMessages[error] : null
  const [currentStep, setCurrentStep] = useState(1)
  const [email, setEmail] = useState('')
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

  const handleNext = () => {
    if (!isEmailValid) return

    setCurrentStep((step) => Math.min(step + 1, 5))
  }

  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [verificationTimerKey, setVerificationTimerKey] = useState(0)
  const [isVerificationCodeError, setIsVerificationCodeError] = useState(false)
  const [agreements, setAgreements] = useState([false, false, false])

  const canContinue =
    isEmailValid &&
    password.length >= 8 &&
    /[A-Za-z]/.test(password) &&
    /[^\p{L}\p{N}\s]/u.test(password) &&
    password === passwordConfirm

  const handlePasswordNext = () => {
    if (!canContinue) return

    setCurrentStep((step) => Math.min(step + 1, 5))
  }

  const handleVerificationNext = async () => {
    if (verificationCode.length !== 6) return

    if (verifyVerificationCode) {
      try {
        const isValid = await verifyVerificationCode(verificationCode)
        setIsVerificationCodeError(!isValid)
        if (!isValid) return
      } catch {
        setIsVerificationCodeError(true)
        return
      }
    }

    setCurrentStep((step) => Math.min(step + 1, 5))
  }

  const handleVerificationCodeChange = (code: string) => {
    setVerificationCode(code)
    setIsVerificationCodeError(false)
  }

  const handleVerificationResend = async () => {
    if (resendVerificationCode) {
      try {
        await resendVerificationCode(email)
      } catch {
        // 재발송에 실패하면 현재 타이머를 00:00에 두고 다시 시도할 수 있게 합니다.
        return
      }
    }

    setVerificationCode('')
    setIsVerificationCodeError(false)
    setVerificationTimerKey((key) => key + 1)
  }

  const allAgreementsAccepted = agreements.every(Boolean)
  const requiredAgreementsAccepted = agreements[0] && agreements[1]

  const handleAgreementChange = (itemNumber: 1 | 2 | 3, checked: boolean) => {
    setAgreements((current) =>
      current.map((value, index) => (index === itemNumber - 1 ? checked : value)),
    )
  }

  return (
    <div className="@container mx-auto flex h-svh w-full max-w-[2560px]">
      <div className="flex h-svh w-full gap-[2.78cqw] px-[2.78cqw] py-[4.44svh]">
        <div className="flex w-[45%] shrink-0 items-center justify-center">
          <img src={authImage} alt="" className="h-full w-full object-contain" />
        </div>
        <div
          className={`flex min-h-0 min-w-0 flex-1 flex-col ${currentStep === 5 ? 'gap-[clamp(4rem,8cqw,7rem)]' : 'gap-[1.875rem]'} px-[9.72cqw] pb-[8.89svh]`}
        >
        <AuthProgress
          currentStep={currentStep}
          onStepClick={(step) => setCurrentStep((current) => (step < current ? step : current))}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-[2.5rem]">
          {currentStep !== 5 && <SignupStepHeader currentStep={currentStep} />}
          {currentStep === 1 && (
            <>
              <div className="flex flex-col gap-[1.25rem]">
                <AuthFormField
                  name="email"
                  type="email"
                  label="이메일"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(event) => setEmail(event.currentTarget.value)}
                />
                <div className="flex flex-col gap-[0.625rem]">
                  <div className="min-h-[1.25em] text-[clamp(0.75rem,1.11cqw,1rem)] leading-tight">
                    <p
                      className={`text-[#ef4444] ${selectedError ? `visible ${selectedError.textSize}` : 'invisible'}`}
                    >
                      {selectedError?.text ?? '\u00a0'}
                    </p>
                  </div>
                  <Button name="default" onClick={handleNext}>
                    계속하기
                  </Button>
                </div>
                <FormDivider />
                <div className="grid grid-cols-2 gap-[clamp(0.5rem,0.69cqw,0.625rem)]">
                  <SocialLoginButton name={'google'} />
                  <SocialLoginButton name={'apple'} />
                  <SocialLoginButton name={'kakao'} />
                  <SocialLoginButton name={'x'} />
                </div>
              </div>
              <AuthActionText message="이미 계정이 있으신가요?" linkText="로그인" href="" />
            </>
          )}

          {currentStep === 2 && (
            <div className="flex min-h-0 flex-1 flex-col justify-between gap-[clamp(1.5rem,2.78cqw,2.5rem)]">
              <div className="flex flex-col gap-[clamp(1.5rem,2.78cqw,2.5rem)]">
                <EmailEditField value={email} onChange={setEmail} />

                <div className="flex flex-col gap-[clamp(1rem,1.67cqw,1.5rem)]">
                  <AuthFormField
                    name="password"
                    label="비밀번호"
                    type="password"
                    placeholder="비밀번호를 입력해주세요"
                    showPasswordRule
                    showPasswordToggle
                    value={password}
                    onChange={(event) => setPassword(event.currentTarget.value)}
                  />
                  <AuthFormField
                    name="passwordConfirm"
                    label="비밀번호 확인"
                    type="password"
                    placeholder="비밀번호를 다시 입력해주세요"
                    showPasswordToggle
                    value={passwordConfirm}
                    onChange={(event) => setPasswordConfirm(event.currentTarget.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col items-center gap-[clamp(1.5rem,3.33cqw,3rem)]">
                <Button
                  name={canContinue ? 'default' : 'disabled'}
                  disabled={!canContinue}
                  onClick={handlePasswordNext}
                >
                  설정하고 계속하기
                </Button>
                {/* <AuthActionText
                  message="인증 메일이 오지 않았나요?"
                  linkText="재전송"
                  variant="regular"
                /> */}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="flex min-h-0 flex-1 flex-col justify-between gap-[clamp(1.5rem,2.78cqw,2.5rem)]">
              <div className="flex flex-col gap-[clamp(1.5rem,2.78cqw,2.5rem)]">
                <EmailEditField value={email} onChange={setEmail} />
              </div>
              <div>
                <AuthFormField
                  key={verificationTimerKey}
                  label="인증 코드"
                  isVerificationCode
                  isVerificationCodeError={isVerificationCodeError}
                  value={verificationCode}
                  onVerificationCodeChange={handleVerificationCodeChange}
                  onVerificationExpired={handleVerificationResend}
                />
              </div>
              <div className="flex flex-col items-center gap-[clamp(1.5rem,3.33cqw,3rem)]">
                <Button
                  name={verificationCode.length === 6 ? 'default' : 'disabled'}
                  disabled={verificationCode.length !== 6}
                  onClick={handleVerificationNext}
                >
                  인증하고 계속하기
                </Button>
                <AuthActionText
                  message="인증 메일이 오지 않았나요?"
                  linkText="재전송"
                  variant="regular"
                  onClick={handleVerificationResend}
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="flex min-h-0 flex-1 flex-col justify-between gap-[clamp(1.5rem,2.78cqw,2.5rem)]">
              <div className="flex flex-col gap-[clamp(1rem,2.22cqw,2rem)]">
                <TermsAgreement
                  variant="all"
                  checked={allAgreementsAccepted}
                  onChange={(checked) => setAgreements([checked, checked, checked])}
                />
                <div className="border-y border-[#ECECEC] py-[clamp(0.5rem,1.11cqw,1rem)]">
                  <div className="flex flex-col gap-[1.6875rem]">
                    {([1, 2, 3] as const).map((itemNumber) => (
                      <TermsAgreement
                        key={itemNumber}
                        variant="default"
                        itemNumber={itemNumber}
                        checked={agreements[itemNumber - 1]}
                        onChange={(checked) => handleAgreementChange(itemNumber, checked)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-[clamp(1.5rem,2.78cqw,2.5rem)]">
                <Button
                  name={requiredAgreementsAccepted ? 'default' : 'disabled'}
                  disabled={!requiredAgreementsAccepted}
                  onClick={() => {
                    if (requiredAgreementsAccepted) {
                      setCurrentStep((step) => Math.min(step + 1, 5))
                    }
                  }}
                >
                  동의하고 계속하기
                </Button>
                <p className="text-center text-[clamp(0.75rem,1.11cqw,1rem)] text-[#B0B0B0]">
                  필수 약관에 동의하면 계속 할 수 있어요
                </p>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-[clamp(2rem,5cqw,4rem)]">
              <img
                src={completionIcon}
                alt="가입 완료"
                className="signup-complete-icon h-[clamp(3rem,6.67cqw,6rem)] w-auto object-contain"
              />
              <div className="w-full">
                <div className="flex items-center gap-[clamp(0.25rem,0.56cqw,0.5rem)]">
                  <img
                    src={scenespectLogoFull}
                    alt="SceneSpect"
                    className="h-[clamp(2rem,4.5cqw,4rem)] w-auto object-contain"
                  />
                  <span className="whitespace-nowrap text-[clamp(1.5rem,3.47cqw,3.125rem)] font-semibold text-[#16181D]">
                    에
                  </span>
                </div>
                <h1 className="whitespace-nowrap text-[clamp(1.5rem,3.47cqw,3.125rem)] font-semibold tracking-[-0.04em] text-[#16181D]">
                  오신 것을 환영해요
                </h1>
                <p className="mt-[clamp(0.5rem,1.11cqw,1rem)] text-[clamp(0.75rem,1.11cqw,1rem)] text-[#B0B0B0]">
                  이제 영상 분석을 시작해보세요.
                </p>
              </div>
              <Button>메인으로 가기</Button>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
