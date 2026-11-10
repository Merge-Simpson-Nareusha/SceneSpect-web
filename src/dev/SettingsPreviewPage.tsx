import { useState } from 'react'
import {
  SettingsItem,
  SettingsSectionHeading,
  SettingsStatusBadge,
  SettingsThemeOption,
  type SettingsTheme,
} from '../components/settings'

const themes: SettingsTheme[] = ['light', 'dark', 'system']

export default function SettingsPreviewPage() {
  const [theme, setTheme] = useState<SettingsTheme>('light')
  const [message, setMessage] = useState('')

  return (
    <main className="mx-auto max-w-[1512px] space-y-[48px] px-[clamp(18px,4vw,60px)] py-[40px]">
      <header className="space-y-[12px]">
        <p className="text-[14px] text-[#838a94]">04_Component / 05 개인 설정</p>
        <h1 className="text-[28px] font-semibold">개인 설정 컴포넌트 미리보기</h1>
        <nav
          aria-label="컴포넌트 미리보기 이동"
          className="flex flex-wrap gap-[24px] text-[14px] text-[#2864e9] underline underline-offset-4"
        >
          <a href="?preview=common">00 공통 보기</a>
          <a href="?preview=intro">01 소개 보기</a>
          <a href="?preview=team">03 팀 관리 보기</a>
          <a href="?preview=project">04 프로젝트 보기</a>
          <a href="?preview=work">06 프로젝트 작업 보기</a>
        </nav>
        <p role="status" className="min-h-[20px] text-[14px] text-[#838a94]">
          {message}
        </p>
      </header>

      <section className="space-y-[24px]" aria-label="설정 항목 미리보기">
        <SettingsSectionHeading title="섹션 제목" description="섹션에 대한 설명" />
        <SettingsItem
          title="설정 항목"
          description="설정에 대한 간략한 안내"
          actionLabel="변경"
          onAction={() => setMessage('변경 버튼을 눌렀어요.')}
        />
        <SettingsStatusBadge>검토 중</SettingsStatusBadge>
      </section>

      <section className="space-y-[20px]" aria-labelledby="theme-options-title">
        <h2 id="theme-options-title" className="text-[19px] font-semibold">
          화면 테마
        </h2>
        <div
          role="radiogroup"
          aria-labelledby="theme-options-title"
          className="flex flex-wrap gap-[22px]"
        >
          {themes.map((option) => (
            <SettingsThemeOption
              key={option}
              theme={option}
              selected={theme === option}
              name="settings-preview-theme"
              onSelect={setTheme}
            />
          ))}
        </div>
      </section>
    </main>
  )
}
