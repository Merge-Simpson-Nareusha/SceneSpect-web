import logo from '../../assets/logos/scenespect-logo-full.svg'
import userIcon from '../../assets/icons/navigation/user.svg'
import chevron from '../../assets/icons/navigation/chevron.svg'

export type NavigationHeaderProps = {
  // 로그인 여부와 사용자 정보는 부모 페이지에서 전달합니다. API 호출은 없습니다.
  auth?: 'guest' | 'signedIn'
  userName?: string
  homeHref?: string
  loginHref?: string
  links?: { label: string; href: string }[]
  accountOpen?: boolean
  onAccountClick?: () => void
}

const defaultLinks = [
  { label: '서비스', href: '#service' },
  { label: '프로젝트 소개', href: '#projects' },
  { label: '팀 소개', href: '#team' },
]

/** Figma 04_Component의 Navigation/Header: 로그인 전·후 공통 뷰. */
export default function NavigationHeader({
  auth = 'guest',
  userName = '이름임',
  homeHref = '/',
  loginHref = '/login',
  links = defaultLinks,
  accountOpen = false,
  onAccountClick,
}: NavigationHeaderProps) {
  const focusStyle =
    'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2962ff]'

  return (
    <header className="relative flex min-h-[80px] w-full flex-wrap items-center justify-between gap-y-[12px] bg-white/80 px-[60px] text-[#16181d] backdrop-blur-[20px] max-md:px-[20px] max-md:py-[10px]">
      <a href={homeHref} aria-label="SceneSpect 홈" className={`shrink-0 ${focusStyle}`}>
        <img
          src={logo}
          alt="SceneSpect"
          className="block h-[60px] w-[191px] object-contain max-md:h-[44px] max-md:w-[140px]"
        />
      </a>
      <nav
        aria-label="주 메뉴"
        className="flex items-center gap-[50px] text-[22px] leading-normal tracking-[-1.32px] max-md:order-3 max-md:w-full max-md:justify-center max-md:gap-[24px] max-md:text-[16px]"
      >
        {links.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className={`whitespace-nowrap transition-colors hover:text-[#2962ff] ${focusStyle}`}
          >
            {label}
          </a>
        ))}
      </nav>
      <div className="flex w-[200px] shrink-0 justify-end max-md:w-auto">
        {auth === 'guest' ? (
          <a
            href={loginHref}
            className={`rounded-[5px] bg-[#f1f5f9] px-[20px] py-[8px] text-[30px] leading-[36px] font-light transition-colors hover:bg-[#e2e8f0] max-md:text-[20px] max-md:leading-[28px] ${focusStyle}`}
          >
            로그인
          </a>
        ) : (
          <button
            type="button"
            aria-label={`${userName} 계정 메뉴`}
            aria-expanded={accountOpen}
            onClick={onAccountClick}
            className={`flex max-w-[200px] cursor-pointer items-center gap-[10px] rounded-[5px] px-[16px] py-[8px] text-[28px] leading-[33px] font-light transition-colors hover:bg-[#e2e8f0] max-md:max-w-[140px] max-md:text-[20px] max-md:leading-[28px] ${accountOpen ? 'bg-[#e2e8f0]' : 'bg-[#f1f5f9]'} ${focusStyle}`}
          >
            <img src={userIcon} alt="" className="size-[23.5px] shrink-0" />
            <span className="min-w-0 truncate">{userName}</span>
            <span
              className={`flex h-[8px] w-[16px] shrink-0 items-center justify-center transition-transform ${accountOpen ? 'rotate-180' : ''}`}
            >
              <img src={chevron} alt="" className="h-[17.5px] w-[9.3px] rotate-90" />
            </span>
          </button>
        )}
      </div>
    </header>
  )
}
