import { ApiError } from './errors'
export { ApiError, getApiErrorMessage, getApiErrorKind, getApiErrorStatus } from './errors'

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  authenticated?: boolean
  retryAuthentication?: boolean
}

type FetchOptions = Omit<RequestInit, 'body'> & { body?: unknown }

type TokenResponse = { accessToken: string }

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')
export const API_ROOT = import.meta.env.DEV ? '/api' : `${API_BASE_URL}/api`
let accessToken: string | null = null
let refreshRequest: Promise<string | null> | null = null

function getApiUrl(path: string) {
  const suffix = path.startsWith('/api/') ? path.slice(4) : path.startsWith('/') ? path : `/${path}`
  return `${API_ROOT}${suffix}`
}

export function setAccessToken(token: string | null) {
  accessToken = token
}

async function refreshAccessToken(): Promise<string | null> {
  if (refreshRequest) return refreshRequest

  refreshRequest = (async () => {
    if (!API_BASE_URL) throw new ApiError('API 주소가 설정되지 않았습니다.', 0)

    const response = await fetch(getApiUrl('/api/v1/auth/token/refresh'), {
      method: 'POST',
      credentials: 'include',
      headers: { Accept: 'application/json' },
    })

    if (!response.ok) {
      console.error(`[API] POST /api/v1/auth/token/refresh 요청 실패 (${response.status})`)
      if (response.status === 401 || response.status === 403) {
        accessToken = null
        return null
      }
      throw new ApiError(await parseError(response), response.status)
    }

    const body = (await response.json()) as TokenResponse
    accessToken = body.accessToken
    return accessToken
  })().catch((error: unknown) => {
    console.error('[API] 액세스 토큰 갱신에 실패했습니다.', error)
    if (error instanceof ApiError) throw error
    throw new ApiError('서버에 연결하지 못했습니다. 다시 시도해 주세요.', 0, { cause: error })
  })

  try {
    return await refreshRequest
  } finally {
    refreshRequest = null
  }
}

async function parseError(response: Response) {
  try {
    const body: unknown = await response.json()
    if (typeof body === 'object' && body !== null) {
      if ('error' in body && typeof body.error === 'string' && body.error.trim()) return body.error
      if ('message' in body && typeof body.message === 'string' && body.message.trim())
        return body.message
    }
    return '요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.'
  } catch {
    return '요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.'
  }
}

async function sendRequest(path: string, options: FetchOptions, token?: string | null) {
  const { body, headers, ...requestOptions } = options
  const requestHeaders = new Headers(headers)
  requestHeaders.set('Accept', 'application/json')

  let requestBody: BodyInit | null | undefined
  if (body instanceof FormData || body instanceof Blob || typeof body === 'string') {
    requestBody = body
  } else if (body !== undefined) {
    requestHeaders.set('Content-Type', 'application/json')
    requestBody = JSON.stringify(body)
  }

  if (token) requestHeaders.set('Authorization', `Bearer ${token}`)

  return fetch(getApiUrl(path), {
    ...requestOptions,
    headers: requestHeaders,
    body: requestBody,
    credentials: 'include',
  })
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { authenticated = true, retryAuthentication = true, ...fetchOptions } = options
  if (!API_BASE_URL) throw new ApiError('API 주소가 설정되지 않았습니다.', 0)

  let token = authenticated ? (accessToken ?? (await refreshAccessToken())) : null

  try {
    let response = await sendRequest(path, fetchOptions, token)
    if (response.status === 401 && authenticated && retryAuthentication) {
      token = await refreshAccessToken()
      if (token) response = await sendRequest(path, fetchOptions, token)
    }

    if (!response.ok) throw new ApiError(await parseError(response), response.status)
    if (response.status === 204) return undefined as T
    return (await response.json()) as T
  } catch (error) {
    console.error(`[API] ${options.method ?? 'GET'} ${path} 요청 실패`, error)
    if (error instanceof ApiError) throw error
    throw new ApiError('서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.', 0)
  }
}
