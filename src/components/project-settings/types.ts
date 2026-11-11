export type ProjectSettingsValue = {
  name: string
  description: string
  imageUrl?: string
}

export type ProjectApprovalRequest = {
  id: string
  title: string
  description: string
  statusLabel: string
}
