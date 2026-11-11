export class ApiError extends Error {
  status: number

  constructor(message: string, status: number, options?: ErrorOptions) {
    super(message, options)
    this.name = 'ApiError'
    this.status = status
  }
}

export type PageErrorKind =
  'notFound' | 'forbidden' | 'server' | 'unavailable' | 'network' | 'sessionExpired'

// 회원가입의 Axios 오류처럼 다른 Error의 cause에 담긴 HTTP 상태도 유지합니다.
export function getApiErrorStatus(error: unknown): number | undefined {
  const visited = new Set<unknown>()
  let current = error

  while (typeof current === 'object' && current !== null && !visited.has(current)) {
    visited.add(current)
    if ('status' in current && typeof current.status === 'number') return current.status
    if ('isAxiosError' in current && current.isAxiosError === true) {
      const response = 'response' in current ? current.response : undefined
      return typeof response === 'object' &&
        response !== null &&
        'status' in response &&
        typeof response.status === 'number'
        ? response.status
        : 0
    }
    current = 'cause' in current ? current.cause : undefined
  }
  return undefined
}

export function getApiErrorKind(error: unknown): PageErrorKind | 'request' {
  const status = getApiErrorStatus(error)
  if (status === 0) return 'network'
  if (status === 401) return 'sessionExpired'
  if (status === 403) return 'forbidden'
  if (status === 404) return 'notFound'
  if (status === 503) return 'unavailable'
  if (status !== undefined && status >= 500) return 'server'
  return 'request'
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  const status = getApiErrorStatus(error)
  if (status === 0) return '서버에 연결하지 못했습니다. 인터넷 연결을 확인한 뒤 다시 시도해 주세요.'
  if (status === 401) return '로그인이 만료되었습니다. 다시 로그인해 주세요.'
  if (status === 403) return '접근 권한이 없습니다. 관리자에게 권한을 확인해 주세요.'
  if (status === 404)
    return '요청한 대상을 찾을 수 없습니다. 삭제되었거나 주소가 변경되었을 수 있습니다.'
  if (status === 408) return '요청 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.'
  if (status === 413) return '파일 용량이 업로드 한도를 초과했습니다. 더 작은 파일을 선택해 주세요.'
  if (status === 415) return '지원하지 않는 파일 형식입니다. 업로드 가능한 형식을 확인해 주세요.'
  if (status === 429) return '요청이 많아 잠시 쉬고 있습니다. 잠시 후 다시 시도해 주세요.'
  if (status === 503) return '서비스를 잠시 이용할 수 없습니다. 잠시 후 다시 시도해 주세요.'
  if (status !== undefined && status >= 500) {
    return '서버에 일시적인 문제가 생겼습니다. 잠시 후 다시 시도해 주세요.'
  }

  if (typeof error === 'object' && error !== null && 'isAxiosError' in error) {
    const response = 'response' in error ? error.response : undefined
    const data =
      typeof response === 'object' && response !== null && 'data' in response
        ? response.data
        : undefined
    if (typeof data === 'object' && data !== null) {
      if ('error' in data && typeof data.error === 'string' && data.error.trim()) return data.error
      if ('message' in data && typeof data.message === 'string' && data.message.trim())
        return data.message
    }
    return fallback
  }

  return error instanceof Error && error.message.trim() ? error.message : fallback
}
