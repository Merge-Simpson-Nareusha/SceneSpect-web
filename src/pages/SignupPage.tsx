// 회원가입 화면을 조립하는 페이지입니다.
// - AuthLayout 안에 AuthProgress와 현재 회원가입 단계의 콘텐츠를 배치합니다.
// - 계정 정보, 비밀번호, 이메일 인증, 약관 동의, 가입 완료 단계를 다룹니다.
// - 약관 체크박스/전체 동의나 인증번호 칸은 화면에서 반복될 때 별도 컴포넌트로 분리합니다.
// - 서버 요청 함수는 services/auth.ts에 직접 작성하지 않고, 그 파일의 함수를 연결합니다.
import {
  completeSignup,
  getSignupTerms,
  sendSignupVerificationCode,
  setSignupPassword,
  startSignup,
  updateSignupEmail,
  verifySignupEmail,
  type SignupTerm,
} from '../services/auth'
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

import { useEffect, useState } from 'react'

type SignupError = 'invalidCredentials' | 'alreadyRegistered'

type SignupPageProps = {
  error?: SignupError | null
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

const VERIFICATION_CODE_EXPIRES_IN = 300

const SignupPage = ({ error = null }: SignupPageProps) => {
  const selectedError = error ? errorMessages[error] : null
  const [currentStep, setCurrentStep] = useState(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [verificationTimerKey, setVerificationTimerKey] = useState(0)
  const [isVerificationCodeError, setIsVerificationCodeError] = useState(false)
  const [isEmailEditing, setIsEmailEditing] = useState(false)
  const [signupSessionId, setSignupSessionId] = useState('')
  // 현재 세션이 어떤 이메일로 만들어졌는지 기억해 수정 여부를 비교합니다.
  const [signupSessionEmail, setSignupSessionEmail] = useState('')
  const [requestError, setRequestError] = useState('')
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false)
  const [isSubmittingVerification, setIsSubmittingVerification] = useState(false)
  const [isSendingVerification, setIsSendingVerification] = useState(false)
  const [isSubmittingTerms, setIsSubmittingTerms] = useState(false)
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [verificationExpiresIn, setVerificationExpiresIn] = useState(
    VERIFICATION_CODE_EXPIRES_IN,
  )
  const [resendCountdown, setResendCountdown] = useState(0)
  const [signupTerms, setSignupTerms] = useState<SignupTerm[]>([])
  const [agreements, setAgreements] = useState<Record<string, boolean>>({})
  // 필수 약관을 먼저 보여주고, 선택 약관 중 마케팅 동의는 마지막에 배치합니다.
  const orderedSignupTerms = [...signupTerms].sort((left, right) => {
    if (left.required !== right.required) return left.required ? -1 : 1

    const leftIsMarketing =
      left.code.toLowerCase().includes('marketing') || left.title.includes('마케팅')
    const rightIsMarketing =
      right.code.toLowerCase().includes('marketing') || right.title.includes('마케팅')

    return Number(leftIsMarketing) - Number(rightIsMarketing)
  })
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

  // 서버가 재발송을 허용하기까지 남은 시간을 초 단위로 표시합니다.
  useEffect(() => {
    if (resendCountdown <= 0) return

    const timerId = window.setTimeout(() => {
      setResendCountdown((seconds) => Math.max(seconds - 1, 0))
    }, 1000)

    return () => window.clearTimeout(timerId)
  }, [resendCountdown])

  const handleNext = async () => {
    if (!isEmailValid) return

    setRequestError('')

    try {
      const normalizedEmail = email.trim()
      const result = await startSignup(normalizedEmail)
      setSignupSessionId(result.signupSessionId)
      setSignupSessionEmail(normalizedEmail)
      setCurrentStep(2)
    } catch (error) {
      setRequestError(
        error instanceof Error ? error.message : '회원가입을 시작하지 못했습니다.',
      )
    }
  }

  const canContinue =
    isEmailValid &&
    password.length >= 12 &&
    /[A-Za-z]/.test(password) &&
    /[^\p{L}\p{N}\s]/u.test(password) &&
    password === passwordConfirm

  const handlePasswordNext = async () => {
    if (!canContinue || !signupSessionId || isSubmittingPassword) return

    setRequestError('')
    setIsSubmittingPassword(true)

    try {
      const normalizedEmail = email.trim()
      let activeSignupSessionId = signupSessionId

      // 이메일을 바꾸지 않았다면 기존 세션을 사용하고, 바뀌었다면 해당 세션의 이메일을 먼저 수정합니다.
      if (normalizedEmail !== signupSessionEmail) {
        const result = await updateSignupEmail(signupSessionId, normalizedEmail)
        activeSignupSessionId = result.signupSessionId
        setSignupSessionId(activeSignupSessionId)
        setSignupSessionEmail(result.email)
        setEmail(result.email)
      }

      await setSignupPassword({
        signupSessionId: activeSignupSessionId,
        password,
        passwordConfirmation: passwordConfirm,
      })

      // 비밀번호 설정이 끝나면 세션 ID로 최초 인증 메일을 발송합니다.
      setVerificationExpiresIn(VERIFICATION_CODE_EXPIRES_IN)
      setResendCountdown(0)
      setVerificationCode('')
      setIsVerificationCodeError(false)
      setIsEmailVerified(false)
      setVerificationTimerKey((key) => key + 1)
      setIsEmailEditing(false)
      setCurrentStep(3)

      // 발송에 실패해도 인증 화면에서 재전송할 수 있도록 비밀번호 요청과 분리합니다.
      setIsSendingVerification(true)
      try {
        const result = await sendSignupVerificationCode(activeSignupSessionId)
        setVerificationExpiresIn(result.expiresIn)
        setResendCountdown(result.resendAfter)
        setVerificationTimerKey((key) => key + 1)
      } catch (error) {
        setRequestError(
          error instanceof Error ? error.message : '인증 메일을 보내지 못했습니다.',
        )
      } finally {
        setIsSendingVerification(false)
      }
    } catch (error) {
      setRequestError(
        error instanceof Error
          ? error.message
          : '비밀번호를 저장하지 못했습니다. 다시 시도해 주세요.',
      )
    } finally {
      setIsSubmittingPassword(false)
    }
  }

  const handleVerificationNext = async () => {
    if (verificationCode.length !== 6 || !signupSessionId || isSubmittingVerification) return

    setRequestError('')
    setIsSubmittingVerification(true)

    try {
      if (!isEmailVerified) {
        let result: Awaited<ReturnType<typeof verifySignupEmail>>
        try {
          result = await verifySignupEmail(signupSessionId, verificationCode)
        } catch (error) {
          setIsVerificationCodeError(true)
          throw error
        }

        if (!result.verified) {
          setIsVerificationCodeError(true)
          setRequestError('인증 코드를 확인해 주세요.')
          return
        }
        setIsEmailVerified(true)
      }

      // 화면에 표시할 약관과 제출에 사용할 약관 ID를 서버에서 받습니다.
      const result = await getSignupTerms()
      setSignupTerms(result.terms)
      setAgreements(Object.fromEntries(result.terms.map((term) => [term.id, false])))
      setCurrentStep(4)
    } catch (error) {
      setRequestError(
        error instanceof Error ? error.message : '인증을 완료하지 못했습니다. 다시 시도해 주세요.',
      )
    } finally {
      setIsSubmittingVerification(false)
    }
  }

  const handleVerificationCodeChange = (code: string) => {
    setVerificationCode(code)
    setIsVerificationCodeError(false)
    setRequestError('')
  }

  const handleVerificationResend = async () => {
    if (!signupSessionId || isSendingVerification || resendCountdown > 0) return

    setRequestError('')
    setIsSendingVerification(true)

    try {
      const result = await sendSignupVerificationCode(signupSessionId)
      setVerificationExpiresIn(result.expiresIn)
      setResendCountdown(result.resendAfter)
      setVerificationTimerKey((key) => key + 1)
      setVerificationCode('')
      setIsVerificationCodeError(false)
    } catch (error) {
      setRequestError(
        error instanceof Error ? error.message : '인증 메일을 다시 보내지 못했습니다.',
      )
    } finally {
      setIsSendingVerification(false)
    }
  }

  const allAgreementsAccepted =
    signupTerms.length > 0 && signupTerms.every((term) => agreements[term.id])
  const requiredAgreementsAccepted =
    signupTerms.some((term) => term.required) &&
    signupTerms.every((term) => !term.required || agreements[term.id])

  const handleAgreementChange = (termId: string, checked: boolean) => {
    setAgreements((current) => ({ ...current, [termId]: checked }))
  }

  const handleCompleteSignup = async () => {
    if (!requiredAgreementsAccepted || !signupSessionId || isSubmittingTerms) return

    setRequestError('')
    setIsSubmittingTerms(true)

    try {
      const consents = signupTerms.map((term) => ({
        termId: term.id,
        accepted: Boolean(agreements[term.id]),
      }))
      await completeSignup(signupSessionId, consents)
      setCurrentStep(5)
    } catch (error) {
      setRequestError(
        error instanceof Error ? error.message : '회원가입을 완료하지 못했습니다. 다시 시도해 주세요.',
      )
    } finally {
      setIsSubmittingTerms(false)
    }
  }

  return (
    <div className="@container mx-auto flex h-svh w-full max-w-[2560px] max-md:h-auto max-md:min-h-svh max-md:max-w-none">
      <div className="flex h-svh w-full gap-[2.78cqw] px-[2.78cqw] py-[4.44svh] max-md:h-auto max-md:min-h-svh max-md:flex-col max-md:gap-0 max-md:px-5 max-md:py-6">
        <div className="flex w-[45%] shrink-0 items-center justify-center max-md:hidden">
          <img src={authImage} alt="" className="h-full w-full object-contain" />
        </div>
        <div
          className={`flex min-h-0 min-w-0 flex-1 flex-col ${currentStep === 5 ? 'gap-[clamp(4rem,8cqw,7rem)]' : 'gap-[1.875rem]'} px-[9.72cqw] pb-[8.89svh] max-md:w-full max-md:gap-10 max-md:px-0 max-md:pb-8`}
        >
        <AuthProgress
          currentStep={currentStep}
          onStepClick={(step) => setCurrentStep((current) => (step < current ? step : current))}
        />
        <div
          className={`flex min-w-0 flex-1 flex-col gap-[2.5rem] ${currentStep === 5 ? 'max-md:gap-0' : 'max-md:flex-initial max-md:gap-10'}`}
        >
          {currentStep !== 5 && <SignupStepHeader currentStep={currentStep} />}
          {currentStep === 1 && (
            <>
              <div className="flex flex-col gap-[1.25rem] max-md:gap-7">
                <AuthFormField
                  name="email"
                  type="email"
                  label="이메일"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(event) => setEmail(event.currentTarget.value)}
                />
                <div className="flex flex-col gap-[0.625rem] max-md:gap-4">
                  <div className="min-h-[1.25em] text-[clamp(0.75rem,1.11cqw,1rem)] leading-tight">
                    <p
                      className={`text-[#ef4444] ${selectedError || requestError ? `visible ${selectedError?.textSize ?? 'text-[clamp(0.75rem,1.11cqw,1rem)]'}` : 'invisible'}`}
                    >
                      {selectedError?.text ?? (requestError || '\u00a0')}
                    </p>
                  </div>
                  <Button name="default" onClick={handleNext}>
                    계속하기
                  </Button>
                </div>
                <FormDivider />
                <div className="grid grid-cols-2 gap-[clamp(0.5rem,0.69cqw,0.625rem)] max-md:gap-3">
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
            <div className="flex min-h-0 flex-1 flex-col justify-between gap-[clamp(1.5rem,2.78cqw,2.5rem)] max-md:flex-initial max-md:justify-start max-md:gap-10">
              <div className="flex flex-col gap-[clamp(1.5rem,2.78cqw,2.5rem)] max-md:gap-8">
                <EmailEditField
                  value={email}
                  onChange={(value) => {
                    setEmail(value)
                    setRequestError('')
                  }}
                  isEditing={isEmailEditing}
                  onEdit={() => setIsEmailEditing(true)}
                  onDone={() => setIsEmailEditing(false)}
                />

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

              <div className="flex flex-col items-center">
                <div className="flex w-full flex-col gap-[0.625rem] max-md:gap-4">
                  <div className="min-h-[1.25em] text-[clamp(0.75rem,1.11cqw,1rem)] leading-tight">
                    <p
                      aria-live="polite"
                      className={`text-[#ef4444] ${requestError ? 'visible' : 'invisible'}`}
                    >
                      {requestError || '\u00a0'}
                    </p>
                  </div>
                  <Button
                    name={canContinue && !isSubmittingPassword ? 'default' : 'disabled'}
                    disabled={!canContinue || !signupSessionId || isSubmittingPassword}
                    onClick={handlePasswordNext}
                  >
                    {isSubmittingPassword ? '처리 중...' : '설정하고 계속하기'}
                  </Button>
                </div>
                {/* <AuthActionText
                  message="인증 메일이 오지 않았나요?"
                  linkText="재전송"
                  variant="regular"
                /> */}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="flex min-h-0 flex-1 flex-col justify-between gap-[clamp(1.5rem,2.78cqw,2.5rem)] max-md:flex-initial max-md:justify-start max-md:gap-10">
              <div className="flex flex-col gap-[clamp(1.5rem,2.78cqw,2.5rem)] max-md:gap-8">
                <EmailEditField
                  value={email}
                  onChange={setEmail}
                  isEditing={false}
                  onEdit={() => {
                    setIsEmailEditing(true)
                    setCurrentStep(2)
                  }}
                  onDone={() => setIsEmailEditing(false)}
                />
              </div>
              <div>
                <AuthFormField
                  key={verificationTimerKey}
                  label="인증 코드"
                  isVerificationCode
                  isVerificationCodeError={isVerificationCodeError}
                  verificationDurationSeconds={verificationExpiresIn}
                  value={verificationCode}
                  onVerificationCodeChange={handleVerificationCodeChange}
                  onVerificationExpired={handleVerificationResend}
                />
                <p
                  aria-live="polite"
                  className={`min-h-[1.25em] text-[clamp(0.75rem,1.11cqw,1rem)] text-[#EF4444] ${requestError ? 'visible' : 'invisible'}`}
                >
                  {requestError || '\u00a0'}
                </p>
              </div>
              <div className="flex flex-col items-center gap-[clamp(1.5rem,3.33cqw,3rem)] max-md:gap-8">
                <Button
                  name={verificationCode.length === 6 && !isSubmittingVerification ? 'default' : 'disabled'}
                  disabled={verificationCode.length !== 6 || isSubmittingVerification}
                  onClick={handleVerificationNext}
                >
                  {isSubmittingVerification ? '확인 중...' : '인증하고 계속하기'}
                </Button>
                <AuthActionText
                  message={isSendingVerification ? '인증 메일을 보내고 있어요.' : '인증 메일이 오지 않았나요?'}
                  linkText={
                    resendCountdown > 0
                      ? `재전송 (${resendCountdown}초 후)`
                      : isSendingVerification
                        ? '전송 중'
                        : '재전송'
                  }
                  variant="regular"
                  onClick={handleVerificationResend}
                  disabled={resendCountdown > 0 || isSendingVerification}
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="flex min-h-0 flex-1 flex-col justify-between gap-[clamp(1.5rem,2.78cqw,2.5rem)] max-md:flex-initial max-md:justify-start max-md:gap-10">
              <div className="flex flex-col gap-[clamp(1rem,2.22cqw,2rem)] max-md:gap-8">
                <TermsAgreement
                  variant="all"
                  checked={allAgreementsAccepted}
                  onChange={(checked) =>
                    setAgreements(Object.fromEntries(signupTerms.map((term) => [term.id, checked])))
                  }
                />
                <div className="border-y border-[#ECECEC] py-[clamp(0.5rem,1.11cqw,1rem)]">
                  <div className="flex flex-col gap-[1.6875rem]">
                    {orderedSignupTerms.map((term) => (
                      <TermsAgreement
                        key={term.id}
                        variant="default"
                        term={term}
                        checked={Boolean(agreements[term.id])}
                        onChange={(checked) => handleAgreementChange(term.id, checked)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-[clamp(0.625rem,1.11cqw,1rem)]">
                <p
                  aria-live="polite"
                  className={`min-h-[1.25em] text-center text-[clamp(0.75rem,1.11cqw,1rem)] text-[#EF4444] ${requestError ? 'visible' : 'invisible'}`}
                >
                  {requestError || '\u00a0'}
                </p>
                <Button
                  name={requiredAgreementsAccepted && !isSubmittingTerms ? 'default' : 'disabled'}
                  disabled={!requiredAgreementsAccepted || isSubmittingTerms}
                  onClick={handleCompleteSignup}
                >
                  {isSubmittingTerms ? '가입 중...' : '동의하고 계속하기'}
                </Button>
                <p className="text-center text-[clamp(0.75rem,1.11cqw,1rem)] text-[#B0B0B0]">
                  필수 약관에 동의하면 계속 할 수 있어요
                </p>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-[clamp(2rem,5cqw,4rem)] max-md:flex-1 max-md:justify-center max-md:gap-10 max-md:py-8">
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
