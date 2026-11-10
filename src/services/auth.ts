import { apiRequest, setAccessToken } from './api'

export type AuthUser = {
  id: string
  email: string
  username: string
  nickname: string
  avatarUrl?: string
}

type LoginResponse = {
  accessToken: string
  user: AuthUser
}

type CurrentUserResponse = { user: AuthUser }

const USER_CACHE_KEY = 'scenespect.user'

export async function login(login: string, password: string) {
  const response = await apiRequest<LoginResponse>('/api/v1/auth/login', {
    method: 'POST',
    authenticated: false,
    body: { login, password },
  })

  setAccessToken(response.accessToken)
  sessionStorage.setItem(USER_CACHE_KEY, JSON.stringify(response.user))
  return response.user
}

export async function getCurrentUser() {
  const response = await apiRequest<CurrentUserResponse>('/api/v1/auth/me')
  sessionStorage.setItem(USER_CACHE_KEY, JSON.stringify(response.user))
  return response.user
}

export function getCachedUser(): AuthUser | null {
  const cached = sessionStorage.getItem(USER_CACHE_KEY)
  if (!cached) return null
  try {
    return JSON.parse(cached) as AuthUser
  } catch {
    sessionStorage.removeItem(USER_CACHE_KEY)
    return null
  }
}

export async function logout() {
  try {
    await apiRequest<void>('/api/v1/auth/logout', {
      method: 'POST',
      authenticated: false,
      retryAuthentication: false,
    })
  } finally {
    setAccessToken(null)
    sessionStorage.removeItem(USER_CACHE_KEY)
  }
}
