import { apiRequest } from './api'

export type ApiTeamRole = 'LEADER' | 'DEPUTY' | 'MEMBER'

export type ApiTeam = {
  id: string
  name: string
  description: string
  youtubeUrl: string
  guideline: string
  avatarUrl?: string
  role: ApiTeamRole
  memberCount: number
  createdAt: string
  updatedAt: string
  joinCode?: string
}

export type ApiTeamMember = {
  userId: string
  nickname: string
  avatarUrl?: string
  role: ApiTeamRole
  warningCount: number
  canCreateProjects: boolean
  joinedAt: string
}

export type ApiTeamJoinRequest = {
  id: string
  teamId: string
  userId: string
  nickname: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | string
  createdAt: string
}

export type TeamCreatePayload = {
  name: string
  description: string
}

export type TeamUpdatePayload = {
  name: string
  description?: string
  youtubeUrl?: string
  guideline?: string
  avatarUrl?: string
}

export function getTeams(query = '') {
  const search = query.trim() ? `?query=${encodeURIComponent(query.trim())}` : ''
  return apiRequest<{ teams: ApiTeam[] }>(`/api/v1/teams${search}`)
}

export function checkTeamNameAvailability(name: string, excludeTeamId?: string) {
  const params = new URLSearchParams({ name: name.trim() })
  if (excludeTeamId) params.set('excludeTeamId', excludeTeamId)
  return apiRequest<{ available: boolean }>(`/api/v1/teams/name-availability?${params}`)
}

export function saveTeamOrder(teamIds: string[]) {
  return apiRequest<void>('/api/v1/teams/order', {
    method: 'PUT',
    body: { teamIds },
  })
}

export function createTeam(payload: TeamCreatePayload) {
  return apiRequest<{ team: ApiTeam }>('/api/v1/teams', { method: 'POST', body: payload })
}

export function joinTeam(joinCode: string, nickname: string) {
  return apiRequest<{ request: { id: string; teamId: string; status: string } }>(
    '/api/v1/teams/join-requests',
    { method: 'POST', body: { joinCode, nickname } },
  )
}

export function getTeam(teamId: string) {
  return apiRequest<{ team: ApiTeam }>(`/api/v1/teams/${encodeURIComponent(teamId)}`)
}

export function updateTeam(teamId: string, payload: TeamUpdatePayload) {
  return apiRequest<{ team: ApiTeam }>(`/api/v1/teams/${encodeURIComponent(teamId)}`, {
    method: 'PATCH',
    body: payload,
  })
}

export function deleteTeam(teamId: string) {
  return apiRequest<void>(`/api/v1/teams/${encodeURIComponent(teamId)}`, { method: 'DELETE' })
}

export function getTeamMembers(teamId: string) {
  return apiRequest<{ members: ApiTeamMember[] }>(
    `/api/v1/teams/${encodeURIComponent(teamId)}/members`,
  )
}

export function removeTeamMember(teamId: string, userId: string) {
  return apiRequest<void>(
    `/api/v1/teams/${encodeURIComponent(teamId)}/members/${encodeURIComponent(userId)}`,
    { method: 'DELETE' },
  )
}

export function addTeamMemberWarning(teamId: string, userId: string) {
  return apiRequest<{ warningCount: number }>(
    `/api/v1/teams/${encodeURIComponent(teamId)}/members/${encodeURIComponent(userId)}/warnings`,
    { method: 'POST' },
  )
}

export function getTeamJoinRequests(teamId: string) {
  return apiRequest<{ requests: ApiTeamJoinRequest[] }>(
    `/api/v1/teams/${encodeURIComponent(teamId)}/join-requests`,
  )
}

export function reviewTeamJoinRequest(teamId: string, requestId: string, accept: boolean) {
  return apiRequest<void>(
    `/api/v1/teams/${encodeURIComponent(teamId)}/join-requests/${encodeURIComponent(requestId)}`,
    { method: 'PATCH', body: { accept } },
  )
}

export async function updateTeamMemberRole(
  teamId: string,
  userId: string,
  role: 'DEPUTY' | 'MEMBER',
  canCreateProjects?: boolean,
) {
  const memberPath = `/api/v1/teams/${encodeURIComponent(teamId)}/members/${encodeURIComponent(userId)}`
  await apiRequest<void>(`${memberPath}/role`, { method: 'PATCH', body: { role } })

  if (role === 'MEMBER' && canCreateProjects !== undefined) {
    await apiRequest<void>(`${memberPath}/permissions`, {
      method: 'PATCH',
      body: { canCreateProjects },
    })
  }
}

export function uploadTeamAvatar(file: File) {
  const body = new FormData()
  body.append('file', file)
  return apiRequest<{ url: string }>('/api/v1/media/images', { method: 'POST', body })
}
