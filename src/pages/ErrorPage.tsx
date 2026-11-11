import { useNavigate } from 'react-router'
import BrandLogo from '../components/common/BrandLogo'
import { commonStyles } from '../components/common/styles'
import ErrorState from '../components/feedback/ErrorState'
import type { ErrorAction } from '../components/feedback/ErrorState'
import { errorContent } from '../components/feedback/content'
import type { PageErrorKind } from '../services/errors'

export default function ErrorPage({
  kind = 'notFound',
  onRetry,
}: {
  kind?: PageErrorKind
  onRetry?: () => void | Promise<void>
}) {
  const navigate = useNavigate()
  // 세션 만료가 확인된 경우에만 로그인으로 보냅니다. 나머지는 기존 팀 페이지에서 인증합니다.
  const teamHref = kind === 'sessionExpired' ? '/login' : '/teams'
  const goBack = () => {
    const hasAppHistory =
      typeof window.history.state?.idx === 'number' && window.history.state.idx > 0
    const hasSameOriginReferrer =
      document.referrer && new URL(document.referrer).origin === window.location.origin
    // 공통 헤더의 일반 링크로 이동한 경우에는 Router의 idx가 0으로 초기화됩니다.
    if (window.history.length > 1 && (hasAppHistory || hasSameOriginReferrer)) navigate(-1)
    else navigate(teamHref, { replace: true })
  }
  const retryable = kind === 'server' || kind === 'network' || kind === 'unavailable'
  const actions: ErrorAction[] =
    kind === 'sessionExpired'
      ? [{ label: '로그인하기', href: '/login' }]
      : retryable
        ? [
            { label: '다시 시도', onClick: onRetry ?? (() => window.location.reload()) },
            { label: '내 팀으로 돌아가기', href: teamHref },
          ]
        : [
            { label: '내 팀으로 돌아가기', href: teamHref },
            { label: '이전 페이지', onClick: goBack },
          ]

  return (
    <div className="flex min-h-svh flex-col bg-white">
      <header className="border-b border-[#eef0f4]">
        <div className="mx-auto flex h-[80px] max-w-[1280px] items-center justify-between gap-[20px] px-[24px] sm:px-[40px]">
          <a href="/" aria-label="SceneSpect 홈" className={`rounded-[5px] ${commonStyles.focus}`}>
            <BrandLogo width={146} decorative />
          </a>
          <a
            href={teamHref}
            className={`flex min-h-[44px] items-center gap-[8px] rounded-[5px] text-[13px] font-medium text-[#737b88] hover:text-[#2962ff] ${commonStyles.focus}`}
          >
            내 팀으로 <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-[24px]">
        <ErrorState
          {...errorContent[kind]}
          actions={actions}
          size="page"
          headingLevel={1}
          className="w-full max-w-[600px]"
        />
      </main>
      <footer className="px-[24px] py-[24px] text-center text-[12px] text-[#9aa2af]">
        SceneSpect · 함께 만드는 더 안전한 영상
      </footer>
    </div>
  )
}
