import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import NavigationHeader from '../components/layout/NavigationHeader'
import {
  TeamCard,
  TeamCreateDialog,
  TeamListHeader,
  type TeamCreateInput,
  type TeamSort,
} from '../components/team'

type TeamPreview = {
  id: string
  name: string
  description: string
  memberCount: number
  role: string
  sortOrder: number
}

const initialTeams: TeamPreview[] = Array.from({ length: 9 }, (_, index) => ({
  id: `team-${index + 1}`,
  name: '팀 이름',
  description: '짧은 설명짧은 설명짧은 설명',
  memberCount: 7,
  role: '팀장',
  sortOrder: index,
}))

export default function TeamListPage() {
  const navigate = useNavigate()
  const [teams, setTeams] = useState(initialTeams)
  const [sort, setSort] = useState<TeamSort>('recent')
  const [createOpen, setCreateOpen] = useState(false)
  const [notice, setNotice] = useState('')

  const sortedTeams = useMemo(() => {
    const next = [...teams]
    if (sort === 'name') return next.sort((left, right) => left.name.localeCompare(right.name, 'ko'))
    return next.sort((left, right) => right.sortOrder - left.sortOrder)
  }, [sort, teams])

  const createTeamLocally = ({ name, description }: TeamCreateInput) => {
    const team: TeamPreview = {
      id: `team-${Date.now()}`,
      name,
      description,
      memberCount: 1,
      role: '팀장',
      sortOrder: teams.length,
    }
    setTeams((current) => [team, ...current])
    setSort('recent')
    setCreateOpen(false)
    setNotice('새 팀을 목록에 추가했습니다.')
  }

  return (
    <div className="min-h-svh bg-white text-[#16181d]">
      <NavigationHeader
        sticky
        auth="signedIn"
        userName="이름임"
        email=""
        profileHref="#profile"
        settingsHref="#settings"
        onLogout={() => navigate('/login')}
        homeHref="/teams"
        links={[
          { label: '내 팀', href: '/teams' },
          { label: '프로젝트 소개', href: '#projects' },
          { label: '팀 소개', href: '#team' },
        ]}
        activeHref="/teams"
      />

      <main className="mx-auto min-h-[calc(100svh-112px)] w-full max-w-[1512px] pb-12 md:pb-16">
        <section id="team-list" aria-label="내 팀 목록">
          <TeamListHeader
            sort={sort}
            onSortChange={setSort}
            onCreate={() => {
              setNotice('')
              setCreateOpen(true)
            }}
            className="max-md:flex-col max-md:gap-4 max-md:px-5 max-md:py-4"
          />

          {notice && (
            <p role="status" className="px-5 pb-4 text-sm text-[#2563eb] md:px-[70px]">
              {notice}
            </p>
          )}

          <div className="grid grid-cols-1 justify-items-center gap-x-[64px] gap-y-[40px] px-5 sm:grid-cols-2 xl:grid-cols-3 md:px-[70px] max-md:gap-y-6">
            {sortedTeams.map((team) => (
              <TeamCard
                key={team.id}
                name={team.name}
                description={team.description}
                memberCount={team.memberCount}
                role={team.role}
                onOpen={() => setNotice('팀 워크스페이스 화면은 연결되지 않았습니다.')}
                onSettings={() => setNotice(`${team.name} 팀 설정`)}
              />
            ))}
          </div>
        </section>
      </main>

      <TeamCreateDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={createTeamLocally}
      />
    </div>
  )
}
