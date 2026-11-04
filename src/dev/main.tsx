import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'

// 이 HTML은 개발 서버에서만 사용하며 기본 배포 빌드의 진입점에 포함하지 않습니다.
if (import.meta.env.DEV) {
  const preview = new URLSearchParams(window.location.search).get('preview')
  document.title =
    preview === 'team'
      ? 'SceneSpect · 03 팀 관리 컴포넌트 미리보기'
      : preview === 'intro'
        ? 'SceneSpect · 01 소개 컴포넌트 미리보기'
        : preview === 'header'
          ? 'SceneSpect · 헤더 미리보기'
          : 'SceneSpect · 00 공통 컴포넌트 미리보기'

  const { default: Preview } =
    preview === 'team'
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
