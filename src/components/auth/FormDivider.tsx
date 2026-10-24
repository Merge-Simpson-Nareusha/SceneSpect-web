// 이메일 로그인과 소셜 로그인 사이를 구분하는 선과 문구(예: "또는")입니다.
// - 로그인 및 회원가입 화면에서 공통으로 사용합니다.
const FormDivider = () => {
  return (
    <div className="flex items-center gap-[clamp(0.5rem,0.83cqw,0.75rem)]">
      <div className="h-px flex-1 bg-[#B0B0B0]" />
      <span className="shrink-0 text-[#B0B0B0] font-semibold text-[clamp(0.75rem,1.11cqw,1rem)]">소셜계정으로 시작하기</span>
      <div className="h-px flex-1 bg-[#B0B0B0]" />
    </div>
  )
}

export default FormDivider
