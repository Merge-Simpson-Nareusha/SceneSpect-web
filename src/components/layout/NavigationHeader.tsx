import BrandLogo from '../common/BrandLogo'
import AccountButton from '../common/AccountButton'
import { CommonButtonLink } from '../common/CommonButton'

export type NavigationHeaderProps = {
  auth?: 'guest' | 'signedIn'
  userName?: string
  email?: string
  homeHref?: string
  loginHref?: string
  profileHref?: string
  settingsHref?: string
  onLogout?: () => void
  links?: { label: string; href: string }[]
  activeHref?: string
  accountOpen?: boolean
  onAccountOpenChange?: (open: boolean) => void
}

const defaultLinks = [
  { label: '서비스', href: '#service' },
  { label: '프로젝트 소개', href: '#projects' },
  { label: '팀 소개', href: '#team' },
]

/** 데스크톱 공통 헤더. API 대신 props로 사용자 정보와 동작을 전달합니다. */
export default function NavigationHeader({
  auth = 'guest',
  userName,
  email,
  homeHref = '/',
  loginHref = '/login',
  profileHref,
  settingsHref,
  onLogout,
  links = defaultLinks,
  activeHref,
  accountOpen,
  onAccountOpenChange,
}: NavigationHeaderProps) {
  const focusStyle =
    'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2962ff]'
  return (
    <header className="relative z-10 h-[80px] w-full border-b border-[#eef0f3] bg-white/80 text-[#16181d] backdrop-blur-[20px]">
      <div className="mx-auto grid h-full max-w-[1512px] grid-cols-[minmax(164px,1fr)_auto_minmax(164px,1fr)] items-center gap-x-[24px] px-[clamp(24px,3.97vw,60px)]">
        <a
          href={homeHref}
          aria-label="SceneSpect 홈"
          className={`flex min-h-[44px] w-fit items-center rounded-[4px] ${focusStyle}`}
        >
          <BrandLogo width={164} decorative />
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
            <CommonButtonLink href={loginHref} size="header">
              로그인
            </CommonButtonLink>
          ) : (
            <AccountButton
              size="header"
              userName={userName}
              email={email}
              profileHref={profileHref}
              settingsHref={settingsHref}
              onLogout={onLogout}
              open={accountOpen}
              onOpenChange={onAccountOpenChange}
            />
          )}
        </div>
      </div>
    </header>
  )
}
