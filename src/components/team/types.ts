export type TeamSort = 'recent' | 'name' | 'created'

export type TeamMember = {
  id: string
  name: string
  role: string
  apiRole?: 'LEADER' | 'DEPUTY' | 'MEMBER'
  canCreateProjects?: boolean
  warningCount?: number
  showMenu?: boolean
  avatarSrc?: string
}

export type TeamJoinRequest = {
  id: string
  userId: string
  nickname: string
  createdAt: string
}

export type TeamDetails = {
  name: string
  description: string
  youtubeUrl: string
  guidelines: string
  avatarSrc?: string
}
