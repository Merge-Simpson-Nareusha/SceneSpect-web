// Google, Apple, Kakao, X 소셜 로그인/회원가입 버튼입니다.
// - 하나의 컴포넌트에 제공자(provider)를 전달해 로고와 스타일을 구분합니다.
// - 실제 소셜 인증 연결 동작은 서버/API 규격이 정해진 뒤 연결합니다.
import googleLogo from '../../assets/logos/social/google.svg'
import appleLogo from '../../assets/logos/social/apple.svg'
import kakaoLogo from '../../assets/logos/social/kakao.svg'
import kakaoLogoHover from '../../assets/logos/social/kakao-hover.svg'
import xLogo from '../../assets/logos/social/x.svg'

const buttonStyles = {
  //x 회원가입, 로그인 버튼
  x: {
    color: 'bg-[#16181D] text-white hover:bg-[#2A2D34]',
    content: <img src={xLogo} alt="xLogo" />,
  },
  //카카오 회원가입, 로그인 버튼
  kakao: {
    color: 'bg-[#FEE500] text-black hover:bg-[#FFF062]',
    content: (
      <span className="inline-grid place-items-center">
        <img
          src={kakaoLogo}
          alt="카카오"
          className="col-start-1 row-start-1 opacity-100 transition-opacity duration-200 ease-in-out group-hover:opacity-0"
        />
        {/* 호버시 이미지 바뀜 */}
        <img
          src={kakaoLogoHover}
          alt=""
          className="col-start-1 row-start-1 opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100"
        />
      </span>
    ),
  },
  //구글 회원가입, 로그인 버튼
  google: {
    color: 'bg-[#F5F5F5] text-[#16181D] hover:bg-[#ECECEC]',
    content: <img src={googleLogo} alt="googleLogo" />,
  },
  //애플 회원가입, 로그인 버튼
  apple: {
    color: 'bg-[#16181D] text-white hover:bg-[#2A2D34]',
    content: <img src={appleLogo} alt="appleLogo" />,
  },
}

// buttonStyles에 넣어둔 스타일 이름만 적용되게 하는거임
type ButtonName = keyof typeof buttonStyles

//버튼에 전달가능한 프롭의 형태와 타입정의하는거
type ButtonProps = {
  name?: ButtonName
}

function SocialLoginButton({ name = 'google' }: ButtonProps) {
  //네임에 맞는 설정 버튼스타일에서 골라서 selected에 넣고 스타일에서 점표기법으로 스타일 내용에서 점표기법으로 내용 넣음
  const selected = buttonStyles[name] ?? buttonStyles.google

  return (
    <button
      className={`group flex w-full items-center justify-center rounded-[0.3125rem] text-[clamp(0.875rem,1.39cqw,1.125rem)] font-semibold [&_img]:size-[1em] ${selected.color} py-[0.625rem] transition-colors duration-200 ease-in-out cursor-pointer max-md:min-h-11`}
    >
      {selected.content}
    </button>
  )
}

export default SocialLoginButton
