import { useState } from 'react'
import NavigationHeader from '../components/layout/NavigationHeader'

/** 실제 페이지 상단 배치로 확인하는 데스크톱 전용 미리보기입니다. */
export default function HeaderPreviewPage() {
  const [accountOpen, setAccountOpen] = useState(false)
  const [auth, setAuth] = useState<'guest' | 'signedIn'>('signedIn')
  const [userName, setUserName] = useState('이름임')

  return (
    <div className="flex min-h-svh flex-col bg-white text-[#16181d]">
      <NavigationHeader
        homeHref="?preview=header"
        links={[
          { label: '서비스', href: '#service' },
          { label: '프로젝트 소개', href: '#projects' },
          { label: '팀 소개', href: '#team' },
        ]}
        {...(auth === 'signedIn'
          ? {
              auth,
              userName,
              email: 'example@gmail.com',
              profileHref: '#preview-controls',
              settingsHref: '#preview-controls',
              onLogout: () => {
                setAuth('guest')
                setAccountOpen(false)
              },
              accountOpen,
              onAccountOpenChange: setAccountOpen,
            }
          : { auth, loginHref: '#preview-controls' })}
      />
      <main className="mx-auto w-full max-w-[1512px] flex-1 px-[60px] py-[64px]">
        <p className="text-[14px] tracking-[0.04em] text-[#8b929e]">HEADER PREVIEW</p>
        <h1 className="mt-[12px] text-[28px] leading-[40px] font-medium tracking-[-0.84px]">
          페이지 상단에 적용한 헤더
        </h1>
        <p className="mt-[12px] text-[16px] leading-[26px] text-[#737b88]">
          아래 본문은 배치를 확인하기 위한 임시 영역입니다.
        </p>
      </main>
      <aside
        id="preview-controls"
        aria-label="헤더 미리보기 설정"
        className="border-t border-[#eef0f3] bg-[#fafbfc]"
      >
        <div className="mx-auto flex max-w-[1512px] items-center gap-[24px] px-[60px] py-[20px] text-[14px]">
          <span className="text-[#737b88]">미리보기 설정</span>
          <label className="flex items-center gap-[8px]">
            로그인 상태
            <select
              value={auth}
              onChange={(event) => {
                setAuth(event.target.value === 'guest' ? 'guest' : 'signedIn')
                setAccountOpen(false)
              }}
              className="rounded-[5px] border border-[#dde1e7] bg-white px-[12px] py-[8px]"
            >
              <option value="signedIn">로그인 후</option>
              <option value="guest">로그인 전</option>
            </select>
          </label>
          <label className="flex items-center gap-[8px]">
            표시 이름
            <input
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
              className="w-[180px] rounded-[5px] border border-[#dde1e7] bg-white px-[12px] py-[8px]"
            />
          </label>
          <span className="ml-auto text-[#737b88]">데스크톱 · UI 미리보기</span>
        </div>
      </aside>
    </div>
  )
}
