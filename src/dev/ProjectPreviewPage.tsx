import { useState } from 'react'
import previewCover from '../assets/images/project/preview-cover.jpg'
import {
  ProjectCard,
  type ProjectCardPreviewState,
  type ProjectStatus,
} from '../components/project'

const examples: { status: ProjectStatus; label: string }[] = [
  { status: 'inProgress', label: '진행 중' },
  { status: 'paused', label: '중지됨' },
  { status: 'completed', label: '완료됨' },
]

const states: { label: string; state?: ProjectCardPreviewState }[] = [
  { label: '기본' },
  { label: '카드 호버', state: 'hover' },
  { label: '작업하기 호버', state: 'actionHover' },
]

export default function ProjectPreviewPage() {
  const [message, setMessage] = useState('기본 카드에서 마우스와 키보드 동작을 확인할 수 있어요.')

  return (
    <main className="mx-auto max-w-[1512px] space-y-[32px] px-[clamp(18px,4vw,60px)] py-[40px] text-[#16181d]">
      <header className="space-y-[12px]">
        <p className="text-[14px] text-[#737b88]">04_Component / 04 프로젝트</p>
        <h1 className="text-[28px] font-semibold">프로젝트 카드 미리보기</h1>
        <nav
          aria-label="컴포넌트 미리보기 이동"
          className="flex flex-wrap gap-[24px] text-[14px] text-[#2962ff] underline underline-offset-4"
        >
          <a href="?preview=common">00 공통 보기</a>
          <a href="?preview=intro">01 소개 보기</a>
          <a href="?preview=team">03 팀 관리 보기</a>
          <a href="?preview=settings">05 개인 설정 보기</a>
        </nav>
        <p role="status" className="text-[14px] text-[#737b88]">
          {message}
        </p>
      </header>
      {examples.map(({ status, label }) => (
        <section key={status} aria-labelledby={`project-${status}`} className="space-y-[12px]">
          <h2 id={`project-${status}`} className="text-[20px] font-semibold">
            {label}
          </h2>
          <div className="flex flex-wrap gap-[24px]">
            {states.map(({ label: stateLabel, state }) => (
              <div key={stateLabel} className="max-w-full space-y-[8px]">
                <p className="text-[14px] text-[#737b88]">{stateLabel}</p>
                <ProjectCard
                  name="프로젝트 이름"
                  description="프로젝트 설명프로젝트 설명프로젝트 설명..."
                  status={status}
                  updatedLabel="1일 전 수정됨"
                  coverSrc={previewCover}
                  previewState={state}
                  onOpen={() => setMessage(`${label} 카드의 작업하기를 눌렀어요.`)}
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}
