// 인증 화면에서 공통으로 쓰는 기본 버튼입니다.
// - 계속하기, 인증번호 확인, 약관 동의 완료 등의 동작에 사용합니다.
// - 기본/보조 스타일과 비활성화(disabled)/로딩 상태를 처리합니다.
// - 소셜 제공자별 버튼은 SocialLoginButton.tsx에서 별도로 다룹니다.

const buttonStyles = {
  // 일반 버튼
  default: {
    color: 'bg-[#16181D] text-white hover:bg-[#2A2D34]',
  },
  // 다음으로 조건에 따라 다음으로 안넘어가지는 버튼
  disabled: {
    color: 'bg-[#B0B0B0] text-white',
  },
}

// buttonStyles에 넣어둔 스타일 이름만 적용되게 하는거임
type ButtonName = keyof typeof buttonStyles

//버튼에 전달가능한 프롭의 형태와 타입정의하는거
type ButtonProps = {
  name?: ButtonName
  children: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
}

function Button({ name = 'default', children, onClick, disabled = false }: ButtonProps) {
  //네임에 맞는 설정 버튼스타일에서 골라서 selected에 넣고 스타일에서 점표기법으로 스타일 내용에서 점표기법으로 내용 넣음
  const selected = buttonStyles[name] ?? buttonStyles.default

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`group flex w-full items-center justify-center rounded-[0.3125rem] text-[clamp(1rem,1.39cqw,1.25rem)] font-medium [&_img]:size-[1em] ${selected.color} py-[0.4rem] transition-colors duration-200 ease-in-out cursor-pointer disabled:cursor-not-allowed`}>
      {children}
    </button>
  )
}

export default Button
