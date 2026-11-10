import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import NavigationHeader from '../components/layout/NavigationHeader'
import {
  TeamCard,
  TeamCreateDialog,
  TeamInviteDialog,
  TeamListHeader,
  TeamSettingsDialog,
  type TeamCreateInput,
  type TeamDetails,
  type TeamMember,
  type TeamSort,
} from '../components/team'

type TeamPreview = {
  id: string
  name: string
  description: string
  youtubeUrl: string
  guidelines: string
  avatarSrc?: string
  members?: TeamMember[]
  memberCount: number
  role: string
  sortOrder: number
}

type TeamListNavigationState = {
  accountName?: string
}

type TeamInviteTarget = {
  teamId: string
  code: string
}

function makeInitialTeam(accountName: string): TeamPreview {
  const teamId = `team-${Date.now()}`
  return {
    id: teamId,
    name: `${accountName}의 팀`,
    description: '',
    youtubeUrl: '',
    guidelines: '',
    members: [{ id: `${teamId}-owner`, name: accountName, role: '팀장' }],
    memberCount: 1,
    role: '팀장',
    sortOrder: 0,
  }
}

function makeTemporaryTeamCode() {
  return `SCENE-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
}

export default function TeamListPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const accountName = (location.state as TeamListNavigationState | null)?.accountName?.trim() ?? ''
  const [teams, setTeams] = useState<TeamPreview[]>(() =>
    accountName ? [makeInitialTeam(accountName)] : [],
  )
  const [sort, setSort] = useState<TeamSort>('recent')
  const [createOpen, setCreateOpen] = useState(false)
  const [settingsTeamId, setSettingsTeamId] = useState<string | null>(null)
  const [inviteTarget, setInviteTarget] = useState<TeamInviteTarget | null>(null)
  const [settingsMessage, setSettingsMessage] = useState('')
  const [notice, setNotice] = useState('')
  const settingsTeam = teams.find((team) => team.id === settingsTeamId)
  const inviteTeam = teams.find((team) => team.id === inviteTarget?.teamId)

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
      youtubeUrl: '',
      guidelines: '',
      members: [{ id: `member-${Date.now()}`, name: accountName || '사용자', role: '팀장' }],
      memberCount: 1,
      role: '팀장',
      sortOrder: teams.length,
    }
    setTeams((current) => [team, ...current])
    setSort('recent')
    setCreateOpen(false)
    setNotice('새 팀을 목록에 추가했습니다.')
  }

  const updateTeam = (teamId: string, value: TeamDetails) => {
    setTeams((current) =>
      current.map((team) => (team.id === teamId ? { ...team, ...value } : team)),
    )
  }

  const addPendingInvite = (teamId: string, email: string) => {
    const team = teams.find((item) => item.id === teamId)
    if (!team) return false
    if (team.members?.some((member) => member.name.toLowerCase() === email)) return false

    const invitee: TeamMember = {
      id: `invite-${Date.now()}`,
      name: email,
      role: '초대 대기',
      showMenu: false,
    }
    setTeams((current) =>
      current.map((item) =>
        item.id === teamId
          ? {
              ...item,
              members: [...(item.members ?? []), invitee],
              memberCount: item.memberCount + 1,
            }
          : item,
      ),
    )
    return true
  }

  return (
    <div className="min-h-svh bg-white text-[#16181d]">
      <NavigationHeader
        sticky
        auth="signedIn"
        userName={accountName}
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

          {sortedTeams.length > 0 ? (
            <div className="grid grid-cols-1 justify-items-center gap-x-[64px] gap-y-[40px] px-5 min-[1004px]:grid-cols-2 min-[1468px]:grid-cols-3 md:px-[70px] max-md:gap-y-6">
              {sortedTeams.map((team) => (
                <TeamCard
                  key={team.id}
                  name={team.name}
                  description={team.description}
                  memberCount={team.memberCount}
                  role={team.role}
                  avatarSrc={team.avatarSrc}
                  members={team.members}
                  onOpen={() => console.info('팀 워크스페이스 화면은 연결되지 않았습니다.')}
                  onSettings={() => {
                    setNotice('')
                    setSettingsMessage('')
                    setSettingsTeamId(team.id)
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="px-5 py-16 text-center md:px-[70px]">
              <h3 className="text-[20px] font-semibold">아직 참여 중인 팀이 없습니다.</h3>
              <p className="mt-2 text-[16px] text-[#6b7280]">
                새 팀을 만들거나 초대받은 팀에 참가해 보세요.
              </p>
            </div>
          )}
        </section>
      </main>

      <TeamCreateDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={createTeamLocally}
      />

      {settingsTeam && (
        <TeamSettingsDialog
          open
          onClose={() => {
            setSettingsTeamId(null)
            setSettingsMessage('')
          }}
          value={settingsTeam}
          onChange={(value) => updateTeam(settingsTeam.id, value)}
          onSave={(value) => {
            updateTeam(settingsTeam.id, value)
            setSettingsTeamId(null)
            setSettingsMessage('')
            setNotice('팀 설정을 저장했습니다.')
          }}
          members={settingsTeam.members ?? []}
          statusMessage={settingsMessage}
          onAvatarChange={(file) => {
            updateTeam(settingsTeam.id, { ...settingsTeam, avatarSrc: URL.createObjectURL(file) })
          }}
          onInvite={() => {
            setSettingsMessage('')
            setInviteTarget({ teamId: settingsTeam.id, code: makeTemporaryTeamCode() })
          }}
          onMemberMenu={(member) =>
            console.info(`${member.name} 멤버 설정은 서버 연결 후 사용할 수 있습니다.`)
          }
          onMemberRoleChange={(member, role) => {
            setTeams((current) =>
              current.map((team) => {
                if (team.id !== settingsTeam.id) return team
                return {
                  ...team,
                  members: (team.members ?? []).map((teamMember) =>
                    teamMember.id === member.id ? { ...teamMember, role } : teamMember,
                  ),
                  role: team.members?.[0]?.id === member.id ? role : team.role,
                }
              }),
            )
          }}
          onTransferRequest={() =>
            console.info('팀장 이관은 서버 연결 후 사용할 수 있습니다.')
          }
          onDeleteRequest={() => {
            if (!window.confirm(`${settingsTeam.name} 팀을 삭제하시겠습니까?`)) return
            setTeams((current) => current.filter((team) => team.id !== settingsTeam.id))
            setSettingsTeamId(null)
            setSettingsMessage('')
            setNotice('팀을 목록에서 삭제했습니다.')
          }}
        />
      )}

      {inviteTarget && inviteTeam && (
        <TeamInviteDialog
          teamName={inviteTeam.name}
          teamCode={inviteTarget.code}
          onClose={() => setInviteTarget(null)}
          onInviteEmail={(email) => addPendingInvite(inviteTeam.id, email)}
        />
      )}
    </div>
  )
}
