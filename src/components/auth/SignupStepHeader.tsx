// 현재 회원가입 단계에 맞는 로고, 제목, 설명을 보여주는 컴포넌트입니다.
// - currentStep에 1부터 5까지의 숫자를 전달하면 지정된 내용으로 바뀝니다.
import scenespectLogoFull from '../../assets/logos/scenespect-logo-full.svg'
import scenespectLogoLight from '../../assets/logos/scenespect-logo-light.svg'
import scenespectLogoSymbol from '../../assets/logos/scenespect-logo-symbol.svg'

type SignupStepHeaderProps = {
  currentStep: number
}

const signupSteps = {
  1: {
    title: '시작하기',
    description: '계정을 만들고 영상 분석을 시작해보세요.',
    layout: 'brand',
  },
  2: {
    title: '비밀번호를 설정해 주세요',
    description: '계정 보안을 위해 안전한 비밀번호를 설정해 주세요',
    layout: 'standard',
  },
  3: {
    title: '이메일 인증을 해주세요',
    description: '인증코드를 입력해 주세요',
    layout: 'standard',
  },
  4: {
    title: '약관을 확인해 주세요',
    description: 'Scene Spect 이용을 위해 약관에 동의해 주세요.',
    layout: 'standard',
  },
  5: {
    title: '오신 것을 환영해요',
    description: '이제 영상 분석을 시작해보세요.',
    layout: 'welcome',
  },
} as const

function SignupStepHeader({ currentStep }: SignupStepHeaderProps) {
  const step = signupSteps[currentStep as keyof typeof signupSteps] ?? signupSteps[1]
  const titleClassName = `font-semibold text-[#16181D] ${
    currentStep >= 2 && currentStep <= 4
      ? 'w-full whitespace-nowrap text-[clamp(1.5rem,2.92cqw,2.625rem)] max-md:whitespace-normal max-md:text-[clamp(1.5rem,6vw,2rem)]'
      : 'whitespace-nowrap text-[clamp(1.5rem,3.47cqw,3.125rem)]'
  } ${
    currentStep === 4 ? 'tracking-[-0.04em]' : ''
  }`
  const welcomeSuffixClassName =
    'whitespace-nowrap text-[clamp(1.5rem,3.47cqw,3.125rem)] font-semibold text-[#16181D]'

  if (step.layout === 'welcome') {
    return (
      <div className="flex flex-col items-start gap-[clamp(0.375rem,0.69cqw,0.625rem)]">
        <div className="flex items-center gap-[clamp(0.25rem,0.56cqw,0.5rem)]">
          <img
            src={scenespectLogoFull}
            alt="SceneSpect"
            className="h-[clamp(3rem,6.67cqw,6rem)] w-auto object-contain"
          />
          <span className={welcomeSuffixClassName}>에</span>
        </div>
        <h1 className={titleClassName}>{step.title}</h1>
        <p className="text-[clamp(0.75rem,1.11cqw,1rem)] text-[#B0B0B0]">
          {step.description}
        </p>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col items-start gap-[clamp(0.5rem,1.39cqw,1.25rem)] max-md:gap-4">
      <img
        src={scenespectLogoSymbol}
        alt="SceneSpect 심볼"
        className="h-[clamp(1.5rem,2.64cqw,2.375rem)] w-auto object-contain"
      />
      <div className="flex w-full flex-col gap-[0.25rem] max-md:gap-2">
        <div className="flex w-full items-center gap-[clamp(0.25rem,0.56cqw,0.5rem)]">
          {step.layout === 'brand' && (
            <img
              src={scenespectLogoLight}
              alt="SceneSpect"
              className="h-[clamp(2rem,4.44cqw,4rem)] w-auto object-contain"
            />
          )}
          <h1 className={titleClassName}>{step.title}</h1>
        </div>
        <p className="text-[clamp(0.75rem,1.11cqw,1rem)] text-[#B0B0B0]">
          {step.description}
        </p>
      </div>
    </div>
  )
}

export default SignupStepHeader
