import { useState } from 'react'
import BrandLogo from '../components/common/BrandLogo'
import CommonButton from '../components/common/CommonButton'
import type { ButtonVariant } from '../components/common/CommonButton'
import AccountButton from '../components/common/AccountButton'
import MockMacMenuBar from './MockMacMenuBar'
import NavigationHeader from '../components/layout/NavigationHeader'

const variants: ButtonVariant[] = ['compactLight', 'compactDark', 'ctaLight', 'ctaDark']

export default function CommonPreviewPage() {
  const [mockBar, setMockBar] = useState(false)
  const [auth, setAuth] = useState<'guest' | 'signedIn'>('signedIn')
  const [name, setName] = useState('이름임')
  const [email, setEmail] = useState('example@gmail.com')
  const [originalSizes, setOriginalSizes] = useState(false)
  const [message, setMessage] = useState(
    '버튼을 누르면 UI 이벤트를 확인할 수 있어요. 서버 요청은 보내지 않습니다.',
  )
  const action = (label: string) => setMessage(`${label} 클릭 — UI 동작 확인 완료`)

  return (
    <div className="min-h-svh min-w-[1024px] bg-[#f8fafc] text-[#16181d]">
      {mockBar && <MockMacMenuBar />}
      <NavigationHeader
        homeHref="?preview=common"
        links={[
          { label: '서비스', href: '#service' },
          { label: '프로젝트 소개', href: '#projects' },
          { label: '팀 소개', href: '#team' },
        ]}
        {...(auth === 'signedIn'
          ? {
              auth,
              userName: name,
              email,
              profileHref: '#account-preview',
              settingsHref: '#preview-settings',
              onLogout: () => {
                setAuth('guest')
                setMessage('로그아웃 콜백 확인 — 미리보기만 로그인 전 상태로 변경했습니다.')
              },
            }
          : { auth, loginHref: '#preview-settings' })}
      />
      <main className="mx-auto max-w-[1512px] space-y-[40px] px-[60px] py-[40px]">
        <div>
          <p className="text-[14px] text-[#737b88]">04_Component / 00 · 공통</p>
          <h1 className="mt-[8px] text-[28px] font-semibold">공통 컴포넌트 미리보기</h1>
          <p className="mt-[12px] text-[16px] text-[#737b88]">
            로고 · 버튼 · 계정 드롭다운 · 로그인 전후 헤더
          </p>
        </div>
        <section
          id="preview-settings"
          aria-label="미리보기 설정"
          className="flex flex-wrap items-center gap-[24px] rounded-[12px] border border-slate-200 bg-white p-[24px] text-[14px]"
        >
          <label className="flex items-center gap-[8px]">
            로그인 상태
            <select
              value={auth}
              onChange={(event) => setAuth(event.target.value === 'guest' ? 'guest' : 'signedIn')}
              className="rounded-[5px] border border-slate-300 px-[12px] py-[8px]"
            >
              <option value="signedIn">로그인 후</option>
              <option value="guest">로그인 전</option>
            </select>
          </label>
          <label className="flex items-center gap-[8px]">
            표시 이름
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-[5px] border border-slate-300 px-[12px] py-[8px]"
            />
          </label>
          <label className="flex items-center gap-[8px]">
            이메일
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-[5px] border border-slate-300 px-[12px] py-[8px]"
            />
          </label>
          <label className="flex items-center gap-[8px]">
            <input
              type="checkbox"
              checked={originalSizes}
              onChange={(event) => setOriginalSizes(event.target.checked)}
            />
            Figma 기준 글씨·버튼 크기 비교
          </label>
          <label className="flex items-center gap-[8px]">
            <input
              type="checkbox"
              checked={mockBar}
              onChange={(event) => setMockBar(event.target.checked)}
            />
            목업용 Mac 메뉴바
          </label>
          <a href="?preview=header" className="text-[#2962ff] underline underline-offset-4">
            헤더 단독 보기
          </a>
        </section>
        <section
          aria-labelledby="logo-heading"
          className="rounded-[12px] border border-slate-200 bg-white p-[32px]"
        >
          <h2 id="logo-heading" className="text-[20px] font-semibold">
            Brand/Logo
          </h2>
          <div className="mt-[32px] flex items-center gap-[80px]">
            {(['full', 'symbol', 'wordmark'] as const).map((variant) => (
              <div key={variant} className="space-y-[20px]">
                <p className="text-[14px] text-[#737b88]">{variant}</p>
                <BrandLogo variant={variant} />
              </div>
            ))}
          </div>
        </section>
        <section
          aria-labelledby="button-heading"
          className="rounded-[12px] border border-slate-200 bg-white p-[32px]"
        >
          <h2 id="button-heading" className="text-[20px] font-semibold">
            Button/Base
          </h2>
          <p className="mt-[8px] text-[14px] text-[#737b88]">
            {originalSizes
              ? 'Figma 기준 크기 (배치는 실사용 기준)'
              : '실사용 크기 · 일반 16px / CTA 20px'}{' '}
            · 오른쪽은 Hover 상태 고정 예시입니다.
          </p>
          <div className="mt-[32px] space-y-[32px]">
            {variants.map((variant) => (
              <div key={variant}>
                <h3 className="mb-[12px] text-[14px] text-[#737b88]">{variant}</h3>
                <div className="flex flex-wrap gap-[24px]">
                  <CommonButton
                    variant={variant}
                    size={originalSizes ? 'design' : 'default'}
                    onClick={() => action(`${variant} Default`)}
                  >
                    {variant.startsWith('cta') ? '로그인 하러가기' : '로그인'}
                  </CommonButton>
                  <CommonButton
                    variant={variant}
                    size={originalSizes ? 'design' : 'default'}
                    previewState="hover"
                    onClick={() => action(`${variant} Hover`)}
                  >
                    {variant.startsWith('cta') ? '로그인 하러가기' : '로그인'}
                  </CommonButton>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section
          id="account-preview"
          aria-labelledby="account-heading"
          className="rounded-[12px] border border-slate-200 bg-white p-[32px]"
        >
          <h2 id="account-heading" className="text-[20px] font-semibold">
            Button/Base · Account
          </h2>
          <p className="mt-[8px] text-[14px] text-[#737b88]">
            프로필 버튼을 누르면 Open 상태를 확인할 수 있어요. 바깥 클릭·Escape·Tab 이동으로
            닫힙니다.
          </p>
          <div className="mt-[32px] flex min-h-[360px] items-start gap-[48px]">
            <div className="min-w-0 flex-1 space-y-[12px]">
              <p className="text-[14px] text-[#737b88]">Default → Open</p>
              <AccountButton
                userName={name}
                email={email}
                size={originalSizes ? 'design' : 'default'}
                profileHref="#account-preview"
                settingsHref="#preview-settings"
                onLogout={() => action('로그아웃')}
              />
            </div>
            <div className="min-w-0 flex-1 space-y-[12px]">
              <p className="text-[14px] text-[#737b88]">Hover → Open</p>
              <AccountButton
                userName={name}
                email={email}
                size={originalSizes ? 'design' : 'default'}
                previewState="hover"
                profileHref="#account-preview"
                settingsHref="#preview-settings"
                onLogout={() => action('로그아웃')}
              />
            </div>
          </div>
        </section>
        <p role="status" className="rounded-[8px] bg-[#eff6ff] p-[20px] text-[14px] text-[#1e40af]">
          {message}
        </p>
      </main>
    </div>
  )
}
