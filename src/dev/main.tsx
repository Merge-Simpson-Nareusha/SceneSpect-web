import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'

// 이 HTML은 개발 서버에서만 사용하며 기본 배포 빌드의 진입점에 포함하지 않습니다.
if (import.meta.env.DEV) {
  const preview = new URLSearchParams(window.location.search).get('preview')
  document.title =
    preview === 'project-settings'
      ? 'SceneSpect · 07 프로젝트 설정 컴포넌트 미리보기'
      : preview === 'work'
        ? 'SceneSpect · 06 프로젝트 작업 컴포넌트 미리보기'
        : preview === 'settings'
          ? 'SceneSpect · 05 개인 설정 컴포넌트 미리보기'
          : preview === 'project'
            ? 'SceneSpect · 04 프로젝트 카드 미리보기'
            : preview === 'team'
              ? 'SceneSpect · 03 팀 관리 컴포넌트 미리보기'
              : preview === 'intro'
                ? 'SceneSpect · 01 소개 컴포넌트 미리보기'
                : preview === 'header'
                  ? 'SceneSpect · 헤더 미리보기'
                  : 'SceneSpect · 00 공통 컴포넌트 미리보기'

  const { default: Preview } =
    preview === 'project-settings'
      ? await import('./ProjectSettingsPreviewPage')
      : preview === 'work'
        ? await import('./ProjectWorkPreviewPage')
        : preview === 'settings'
          ? await import('./SettingsPreviewPage')
          : preview === 'project'
            ? await import('./ProjectPreviewPage')
            : preview === 'team'
              ? await import('./TeamPreviewPage')
              : preview === 'intro'
                ? await import('./IntroPreviewPage')
                : preview === 'header'
                  ? await import('./HeaderPreviewPage')
                  : await import('./CommonPreviewPage')

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Preview />
    </StrictMode>,
  )
}
