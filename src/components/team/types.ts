export type TeamSort = 'recent' | 'name' | 'created'

export type TeamMember = {
  id: string
  name: string
  role: string
  showMenu?: boolean
  avatarSrc?: string
}

export type TeamDetails = {
  name: string
  description: string
  youtubeUrl: string
  guidelines: string
  avatarSrc?: string
}
