import { useEffect, useRef, useState } from 'react'
import {
  TeamCard,
  TeamCreateButton,
  TeamListHeader,
  TeamMemberRow,
  TeamSettingsDialog,
  TeamSortMenu,
  type TeamDetails,
  type TeamMember,
  type TeamSort,
} from '../components/team'
import { commonStyles } from '../components/common/styles'

// 아래 데이터와 동작 안내는 개발용 미리보기에서만 사용합니다.
const examples = [
  {
    id: 'design',
    name: '팀 이름',
    description: '짧은 설명짧은 설명짧은 설명',
    memberCount: 7,
    role: '팀장',
    created: 1,
    recent: 3,
  },
  {
    id: 'long',
    name: '긴 이름을 가진 팀 컴포넌트 확인',
    description: '여러 줄의 설명과 긴 팀 이름도 카드 바깥으로 넘치지 않는지 확인합니다.',
    memberCount: 6,
    role: '팀원',
    created: 2,
    recent: 1,
  },
  {
    id: 'short',
    name: 'SceneSpect',
    description: '팀 카드와 정렬 동작 확인용',
    memberCount: 4,
    role: '팀장',
    created: 3,
    recent: 2,
  },
]
const members: TeamMember[] = [
  { id: '1', name: '김재윤', role: '팀장', showMenu: false },
  { id: '2', name: '김재윤', role: '팀원' },
  { id: '3', name: '김재윤', role: '팀원' },
  { id: '4', name: '김재윤', role: '팀원' },
]
const initialDetails: TeamDetails = {
  name: 'SceneSpect',
  description: '',
  youtubeUrl: '',
  guidelines: '',
}

export default function TeamPreviewPage() {
  const [sort, setSort] = useState<TeamSort>('recent')
  const [menuValues, setMenuValues] = useState<TeamSort[]>(['recent', 'name', 'created'])
  const [open, setOpen] = useState(false)
  const [initialView, setInitialView] = useState<'info' | 'members'>('info')
  const [saved, setSaved] = useState(initialDetails)
  const [draft, setDraft] = useState(initialDetails)
  const avatarUrls = useRef(new Set<string>())
  const [status, setStatus] = useState('')
  const [testSaveFailure, setTestSaveFailure] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const saveTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    const urls = avatarUrls.current
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
      window.clearTimeout(saveTimer.current)
    }
  }, [])

  const showSettings = (view: 'info' | 'members' = 'info') => {
    setDraft(saved)
    setSaveError('')
    setInitialView(view)
    setOpen(true)
  }
  const sortedExamples = [...examples].sort((a, b) =>
    sort === 'name' ? a.name.localeCompare(b.name, 'ko') : b[sort] - a[sort],
  )
  const actionClass = `rounded-[8px] border border-[#e3e6eb] bg-white px-[18px] py-[12px] text-[16px] text-[#16181d] hover:bg-[#f6f7f9] ${commonStyles.focus}`

  return (
    <main className="mx-auto w-full max-w-[1512px] space-y-[40px] py-[40px] text-[#16181d]">
      <header className="space-y-[12px] px-[70px]">
        <p className="text-[14px] text-[#737b88]">04_Component / 03 팀 관리</p>
        <h1 className="text-[28px] font-semibold">팀 관리 컴포넌트 미리보기</h1>
        <p className="text-[16px]">
          피그마 원본 크기의 컴포넌트입니다. 예시 데이터와 동작 안내는 개발용이며 서버 요청은 보내지
          않습니다.
        </p>
        <nav
          aria-label="컴포넌트 미리보기 이동"
          className="flex gap-[24px] text-[14px] text-[#2962ff] underline underline-offset-4"
        >
          <a href="?preview=common">00 공통 보기</a>
          <a href="?preview=intro">01 소개 보기</a>
          <a href="?preview=project">04 프로젝트 보기</a>
        </nav>
      </header>
      <section aria-label="팀 목록 헤더와 카드">
        <TeamListHeader
          sort={sort}
          onSortChange={(next) => {
            setSort(next)
            setStatus(
              `정렬 기준 변경: ${next === 'recent' ? '최근 활동순' : next === 'name' ? '이름순' : '생성순'}`,
            )
          }}
          onCreate={() =>
            setStatus('새 팀 버튼 클릭. 실제 팀 생성 화면은 사용하는 페이지에서 연결합니다.')
          }
        />
        <div className="flex flex-wrap gap-[24px] px-[70px]">
          {sortedExamples.map((team) => (
            <TeamCard
              key={team.id}
              name={team.name}
              description={team.description}
              memberCount={team.memberCount}
              role={team.role}
              members={team.id === 'design' ? undefined : members}
              onOpen={() =>
                setStatus(`${team.name} 팀 열기 클릭. 실제 경로는 사용하는 페이지에서 연결합니다.`)
              }
              onSettings={() => showSettings()}
            />
          ))}
        </div>
      </section>
      <section aria-labelledby="sort-heading" className="space-y-[20px] px-[70px]">
        <h2 id="sort-heading" className="text-[22px] font-semibold">
          정렬 메뉴 선택 상태
        </h2>
        <div className="flex flex-wrap items-start gap-[24px]">
          {menuValues.map((value, index) => (
            <TeamSortMenu
              key={index}
              value={value}
              tabIndex={0}
              onChange={(next) =>
                setMenuValues((current) =>
                  current.map((item, position) => (position === index ? next : item)),
                )
              }
            />
          ))}
        </div>
      </section>
      <section aria-labelledby="settings-heading" className="space-y-[20px] px-[70px]">
        <h2 id="settings-heading" className="text-[22px] font-semibold">
          팀 설정
        </h2>
        <div className="flex flex-wrap items-center gap-[16px]">
          <button type="button" onClick={() => showSettings('info')} className={actionClass}>
            기본 정보 열기
          </button>
          <button type="button" onClick={() => showSettings('members')} className={actionClass}>
            멤버 관리 열기
          </button>
          <TeamCreateButton disabled>새 팀</TeamCreateButton>
        </div>
        <label className="flex w-max items-center gap-[10px] text-[14px]">
          <input
            type="checkbox"
            checked={testSaveFailure}
            onChange={(event) => setTestSaveFailure(event.currentTarget.checked)}
          />
          저장 중, 저장 실패 상태 확인(개발용)
        </label>
        <p className="text-[14px] text-[#737b88]">
          저장은 이 미리보기의 메모리에서만 확인할 수 있습니다. 취소하면 입력 내용은 반영하지
          않습니다.
        </p>
      </section>
      <section aria-labelledby="member-heading" className="space-y-[20px] px-[70px]">
        <h2 id="member-heading" className="text-[22px] font-semibold">
          멤버 행
        </h2>
        <div className="max-w-[942px] space-y-[24px] rounded-[12px] border border-[#e5e7eb] p-[24px]">
          <TeamMemberRow
            member={members[0]}
            onMenuClick={(member) => setStatus(`${member.name} 멤버 메뉴 클릭`)}
          />
          <TeamMemberRow
            member={{ id: 'long-name', name: '이름이 긴 팀원도 줄바꿈해서 확인', role: '팀원' }}
            onMenuClick={(member) => setStatus(`${member.name} 멤버 메뉴 클릭`)}
          />
        </div>
      </section>
      <p role="status" className="min-h-[24px] px-[70px] text-[16px] text-[#2563eb]">
        {status}
      </p>
      <TeamSettingsDialog
        open={open}
        initialView={initialView}
        onClose={() => setOpen(false)}
        value={draft}
        onChange={(next) => {
          setDraft(next)
          setSaveError('')
        }}
        members={members}
        saving={saving}
        saveError={saveError}
        onSave={(next) => {
          if (testSaveFailure) {
            setSaving(true)
            setSaveError('')
            saveTimer.current = window.setTimeout(() => {
              setSaving(false)
              setSaveError('미리보기 저장 실패 예시입니다. 입력 내용은 유지됩니다.')
            }, 5000)
            return
          }
          setSaved(next)
          setOpen(false)
          setStatus('변경사항을 미리보기 메모리에 반영했습니다. 서버에는 저장하지 않습니다.')
        }}
        onAvatarChange={(file) => {
          if (!file.type.startsWith('image/')) {
            setStatus('이미지 파일을 선택해 주세요.')
            return
          }
          const url = URL.createObjectURL(file)
          avatarUrls.current.add(url)
          setDraft((current) => ({ ...current, avatarSrc: url }))
        }}
        onInvite={() => {
          setOpen(false)
          setStatus('팀원 초대 버튼 클릭. 실제 초대 처리는 사용하는 페이지에서 연결합니다.')
        }}
        onMemberMenu={(member) => {
          setOpen(false)
          setStatus(`${member.name} 멤버 메뉴 클릭`)
        }}
        onTransferRequest={() => {
          setOpen(false)
          setStatus('팀장 이관 버튼 클릭. 이관 조건과 실행은 사용하는 페이지에서 연결합니다.')
        }}
        onDeleteRequest={() => {
          setOpen(false)
          setStatus('팀 삭제 버튼 클릭. 실제 삭제는 실행하지 않았습니다.')
        }}
      />
    </main>
  )
}
