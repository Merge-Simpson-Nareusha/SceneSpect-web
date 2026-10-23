// 회원가입에서 공통으로 사용하는 입력 필드 컴포넌트입니다.
// - label, placeholder 프롭스로 입력창의 제목과 안내 문구를 설정합니다.
// - 비밀번호 입력창은 표시/숨김 버튼을 선택해서 사용할 수 있습니다.
// - isVerificationCode가 true이면 일반 입력 대신 여러 칸의 숫자 인증 입력 UI를 표시합니다.
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEventHandler,
  type InputHTMLAttributes,
  type ClipboardEvent,
  type KeyboardEvent,
} from 'react'
import eyeIcon from '../../assets/icons/form/eye.svg'
import eyeOffIcon from '../../assets/icons/form/eye-off.svg'

// name, value, onChange, required 등 기본 input 속성도 함께 전달할 수 있습니다.
type AuthFormFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'placeholder'
> & {
  // 입력창 왼쪽 위에 표시할 제목을 받습니다. 예: "비밀번호"
  label: string
  // 입력값의 종류를 받습니다. password이면 비밀번호 입력창으로 동작합니다.
  type?: InputHTMLAttributes<HTMLInputElement>['type']
  // 입력값이 없을 때 입력창 안에 표시할 안내 문구를 받습니다.
  placeholder?: string
  // true이면 제목 오른쪽에 비밀번호 조건 안내를 표시합니다.
  showPasswordRule?: boolean
  // true이면 password 입력창에 표시/숨김 아이콘을 보여줍니다.
  showPasswordToggle?: boolean
  // true이면 일반 입력 옵션 대신 인증 코드 여러 칸 입력 UI를 표시합니다.
  isVerificationCode?: boolean
  // 인증 서버가 코드를 틀렸다고 응답했을 때 true로 지정하면 입력 칸을 빨간색으로 표시합니다.
  isVerificationCodeError?: boolean
  // 인증 코드를 입력할 칸 수입니다. 기본값은 6입니다.
  verificationCodeLength?: number
  // 인증 코드 유효 시간(초)입니다. 기본값은 5분입니다.
  verificationDurationSeconds?: number
  // 인증 코드가 입력될 때마다 전체 문자열을 전달합니다.
  onVerificationCodeChange?: (code: string) => void
  // 코드가 만료되면 새 코드를 요청합니다. 요청이 성공하면 부모가 입력 필드를 다시 시작합니다.
  onVerificationExpired?: () => void | Promise<void>
}

type VerificationCodeInputProps = {
  label: string
  value?: string
  length: number
  durationSeconds: number
  isError: boolean
  onChange?: (code: string) => void
  onExpired?: () => void | Promise<void>
}

function VerificationCodeInput({
  label,
  value,
  length,
  durationSeconds,
  isError,
  onChange,
  onExpired,
}: VerificationCodeInputProps) {
  const [internalValue, setInternalValue] = useState(() =>
    (value ?? '').replace(/\D/g, '').slice(0, length),
  )
  const [remainingSeconds, setRemainingSeconds] = useState(durationSeconds)
  const remainingSecondsRef = useRef(durationSeconds)
  const onExpiredRef = useRef(onExpired)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const code = (value ?? internalValue).replace(/\D/g, '').slice(0, length)
  const digits = Array.from({ length }, (_, index) => code[index] ?? '')

  useEffect(() => {
    onExpiredRef.current = onExpired
  }, [onExpired])

  useEffect(() => {
    remainingSecondsRef.current = durationSeconds
    const timerId = window.setInterval(() => {
      const nextRemainingSeconds = Math.max(remainingSecondsRef.current - 1, 0)
      remainingSecondsRef.current = nextRemainingSeconds
      setRemainingSeconds(nextRemainingSeconds)

      if (nextRemainingSeconds === 0) {
        window.clearInterval(timerId)
        const expireHandler = onExpiredRef.current
        if (expireHandler) {
          void Promise.resolve().then(expireHandler).catch(() => undefined)
        }
      }
    }, 1000)

    return () => window.clearInterval(timerId)
  }, [durationSeconds])

  const updateCode = (nextDigits: string[]) => {
    const nextCode = nextDigits.join('').slice(0, length)
    if (value === undefined) setInternalValue(nextCode)
    onChange?.(nextCode)
  }

  const enterDigits = (index: number, enteredValue: string) => {
    const enteredDigits = enteredValue.replace(/\D/g, '').slice(0, length - index)
    if (!enteredDigits) {
      if (enteredValue === '') {
        const nextDigits = [...digits]
        nextDigits[index] = ''
        updateCode(nextDigits)
      }
      return
    }

    const nextDigits = [...digits]
    enteredDigits.split('').forEach((digit, offset) => {
      nextDigits[index + offset] = digit
    })
    updateCode(nextDigits)

    const nextIndex = index + enteredDigits.length
    if (nextIndex < length) inputRefs.current[nextIndex]?.focus()
  }

  const handlePaste = (index: number, event: ClipboardEvent<HTMLInputElement>) => {
    const pastedDigits = event.clipboardData.getData('text').replace(/\D/g, '')
    if (!pastedDigits) return

    event.preventDefault()
    enterDigits(pastedDigits.length >= length ? 0 : index, pastedDigits)
  }

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault()
      inputRefs.current[index - 1]?.focus()
    }
    if (event.key === 'ArrowRight' && index < length - 1) {
      event.preventDefault()
      inputRefs.current[index + 1]?.focus()
    }
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, '0')
  const seconds = String(remainingSeconds % 60).padStart(2, '0')

  return (
    <div className="flex w-full flex-col gap-[clamp(0.375rem,0.56cqw,0.5rem)]">
      <p className="text-[1.125rem] font-medium text-[#16181D]">
        {label}
      </p>
      <div
        className="grid w-full grid-cols-6 gap-[0.3125rem]"
        role="group"
        aria-label={label}
      >
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            aria-label={`${label} ${index + 1}번째 숫자`}
            aria-invalid={isError || undefined}
            value={digit}
            placeholder="-"
            onFocus={(event) => event.currentTarget.select()}
            onChange={(event) => enterDigits(index, event.currentTarget.value)}
            onPaste={(event) => handlePaste(index, event)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            className={`h-[3.125rem] w-full min-w-0 rounded-[0.375rem] border bg-white text-center text-[clamp(0.875rem,1.39cqw,1.25rem)] font-normal outline-none placeholder:text-[#B0B0B0] ${isError ? 'border-[#EF4444] text-[#EF4444] focus:border-[#EF4444]' : 'border-[#ECECEC] text-[#16181D] focus:border-[#2563EB]'}`}
          />
        ))}
      </div>
      <p className="text-[clamp(0.75rem,1.11cqw,1rem)] text-[#B0B0B0]">
        인증코드 유효시간 {minutes}:{seconds}
      </p>
    </div>
  )
}

function AuthFormField({
  label,
  type = 'text',
  placeholder,
  showPasswordRule = false,
  showPasswordToggle = false,
  isVerificationCode = false,
  isVerificationCodeError = false,
  verificationCodeLength = 6,
  verificationDurationSeconds = 300,
  onVerificationCodeChange,
  onVerificationExpired,
  value,
  defaultValue,
  onChange,
  id,
  className = '',
  ...inputProps
}: AuthFormFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [internalValue, setInternalValue] = useState(() =>
    String(value ?? defaultValue ?? ''),
  )
  const canTogglePassword = type === 'password' && showPasswordToggle
  const inputType = canTogglePassword && isPasswordVisible ? 'text' : type
  const passwordValue = String(value ?? internalValue)
  const passwordRules = {
    hasMinimumLength: passwordValue.length >= 8,
    hasEnglishLetter: /[A-Za-z]/.test(passwordValue),
    hasSpecialCharacter: /[^\p{L}\p{N}\s]/u.test(passwordValue),
  }
  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setInternalValue(event.currentTarget.value)
    onChange?.(event)
  }

  if (isVerificationCode) {
    return (
      <VerificationCodeInput
        label={label}
        value={value === undefined ? undefined : String(value)}
        length={verificationCodeLength}
        durationSeconds={verificationDurationSeconds}
        isError={isVerificationCodeError}
        onChange={onVerificationCodeChange}
        onExpired={onVerificationExpired}
      />
    )
  }

  return (
    <div className="flex w-full flex-col gap-[clamp(0.375rem,0.56cqw,0.5rem)]">
      <div className="flex w-full items-center justify-between gap-4">
        <label
          htmlFor={inputId}
          className="text-[1.125rem] font-medium text-[#16181D]"
        >
          {label}
        </label>
        {showPasswordRule && type === 'password' && (
          <div className="flex items-center gap-1 text-right text-[clamp(0.75rem,1.11cqw,1rem)] font-normal">
            <span
              className={
                passwordRules.hasMinimumLength
                  ? 'text-[#16A34A]'
                  : 'text-[#EF4444]'
              }
            >
              8자 이상
            </span>
            <span className="text-[#B0B0B0]">·</span>
            <span
              className={
                passwordRules.hasEnglishLetter
                  ? 'text-[#16A34A]'
                  : 'text-[#EF4444]'
              }
            >
              영문
            </span>
            <span className="text-[#B0B0B0]">·</span>
            <span
              className={
                passwordRules.hasSpecialCharacter
                  ? 'text-[#16A34A]'
                  : 'text-[#EF4444]'
              }
            >
              특수문자 포함
            </span>
          </div>
        )}
      </div>

      <div className="relative w-full">
        <input
          {...inputProps}
          id={inputId}
          type={inputType}
          placeholder={placeholder}
          {...(value !== undefined ? { value } : { defaultValue })}
          onChange={handleChange}
          className={`h-[3.25rem] w-full rounded-[0.3125rem] border border-[#ECECEC] bg-white px-[clamp(0.75rem,1.39cqw,1.25rem)] text-[clamp(0.875rem,1.39cqw,1.25rem)] font-normal text-[#16181D] outline-none placeholder:text-[1rem] placeholder:text-[#B0B0B0] focus:border-[#2563EB] ${canTogglePassword ? 'pr-12' : ''} ${className}`}
        />
        {canTogglePassword && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 표시'}
            aria-pressed={isPasswordVisible}
            className="absolute inset-y-0 right-[clamp(0.75rem,1.39cqw,1.25rem)] flex items-center justify-center text-[#B0B0B0]"
          >
            <img
              src={isPasswordVisible ? eyeOffIcon : eyeIcon}
              alt=""
              className="h-auto w-[clamp(1.25rem,1.67cqw,1.5rem)]"
            />
          </button>
        )}
      </div>
    </div>
  )
}

export default AuthFormField
