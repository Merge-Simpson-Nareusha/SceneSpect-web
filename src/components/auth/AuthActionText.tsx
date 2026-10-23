// 인증 화면에서 안내 문구와 액션을 한 줄로 보여주는 공통 컴포넌트입니다.
// - 예: "이미 계정이 있으신가요? 로그인", "아직 계정이 없으신가요? 회원가입"
// - 예: "인증 메일이 오지 않았나요? 재전송"
// - 페이지 이동은 링크(<a>), 재전송처럼 동작을 실행할 때는 버튼(<button>)을 사용합니다.
// - 문구, 액션 텍스트, 이동 경로 또는 클릭 동작을 props로 전달받도록 만듭니다.
type FormPromptProps = {
  message: string
  linkText: string
  href?: string
  onClick?: () => void
  variant?: 'emphasis' | 'regular'
}

function AuthActionText({
  message,
  linkText,
  href,
  onClick,
  variant = 'emphasis',
}: FormPromptProps) {
  const isRegular = variant === 'regular'

  return (
    <p className={`text-center text-[clamp(0.75rem,1.11cqw,1rem)] ${isRegular ? '' : 'font-semibold'}`}>
      <span className={`text-[#B0B0B0] ${isRegular ? '' : 'font-semibold'}`}>{message}</span>{' '}
      {href !== undefined ? (
        <a href={href} className={`text-[#2563EB] ${isRegular ? 'font-medium' : 'font-semibold'}`}>
          {linkText}
        </a>
      ) : (
        <button
          type="button"
          onClick={onClick}
          className={`cursor-pointer text-[#2563EB] ${isRegular ? 'font-medium' : 'font-semibold'}`}
        >
          {linkText}
        </button>
      )}
    </p>
  )
}

export default AuthActionText
