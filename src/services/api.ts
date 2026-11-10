export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  authenticated?: boolean
  retryAuthentication?: boolean
}

type FetchOptions = Omit<RequestInit, 'body'> & { body?: unknown }

type TokenResponse = { accessToken: string }

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')
let accessToken: string | null = null
let refreshRequest: Promise<string | null> | null = null

export function setAccessToken(token: string | null) {
  accessToken = token
}

async function refreshAccessToken(): Promise<string | null> {
  if (refreshRequest) return refreshRequest

  refreshRequest = (async () => {
    if (!API_BASE_URL) throw new ApiError('API 주소가 설정되지 않았습니다.', 0)

    const response = await fetch(`${API_BASE_URL}/api/v1/auth/token/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { Accept: 'application/json' },
    })

    if (!response.ok) {
      accessToken = null
      console.error(`[API] POST /api/v1/auth/token/refresh 요청 실패 (${response.status})`)
      return null
    }

    const body = (await response.json()) as TokenResponse
    accessToken = body.accessToken
    return accessToken
  })()

  try {
    return await refreshRequest
  } catch (error) {
    accessToken = null
    console.error('[API] 액세스 토큰 갱신에 실패했습니다.', error)
    return null
  } finally {
    refreshRequest = null
  }
}

async function parseError(response: Response) {
  try {
    const body = (await response.json()) as { error?: string; message?: string }
    return body.error ?? body.message ?? `요청에 실패했습니다. (${response.status})`
  } catch {
    return `요청에 실패했습니다. (${response.status})`
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

  return fetch(`${API_BASE_URL}${path}`, {
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

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (!(error instanceof ApiError)) return error instanceof Error ? error.message || fallback : fallback
  if (error.status === 401) return '로그인이 만료되었습니다. 다시 로그인해 주세요.'
  if (error.status === 403) return '이 작업을 수행할 권한이 없습니다.'
  if (error.status === 409) return '이미 사용 중인 팀 이름입니다.'
  if (error.status === 0) return fallback
  return error.message || fallback
}
