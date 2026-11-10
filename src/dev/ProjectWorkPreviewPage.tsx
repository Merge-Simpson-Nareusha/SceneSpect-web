import { useState } from 'react'
import {
  AIReviewCard,
  PendingReviewCard,
  SceneRow,
  ThumbnailDropzone,
  VersionRow,
} from '../components/project-work'

export default function ProjectWorkPreviewPage() {
  const [message, setMessage] = useState('')

  return (
    <main className="mx-auto max-w-[1220px] space-y-[48px] px-[clamp(18px,4vw,60px)] py-[40px]">
      <header className="space-y-[12px]">
        <p className="text-[14px] text-[#838a94]">04_Component / 06 프로젝트 작업</p>
        <h1 className="text-[28px] font-semibold">프로젝트 작업 컴포넌트 미리보기</h1>
        <nav
          aria-label="컴포넌트 미리보기 이동"
          className="flex flex-wrap gap-[24px] text-[14px] text-[#2864e9] underline underline-offset-4"
        >
          <a href="?preview=common">00 공통 보기</a>
          <a href="?preview=project">04 프로젝트 보기</a>
          <a href="?preview=settings">05 개인 설정 보기</a>
        </nav>
        <p role="status" className="min-h-[20px] text-[14px] text-[#838a94]">
          {message}
        </p>
      </header>
      <div className="flex flex-wrap items-start gap-[48px]">
        <section className="flex flex-col gap-[32px]" aria-label="구간과 버전, 썸네일">
          <SceneRow
            timecode="01:32"
            duration="13초"
            title="강한 표현"
            description="발화 수위와 맥락을 확인해 주세요."
            onSelect={() => setMessage('01:32 검토 구간을 선택했어요.')}
          />
          <VersionRow
            title="Version 02"
            detail="최신 수정본 · 10.19"
            isCurrent
            onSelect={() => setMessage('Version 02를 선택했어요.')}
          />
          <ThumbnailDropzone
            onFileSelect={(file) => setMessage(`${file.name} 파일을 선택했어요.`)}
          />
        </section>
        <section className="flex flex-col gap-[48px]" aria-label="검토 의견과 승인 대기">
          <AIReviewCard
            timecode="01:32"
            message="평소 채널 영상보다 강한 표현이 감지되었습니다."
            onViewEvidence={() => setMessage('AI 검토 근거 보기를 눌렀어요.')}
          />
          <PendingReviewCard
            title="변경 제안 #03"
            description="음성·자막 수정본이 검토를 기다리고 있습니다."
            onViewProposal={() => setMessage('변경 제안 보기를 눌렀어요.')}
          />
        </section>
      </div>
    </main>
  )
}
