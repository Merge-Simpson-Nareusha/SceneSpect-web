import { useEffect, useMemo, useState } from 'react'
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
  type TeamJoinRequest,
  type TeamMember,
  type TeamSort,
} from '../components/team'
import { ApiError, getApiErrorKind, getApiErrorMessage } from '../services/api'
import { ErrorState, InlineFeedback } from '../components/feedback'
import { errorContent } from '../components/feedback/content'
import { getCachedUser, getCurrentUser, logout, type AuthUser } from '../services/auth'
import {
  addTeamMemberWarning,
  createTeam as createTeamRequest,
  deleteTeam as deleteTeamRequest,
  getTeam as getTeamRequest,
  getTeamJoinRequests,
  getTeamMembers,
  getTeams,
  joinTeam as joinTeamRequest,
  removeTeamMember,
  reviewTeamJoinRequest,
  saveTeamOrder,
  updateTeam as updateTeamRequest,
  updateTeamMemberRole,
  uploadTeamAvatar,
  type ApiTeam,
  type ApiTeamJoinRequest,
  type ApiTeamMember,
} from '../services/teams'

type TeamPreview = TeamDetails & {
  id: string
  members?: TeamMember[]
  joinRequests?: TeamJoinRequest[]
  memberCount: number
  role: string
  sortOrder: number
  createdAt: string
  updatedAt: string
  joinCode?: string
}

type TeamListNavigationState = { accountName?: string; email?: string; user?: AuthUser }
type TeamInviteTarget = { teamId: string; code: string }

function getStoredJoinCode(teamId: string) {
  return sessionStorage.getItem(`scenespect.team.${teamId}.joinCode`) ?? undefined
}

function mapTeamRole(role: ApiTeam['role']) {
  if (role === 'LEADER') return '팀장'
  if (role === 'DEPUTY') return '부팀장'
  return '팀원'
}

function mapMemberRole(member: Pick<ApiTeamMember, 'role' | 'canCreateProjects'>) {
  if (member.role === 'LEADER') return '팀장'
  if (member.role === 'DEPUTY') return '부팀장'
  return member.canCreateProjects ? '수정허용' : '보기허용'
}

function mapApiMember(member: ApiTeamMember): TeamMember {
  return {
    id: member.userId,
    name: member.nickname,
    role: mapMemberRole(member),
    apiRole: member.role,
    canCreateProjects: member.canCreateProjects,
    warningCount: member.warningCount,
    avatarSrc: member.avatarUrl,
  }
}

function mapApiJoinRequest(request: ApiTeamJoinRequest): TeamJoinRequest {
  return {
    id: request.id,
    userId: request.userId,
    nickname: request.nickname,
    createdAt: request.createdAt,
  }
}

function mapPendingJoinRequests(requests: ApiTeamJoinRequest[]): TeamJoinRequest[] {
  return requests
    .filter((request) => request.status.toUpperCase() === 'PENDING')
    .map(mapApiJoinRequest)
}

function mapApiTeam(team: ApiTeam, index: number, previous?: TeamPreview): TeamPreview {
  return {
    id: team.id,
    name: team.name,
    description: team.description ?? '',
    youtubeUrl: team.youtubeUrl ?? '',
    guidelines: team.guideline ?? '',
    avatarSrc: team.avatarUrl,
    members: previous?.members,
    joinRequests: previous?.joinRequests,
    memberCount: team.memberCount,
    role: mapTeamRole(team.role),
    sortOrder: index,
    createdAt: team.createdAt,
    updatedAt: team.updatedAt,
    joinCode: team.joinCode ?? previous?.joinCode ?? getStoredJoinCode(team.id),
  }
}

function getTeamDetails(team: TeamPreview): TeamDetails {
  return {
    name: team.name,
    description: team.description,
    youtubeUrl: team.youtubeUrl,
    guidelines: team.guidelines,
    avatarSrc: team.avatarSrc,
  }
}

function sortTeamList(teams: TeamPreview[], sort: TeamSort) {
  const next = [...teams]
  if (sort === 'name') return next.sort((left, right) => left.name.localeCompare(right.name, 'ko'))
  if (sort === 'created') {
    return next.sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
  }
  return next.sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt))
}

export default function TeamListPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const navigationState = location.state as TeamListNavigationState | null
  const navigationAccountName = navigationState?.accountName?.trim() ?? ''
  const [user, setUser] = useState<AuthUser | null>(() => navigationState?.user ?? getCachedUser())
  const [teams, setTeams] = useState<TeamPreview[]>([])
  const [sort, setSort] = useState<TeamSort>('recent')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<{
    kind: ReturnType<typeof getApiErrorKind>
    message: string
  } | null>(null)
  const [reloadCount, setReloadCount] = useState(0)
  const [createOpen, setCreateOpen] = useState(false)
  const [settingsTeamId, setSettingsTeamId] = useState<string | null>(null)
  const [settingsVersion, setSettingsVersion] = useState(0)
  const [settingsLoading, setSettingsLoading] = useState(false)
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [settingsError, setSettingsError] = useState('')
  const [settingsMessage, setSettingsMessage] = useState('')
  const [inviteTarget, setInviteTarget] = useState<TeamInviteTarget | null>(null)
  const [pendingJoinTeamIds, setPendingJoinTeamIds] = useState<string[]>([])
  const [notice, setNotice] = useState<{ message: string; tone: 'success' | 'error' } | null>(null)

  const accountName = user?.nickname || navigationAccountName
  const accountEmail = user?.email || navigationState?.email || ''
  const settingsTeam = teams.find((team) => team.id === settingsTeamId)
  const inviteTeam = teams.find((team) => team.id === inviteTarget?.teamId)

  useEffect(() => {
    let active = true

    const load = async () => {
      setLoading(true)
      setLoadError(null)
      try {
        const response = await getTeams()
        if (!active) return
        setTeams(response.teams.map((team, index) => mapApiTeam(team, index)))
        setLoading(false)

        try {
          const currentUser = await getCurrentUser()
          if (active) setUser(currentUser)
        } catch (error) {
          if (!active) return
          if (error instanceof ApiError && error.status === 401) {
            navigate('/session-expired', { replace: true })
          }
        }
      } catch (error) {
        if (!active) return
        if (error instanceof ApiError && error.status === 401) {
          navigate('/session-expired', { replace: true })
          return
        }
        setLoadError({
          kind: getApiErrorKind(error),
          message: getApiErrorMessage(error, '팀 목록을 불러오지 못했습니다. 다시 시도해 주세요.'),
        })
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()
    return () => {
      active = false
    }
  }, [navigate, reloadCount])

  useEffect(() => {
    if (!settingsTeamId) return

    let active = true
    let fetching = false
    const refreshJoinRequests = async () => {
      if (fetching || document.visibilityState !== 'visible') return
      fetching = true
      try {
        const response = await getTeamJoinRequests(settingsTeamId)
        if (!active) return
        const joinRequests = mapPendingJoinRequests(response.requests)
        setTeams((current) =>
          current.map((team) => (team.id === settingsTeamId ? { ...team, joinRequests } : team)),
        )
      } catch (error) {
        if (!active) return
        if (error instanceof ApiError && error.status === 401) {
          navigate('/session-expired', { replace: true })
          return
        }
        console.error('[API] 팀 가입 신청 목록을 새로고침하지 못했습니다.', error)
      } finally {
        fetching = false
      }
    }

    const intervalId = window.setInterval(() => {
      void refreshJoinRequests()
    }, 3000)
    window.addEventListener('focus', refreshJoinRequests)
    document.addEventListener('visibilitychange', refreshJoinRequests)

    return () => {
      active = false
      window.clearInterval(intervalId)
      window.removeEventListener('focus', refreshJoinRequests)
      document.removeEventListener('visibilitychange', refreshJoinRequests)
    }
  }, [navigate, settingsTeamId])

  useEffect(() => {
    if (pendingJoinTeamIds.length === 0) return

    let active = true
    let fetching = false
    const refreshTeamsAfterApproval = async () => {
      if (fetching || document.visibilityState !== 'visible') return
      fetching = true
      try {
        const response = await getTeams()
        if (!active) return

        const visibleTeamIds = new Set(response.teams.map((team) => team.id))
        const approvedTeamIds = pendingJoinTeamIds.filter((teamId) => visibleTeamIds.has(teamId))
        setTeams((current) =>
          response.teams.map((team, index) =>
            mapApiTeam(
              team,
              index,
              current.find((currentTeam) => currentTeam.id === team.id),
            ),
          ),
        )

        if (approvedTeamIds.length > 0) {
          setPendingJoinTeamIds((current) =>
            current.filter((teamId) => !approvedTeamIds.includes(teamId)),
          )
          setNotice({
            message: '팀 참가 신청이 승인되어 팀 목록에 추가되었습니다.',
            tone: 'success',
          })
        }
      } catch (error) {
        if (!active) return
        if (error instanceof ApiError && error.status === 401) {
          navigate('/session-expired', { replace: true })
          return
        }
        console.error('[API] 팀 참가 승인 상태를 확인하지 못했습니다.', error)
      } finally {
        fetching = false
      }
    }

    const intervalId = window.setInterval(() => {
      void refreshTeamsAfterApproval()
    }, 3000)
    window.addEventListener('focus', refreshTeamsAfterApproval)
    document.addEventListener('visibilitychange', refreshTeamsAfterApproval)

    return () => {
      active = false
      window.clearInterval(intervalId)
      window.removeEventListener('focus', refreshTeamsAfterApproval)
      document.removeEventListener('visibilitychange', refreshTeamsAfterApproval)
    }
  }, [navigate, pendingJoinTeamIds])

  const sortedTeams = useMemo(() => {
    return sortTeamList(teams, sort)
  }, [sort, teams])

  const handleSortChange = async (nextSort: TeamSort) => {
    setSort(nextSort)
    const orderedTeams = sortTeamList(teams, nextSort)
    setTeams(orderedTeams.map((team, index) => ({ ...team, sortOrder: index })))
    try {
      await saveTeamOrder(orderedTeams.map((team) => team.id))
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        navigate('/session-expired', { replace: true })
        return
      }
      setNotice({
        message: getApiErrorMessage(error, '정렬 순서를 저장하지 못했습니다.'),
        tone: 'error',
      })
    }
  }

  const openTeamSettings = async (team: TeamPreview) => {
    setSettingsTeamId(team.id)
    setSettingsLoading(true)
    setSettingsError('')
    setSettingsMessage('')
    try {
      const [detailResponse, membersResponse, joinRequestsResponse] = await Promise.all([
        getTeamRequest(team.id),
        getTeamMembers(team.id),
        getTeamJoinRequests(team.id),
      ])
      setTeams((current) =>
        current.map((currentTeam, index) =>
          currentTeam.id === team.id
            ? {
                ...mapApiTeam(detailResponse.team, index, currentTeam),
                members: membersResponse.members.map(mapApiMember),
                joinRequests: mapPendingJoinRequests(joinRequestsResponse.requests),
              }
            : currentTeam,
        ),
      )
      setSettingsVersion((version) => version + 1)
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        navigate('/session-expired', { replace: true })
        return
      }
      setSettingsError(getApiErrorMessage(error, '팀 설정 정보를 불러오지 못했습니다.'))
    } finally {
      setSettingsLoading(false)
    }
  }

  const handleCreateTeam = async ({ name, description }: TeamCreateInput) => {
    try {
      const response = await createTeamRequest({ name, description })
      const createdTeam = mapApiTeam(response.team, 0)
      if (response.team.joinCode) {
        createdTeam.joinCode = response.team.joinCode
        sessionStorage.setItem(
          `scenespect.team.${response.team.id}.joinCode`,
          response.team.joinCode,
        )
      }
      setTeams((current) => [
        createdTeam,
        ...current.map((team, index) => ({ ...team, sortOrder: index + 1 })),
      ])
      setSort('recent')
      setNotice({ message: '팀을 만들었습니다.', tone: 'success' })
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        navigate('/session-expired', { replace: true })
      }
      throw error
    }
  }

  const handleJoinTeam = async (joinCode: string) => {
    const nickname = user?.nickname || accountName
    if (!nickname) throw new Error('사용자 이름을 불러오지 못했습니다. 다시 로그인해 주세요.')
    try {
      const response = await joinTeamRequest(joinCode, nickname)
      setPendingJoinTeamIds((current) =>
        current.includes(response.request.teamId) ? current : [...current, response.request.teamId],
      )
      setNotice({
        message: '팀 참가 요청을 보냈습니다. 팀장의 승인을 기다려 주세요.',
        tone: 'success',
      })
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        navigate('/session-expired', { replace: true })
      }
      throw error
    }
  }

  const updateTeamDraft = (teamId: string, value: TeamDetails) => {
    setTeams((current) =>
      current.map((team) => (team.id === teamId ? { ...team, ...value } : team)),
    )
  }

  const handleSaveTeam = async (team: TeamPreview, value: TeamDetails) => {
    setSettingsSaving(true)
    setSettingsError('')
    setSettingsMessage('')
    try {
      const response = await updateTeamRequest(team.id, {
        name: value.name.trim(),
        description: value.description.trim(),
        guideline: value.guidelines,
        ...(value.youtubeUrl.trim() ? { youtubeUrl: value.youtubeUrl.trim() } : {}),
        ...(value.avatarSrc ? { avatarUrl: value.avatarSrc } : {}),
      })
      setTeams((current) =>
        current.map((currentTeam, index) =>
          currentTeam.id === team.id ? mapApiTeam(response.team, index, currentTeam) : currentTeam,
        ),
      )
      setSettingsTeamId(null)
      setNotice({ message: '팀 설정을 저장했습니다.', tone: 'success' })
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        navigate('/session-expired', { replace: true })
        return
      }
      setSettingsError(
        getApiErrorMessage(error, '변경사항을 저장하지 못했습니다. 다시 시도해 주세요.'),
      )
    } finally {
      setSettingsSaving(false)
    }
  }

  const handleAvatarChange = async (team: TeamPreview, file: File) => {
    setSettingsSaving(true)
    setSettingsError('')
    try {
      const response = await uploadTeamAvatar(file)
      updateTeamDraft(team.id, { ...getTeamDetails(team), avatarSrc: response.url })
      setSettingsMessage('팀 프로필 이미지를 불러왔습니다. 변경사항 저장을 눌러 적용해 주세요.')
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        navigate('/session-expired', { replace: true })
        return
      }
      setSettingsError(getApiErrorMessage(error, '팀 프로필 이미지를 변경하지 못했습니다.'))
    } finally {
      setSettingsSaving(false)
    }
  }

  const handleMemberRoleChange = async (team: TeamPreview, member: TeamMember, role: string) => {
    const apiRole = role === '부팀장' ? 'DEPUTY' : 'MEMBER'
    const canCreateProjects = role === '수정허용' ? true : role === '보기허용' ? false : undefined
    setSettingsSaving(true)
    setSettingsError('')
    setSettingsMessage('')
    try {
      await updateTeamMemberRole(team.id, member.id, apiRole, canCreateProjects)
      setTeams((current) =>
        current.map((currentTeam) =>
          currentTeam.id !== team.id
            ? currentTeam
            : {
                ...currentTeam,
                members: currentTeam.members?.map((currentMember) =>
                  currentMember.id === member.id
                    ? {
                        ...currentMember,
                        role,
                        apiRole,
                        canCreateProjects: canCreateProjects ?? currentMember.canCreateProjects,
                      }
                    : currentMember,
                ),
              },
        ),
      )
      setSettingsMessage('멤버 권한을 변경했습니다.')
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        navigate('/session-expired', { replace: true })
        return
      }
      try {
        const refreshed = await getTeamMembers(team.id)
        setTeams((current) =>
          current.map((currentTeam) =>
            currentTeam.id === team.id
              ? { ...currentTeam, members: refreshed.members.map(mapApiMember) }
              : currentTeam,
          ),
        )
      } catch {
        // The role update may have partially succeeded; keep the form error visible if refresh fails.
      }
      setSettingsError(getApiErrorMessage(error, '멤버 권한을 변경하지 못했습니다.'))
    } finally {
      setSettingsSaving(false)
    }
  }

  const handleMemberWarning = async (team: TeamPreview, member: TeamMember) => {
    if (!window.confirm(`${member.name}님에게 경고를 추가하시겠습니까?`)) return
    setSettingsSaving(true)
    setSettingsError('')
    setSettingsMessage('')
    try {
      const response = await addTeamMemberWarning(team.id, member.id)
      setTeams((current) =>
        current.map((currentTeam) =>
          currentTeam.id !== team.id
            ? currentTeam
            : {
                ...currentTeam,
                members: currentTeam.members?.map((currentMember) =>
                  currentMember.id === member.id
                    ? { ...currentMember, warningCount: response.warningCount }
                    : currentMember,
                ),
              },
        ),
      )
      setSettingsMessage(`${member.name}님에게 경고를 추가했습니다.`)
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        navigate('/session-expired', { replace: true })
        return
      }
      setSettingsError(getApiErrorMessage(error, '멤버 경고를 등록하지 못했습니다.'))
    } finally {
      setSettingsSaving(false)
    }
  }

  const handleRemoveMember = async (team: TeamPreview, member: TeamMember) => {
    if (!window.confirm(`${member.name}님을 ${team.name} 팀에서 내보내시겠습니까?`)) return
    setSettingsSaving(true)
    setSettingsError('')
    setSettingsMessage('')
    try {
      await removeTeamMember(team.id, member.id)
      setTeams((current) =>
        current.map((currentTeam) =>
          currentTeam.id !== team.id
            ? currentTeam
            : {
                ...currentTeam,
                members: currentTeam.members?.filter(
                  (currentMember) => currentMember.id !== member.id,
                ),
                memberCount: Math.max(0, currentTeam.memberCount - 1),
              },
        ),
      )
      setSettingsMessage(`${member.name}님을 팀에서 내보냈습니다.`)
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        navigate('/session-expired', { replace: true })
        return
      }
      setSettingsError(getApiErrorMessage(error, '팀원을 내보내지 못했습니다.'))
    } finally {
      setSettingsSaving(false)
    }
  }

  const handleReviewJoinRequest = async (team: TeamPreview, requestId: string, accept: boolean) => {
    setSettingsSaving(true)
    setSettingsError('')
    setSettingsMessage('')
    try {
      await reviewTeamJoinRequest(team.id, requestId, accept)
      const [teamResponse, membersResponse, requestsResponse] = await Promise.all([
        getTeamRequest(team.id),
        getTeamMembers(team.id),
        getTeamJoinRequests(team.id),
      ])
      setTeams((current) =>
        current.map((currentTeam, index) =>
          currentTeam.id !== team.id
            ? currentTeam
            : {
                ...mapApiTeam(teamResponse.team, index, currentTeam),
                members: membersResponse.members.map(mapApiMember),
                joinRequests: mapPendingJoinRequests(requestsResponse.requests),
              },
        ),
      )
      setSettingsMessage(accept ? '가입 신청을 승인했습니다.' : '가입 신청을 거절했습니다.')
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        navigate('/session-expired', { replace: true })
        return
      }
      setSettingsError(getApiErrorMessage(error, '가입 신청을 처리하지 못했습니다.'))
    } finally {
      setSettingsSaving(false)
    }
  }

  const handleDeleteTeam = async (team: TeamPreview) => {
    if (!window.confirm(`${team.name} 팀을 삭제하시겠습니까?`)) return
    setSettingsSaving(true)
    setSettingsError('')
    try {
      await deleteTeamRequest(team.id)
      setTeams((current) => current.filter((currentTeam) => currentTeam.id !== team.id))
      sessionStorage.removeItem(`scenespect.team.${team.id}.joinCode`)
      setSettingsTeamId(null)
      setNotice({ message: '팀을 삭제했습니다.', tone: 'success' })
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        navigate('/session-expired', { replace: true })
        return
      }
      setSettingsError(getApiErrorMessage(error, '팀을 삭제하지 못했습니다.'))
    } finally {
      setSettingsSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      // API 요청 실패도 로그아웃은 로컬에서 완료합니다.
    }
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-svh bg-white text-[#16181d]">
      <NavigationHeader
        sticky
        auth="signedIn"
        userName={accountName}
        email={accountEmail}
        profileHref="#profile"
        settingsHref="#settings"
        onLogout={handleLogout}
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
            onSortChange={handleSortChange}
            onCreate={() => {
              setNotice(null)
              setCreateOpen(true)
            }}
            className="max-md:flex-col max-md:gap-4 max-md:px-5 max-md:py-4"
          />

          {notice && (
            <div className="px-5 pb-4 md:px-[70px]">
              <InlineFeedback message={notice.message} tone={notice.tone} />
            </div>
          )}

          {loading ? (
            <div
              role="status"
              className="px-5 py-16 text-center text-[16px] text-[#6b7280] md:px-[70px]"
            >
              팀 목록을 불러오는 중입니다.
            </div>
          ) : loadError ? (
            <ErrorState
              {...(loadError.kind === 'request'
                ? { title: '팀 목록을 불러오지 못했어요', description: loadError.message }
                : errorContent[loadError.kind])}
              actions={[
                {
                  label: '다시 시도',
                  onClick: () => {
                    setLoading(true)
                    setReloadCount((count) => count + 1)
                  },
                },
                { label: '로그인하기', href: '/login' },
              ]}
            />
          ) : sortedTeams.length > 0 ? (
            <div className="grid grid-cols-1 justify-items-center gap-x-[64px] gap-y-[40px] px-5 max-md:gap-y-6 min-[1004px]:grid-cols-2 min-[1468px]:grid-cols-3 md:px-[70px]">
              {sortedTeams.map((team) => (
                <TeamCard
                  key={team.id}
                  name={team.name}
                  description={team.description}
                  memberCount={team.memberCount}
                  role={team.role}
                  avatarSrc={team.avatarSrc}
                  members={team.members}
                  onOpen={() => console.info('팀 프로젝트 화면은 아직 연결되지 않았습니다.')}
                  onSettings={() => {
                    setNotice(null)
                    void openTeamSettings(team)
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
        onCreate={handleCreateTeam}
        onJoin={handleJoinTeam}
      />

      {settingsTeam && (
        <TeamSettingsDialog
          key={`${settingsTeam.id}-${settingsVersion}`}
          open
          onClose={() => {
            setSettingsTeamId(null)
            setSettingsError('')
            setSettingsMessage('')
          }}
          value={getTeamDetails(settingsTeam)}
          onChange={(value) => updateTeamDraft(settingsTeam.id, value)}
          onSave={(value) => handleSaveTeam(settingsTeam, value)}
          members={settingsTeam.members ?? []}
          joinRequests={settingsTeam.joinRequests ?? []}
          statusMessage={settingsLoading ? '팀 정보를 불러오는 중입니다.' : settingsMessage}
          saving={settingsLoading || settingsSaving}
          saveError={settingsError}
          onAvatarChange={(file) => handleAvatarChange(settingsTeam, file)}
          onInvite={() => {
            if (!settingsTeam.joinCode) {
              console.warn('[API] 조회한 팀 응답에 joinCode가 없어 팀 코드 초대를 열 수 없습니다.')
              setSettingsMessage('')
              setSettingsError(
                '초대 코드를 불러오지 못했습니다. 팀 정보를 다시 불러온 뒤 시도해 주세요.',
              )
              return
            }
            setSettingsMessage('')
            setInviteTarget({ teamId: settingsTeam.id, code: settingsTeam.joinCode })
          }}
          onMemberMenu={(member) =>
            console.info(`[API] ${member.name} 멤버 작업 메뉴는 서버 연동을 확인해 주세요.`)
          }
          onMemberRoleChange={(member, role) => handleMemberRoleChange(settingsTeam, member, role)}
          onMemberWarning={(member) => handleMemberWarning(settingsTeam, member)}
          onMemberRemove={(member) => handleRemoveMember(settingsTeam, member)}
          onReviewJoinRequest={(requestId, accept) =>
            handleReviewJoinRequest(settingsTeam, requestId, accept)
          }
          onTransferRequest={() =>
            console.warn('[API] 제공된 팀 API 명세에 팀장 이관 경로가 없습니다.')
          }
          onDeleteRequest={() => void handleDeleteTeam(settingsTeam)}
        />
      )}

      {inviteTarget && inviteTeam && (
        <TeamInviteDialog
          teamName={inviteTeam.name}
          teamCode={inviteTarget.code}
          onClose={() => setInviteTarget(null)}
        />
      )}
    </div>
  )
}
