import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'

// 이 HTML은 개발 서버에서만 사용하며 기본 배포 빌드의 진입점에 포함하지 않습니다.
if (import.meta.env.DEV) {
  const { default: Preview } =
    new URLSearchParams(window.location.search).get('preview') === 'header'
      ? await import('./HeaderPreviewPage')
      : await import('./CommonPreviewPage')

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Preview />
    </StrictMode>,
  )
}
