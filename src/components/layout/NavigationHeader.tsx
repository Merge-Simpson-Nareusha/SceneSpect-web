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
  activeHref?: string
  accountOpen?: boolean
  accountControlsId?: string
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
  activeHref,
  accountOpen = false,
  accountControlsId,
  onAccountClick,
}: NavigationHeaderProps) {
  const focusStyle =
    'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2962ff]'
  const displayName = userName.trim() || '사용자'

  return (
    <header className="relative z-10 h-[80px] w-full border-b border-[#eef0f3] bg-white/80 text-[#16181d] backdrop-blur-[20px]">
      <div className="mx-auto grid h-full max-w-[1512px] grid-cols-[minmax(164px,1fr)_auto_minmax(164px,1fr)] items-center gap-x-[24px] px-[clamp(24px,3.97vw,60px)]">
        <a
          href={homeHref}
          aria-label="SceneSpect 홈"
          className={`flex min-h-[44px] w-fit items-center rounded-[4px] ${focusStyle}`}
        >
          <img src={logo} alt="" className="block h-[52px] w-[164px] object-contain" />
        </a>
        <nav
          aria-label="주 메뉴"
          className="flex items-center gap-[clamp(24px,2.65vw,40px)] text-[18px] leading-[26px] tracking-[-0.36px]"
        >
          {links.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              aria-current={activeHref === href ? 'page' : undefined}
              className={`flex min-h-[44px] items-center rounded-[4px] whitespace-nowrap transition-colors duration-150 hover:text-[#2962ff] motion-reduce:transition-none ${activeHref === href ? 'text-[#2962ff]' : ''} ${focusStyle}`}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex min-w-0 justify-end">
          {auth === 'guest' ? (
            <a
              href={loginHref}
              className={`flex min-h-[44px] items-center rounded-[5px] bg-[#f1f5f9] px-[16px] py-[8px] text-[18px] leading-[26px] font-normal transition-colors hover:bg-[#e2e8f0] motion-reduce:transition-none ${focusStyle}`}
            >
              로그인
            </a>
          ) : (
            <button
              type="button"
              aria-label={`${displayName} 계정 메뉴`}
              title={displayName}
              aria-expanded={accountControlsId ? accountOpen : undefined}
              aria-controls={accountControlsId}
              onClick={onAccountClick}
              className={`flex min-h-[44px] max-w-[200px] min-w-0 cursor-pointer items-center gap-[8px] rounded-[5px] px-[12px] py-[8px] text-[18px] leading-[26px] font-normal transition-colors hover:bg-[#e2e8f0] motion-reduce:transition-none ${accountOpen ? 'bg-[#e2e8f0]' : 'bg-[#f1f5f9]'} ${focusStyle}`}
            >
              <img src={userIcon} alt="" className="size-[20px] shrink-0" />
              <span className="min-w-0 truncate">{displayName}</span>
              <span
                className={`flex h-[8px] w-[14px] shrink-0 items-center justify-center transition-transform motion-reduce:transition-none ${accountOpen ? 'rotate-180' : ''}`}
              >
                <img src={chevron} alt="" className="h-[14px] w-[7.43px] rotate-90" />
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
