// 회원가입 단계 진행 표시 컴포넌트입니다. (로그인 화면에서는 사용하지 않습니다.)
// - 현재 단계와 전체 단계를 받아 진행 상태를 표시합니다.
// - 계정 만들기, 비밀번호 설정, 이메일 인증, 약관 동의 등의 단계를 보여줍니다.
type AuthProgressProps = {
  currentStep: number
  totalSteps?: number
  onStepClick?: (step: number) => void
}

const stepLabels = ['계정 만들기', '비밀번호 설정', '이메일 인증', '약관 동의', '가입 완료']

function AuthProgress({ currentStep, totalSteps = 5, onStepClick }: AuthProgressProps) {
  return (
    <div className="flex w-full flex-col gap-[clamp(0.25rem,0.56cqw,0.5rem)]">
      <div
        className="flex w-full gap-[clamp(0.125rem,0.28cqw,0.25rem)]"
        role="group"
        aria-label="회원가입 진행 단계"
      >
        {Array.from({ length: totalSteps }, (_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`${index + 1}단계로 이동`}
            aria-current={index + 1 === currentStep ? 'step' : undefined}
            disabled={index + 1 >= currentStep || !onStepClick}
            onClick={() => onStepClick?.(index + 1)}
            className={`h-[clamp(0.125rem,0.28cqw,0.25rem)] min-w-0 rounded-full ${
              index === currentStep - 1 ? 'flex-[1.2]' : 'flex-1'
            } ${index < currentStep ? 'bg-[#2563EB]' : 'bg-[#ECECEC]'} transition-all duration-300 ease-in-out enabled:cursor-pointer disabled:cursor-default`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between text-[clamp(0.75rem,1.11cqw,1rem)] font-normal leading-none text-[#B0B0B0]">
        <span>STEP {String(currentStep).padStart(2, '0')}</span>
        <span>{stepLabels[currentStep - 1]}</span>
      </div>
    </div>
  )
}

export default AuthProgress
