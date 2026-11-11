import { useState } from 'react'
import { ProjectSettingsDialog, type ProjectSettingsValue } from '../components/project-settings'

const initialValue: ProjectSettingsValue = {
  name: '프로젝트 이름',
  description: '영상 분석과 피드백을 관리하는 프로젝트입니다.',
}

export default function ProjectSettingsPreviewPage() {
  const [open, setOpen] = useState(true)
  const [value, setValue] = useState(initialValue)
  const [message, setMessage] = useState('')

  return (
    <main className="mx-auto max-w-[1220px] space-y-[24px] px-[clamp(18px,4vw,60px)] py-[40px]">
      <p className="text-[14px] text-[#838a94]">04_Component / 07 프로젝트 설정</p>
      <h1 className="text-[28px] font-semibold">프로젝트 설정 컴포넌트 미리보기</h1>
      <nav
        aria-label="컴포넌트 미리보기 이동"
        className="flex flex-wrap gap-[24px] text-[14px] text-[#2864e9] underline underline-offset-4"
      >
        <a href="?preview=common">00 공통 보기</a>
        <a href="?preview=work">06 프로젝트 작업 보기</a>
      </nav>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-[8px] bg-[#2563eb] px-[18px] py-[10px] text-[14px] font-semibold text-white"
      >
        프로젝트 설정 열기
      </button>
      <p role="status" className="text-[14px] text-[#6b7280]">
        {message}
      </p>
      <ProjectSettingsDialog
        open={open}
        onClose={() => setOpen(false)}
        value={value}
        onChange={setValue}
        onSave={(next) => {
          setMessage(`${next.name} 설정을 저장했어요.`)
          setOpen(false)
        }}
        onImageChange={(file) => setMessage(`${file.name} 대표 이미지를 선택했어요.`)}
        teamName="팀 이름"
        avatarLabel="P"
        statusLabel="진행 중"
        approvalRequests={[
          {
            id: '3',
            title: '수정본 #03',
            description: '음성·자막 수정본',
            statusLabel: '승인 대기',
          },
        ]}
      />
    </main>
  )
}
