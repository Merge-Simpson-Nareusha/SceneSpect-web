import BrandLogo from '../common/BrandLogo'
import AccountButton from '../common/AccountButton'
import type { AccountButtonProps } from '../common/AccountButton'
import { commonStyles } from '../common/styles'
import { CommonButtonLink } from '../common/CommonButton'

type HeaderAccountState =
  | { accountOpen: boolean; onAccountOpenChange: (open: boolean) => void }
  | { accountOpen?: undefined; onAccountOpenChange?: never }

type HeaderAuthProps =
  | { auth: 'guest'; loginHref: string }
  | ({ auth: 'signedIn' } & Pick<
      AccountButtonProps,
      'userName' | 'email' | 'profileHref' | 'settingsHref' | 'onLogout'
    > &
      HeaderAccountState)

export type NavigationHeaderProps = HeaderAuthProps & {
  homeHref: string
  links: { label: string; href: string }[]
  activeHref?: string
}

/** 데스크톱 공통 헤더. API 대신 props로 사용자 정보와 동작을 전달합니다. */
export default function NavigationHeader(props: NavigationHeaderProps) {
  const { homeHref, links, activeHref } = props
  const focusClasses = commonStyles.focus
  const accountState =
    props.auth === 'signedIn' && props.accountOpen !== undefined
      ? { open: props.accountOpen, onOpenChange: props.onAccountOpenChange }
      : {}
  return (
    <header className="relative z-10 w-full bg-white/80 text-[#16181d] backdrop-blur-[20px]">
      <div className="mx-auto grid min-h-[80px] max-w-[1512px] grid-cols-[minmax(164px,1fr)_auto_minmax(164px,1fr)] items-center gap-x-[24px] px-[clamp(24px,3.97vw,60px)] py-[12px]">
        <a
          href={homeHref}
          aria-label="SceneSpect 홈"
          className={`flex min-h-[44px] w-fit items-center ${commonStyles.controlRadius} ${focusClasses}`}
        >
          <BrandLogo width={164} decorative />
        </a>
        <nav
          aria-label="주 메뉴"
          className="flex items-center gap-[clamp(24px,2.12vw,32px)] text-[16px] leading-[24px] tracking-[-0.32px]"
        >
          {links.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              aria-current={activeHref === href ? 'page' : undefined}
              className={`flex min-h-[44px] items-center ${commonStyles.controlRadius} whitespace-nowrap transition-colors duration-150 hover:text-[#2962ff] motion-reduce:transition-none ${activeHref === href ? 'text-[#2962ff]' : ''} ${focusClasses}`}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex min-w-0 justify-end">
          {props.auth === 'guest' ? (
            <CommonButtonLink href={props.loginHref}>로그인</CommonButtonLink>
          ) : (
            <AccountButton
              align="end"
              userName={props.userName}
              email={props.email}
              profileHref={props.profileHref}
              settingsHref={props.settingsHref}
              onLogout={props.onLogout}
              {...accountState}
            />
          )}
        </div>
      </div>
    </header>
  )
}
