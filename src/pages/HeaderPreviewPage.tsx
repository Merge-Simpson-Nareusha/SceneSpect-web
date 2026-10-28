import { useState } from 'react'
import NavigationHeader from '../components/layout/NavigationHeader'

/** /?preview=header 에서 서버 없이 두 상태를 확인합니다. */
export default function HeaderPreviewPage() {
  const [accountOpen, setAccountOpen] = useState(false)
  const [userName, setUserName] = useState('이름임')

  return (
    <main className="min-h-svh bg-[#f5f6f8] text-[#16181d]">
      <div className="mx-auto max-w-[1512px] space-y-[32px] py-[32px]">
        <div className="px-[24px]">
          <h1 className="text-[24px] font-semibold">공통 헤더 미리보기</h1>
          <p className="mt-[8px] text-[16px] text-slate-600">
            Figma 04_Component · Navigation/Header
          </p>
        </div>
        <section aria-labelledby="guest-title">
          <h2 id="guest-title" className="mb-[12px] px-[24px] text-[16px]">
            로그인 전 · Guest
          </h2>
          <NavigationHeader loginHref="#login-preview" />
        </section>
        <section aria-labelledby="signed-in-title">
          <h2 id="signed-in-title" className="mb-[12px] px-[24px] text-[16px]">
            로그인 후 · SignedIn
          </h2>
          <NavigationHeader
            auth="signedIn"
            userName={userName}
            accountOpen={accountOpen}
            onAccountClick={() => setAccountOpen((open) => !open)}
          />
        </section>
        <div className="space-y-[12px] px-[24px] text-[16px]">
          <label className="flex flex-wrap items-center gap-[12px]">
            표시 이름
            <input
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
              className="min-w-0 rounded-[5px] border border-slate-300 bg-white px-[12px] py-[8px]"
            />
          </label>
          <p className="text-slate-600">
            프로필 버튼을 누르면 열림 스타일을 확인할 수 있어요. 실제 계정 메뉴와 서버 연결은 추후
            연결합니다.
          </p>
          <p id="login-preview" className="text-slate-600">
            로그인 화면 이동은 추후 연결합니다.
          </p>
        </div>
      </div>
    </main>
  )
}
