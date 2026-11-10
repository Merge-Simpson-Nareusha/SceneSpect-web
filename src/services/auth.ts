import axios from 'axios'
import { apiRequest, API_ROOT, setAccessToken } from './api'

// 모든 인증 요청은 같은 Axios 설정을 사용합니다.
// 개발 환경에서는 Vite가 /api 요청을 백엔드 주소로 전달합니다.
const api = axios.create({
  baseURL: API_ROOT,
  withCredentials: true,
})

export type AuthUser = {
  id: string
  email: string
  username: string
  nickname: string
  avatarUrl?: string
}

type LoginResponse = { accessToken: string; user: AuthUser }
type CurrentUserResponse = { user: AuthUser }

const USER_CACHE_KEY = 'scenespect.user'

type SignupStartResponse = {
  signupSessionId: string
}

type SignupEmailUpdateResponse = {
  signupSessionId: string
  email: string
}

export type SignupTerm = {
  id: string
  code: string
  version: string
  title: string
  content: string
  required: boolean
}

type SignupTermsResponse = {
  terms: SignupTerm[]
}

type SignupPasswordInput = {
  signupSessionId: string
  password: string
  passwordConfirmation: string
}

type SignupPasswordResponse = {
  next: 'email_verification'
}

type SignupEmailSendResponse = {
  expiresIn: number
  resendAfter: number
}

type SignupEmailVerifyResponse = {
  verified: boolean
  next: 'terms'
}

type SignupConsent = {
  termId: string
  accepted: boolean
}

export type SignupCompleteResponse = {
  accessToken: string
  tokenType: 'Bearer'
  expiresIn: number
  user: AuthUser & {
    displayTheme: string
    role: string
    status: string
    emailVerified: boolean
    createdAt: string
  }
}

// 서버가 보내준 오류 문구가 있으면 화면에서 사용할 수 있도록 꺼냅니다.
function getServerErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const responseData: unknown = error.response?.data

    if (
      typeof responseData === 'object' &&
      responseData !== null &&
      'error' in responseData &&
      typeof responseData.error === 'string'
    ) {
      return responseData.error
    }
  }

  return fallback
}

// 이메일로 가입 세션을 시작합니다. 이메일을 수정한 경우 새 세션을 발급받는 데도 사용합니다.
export async function startSignup(email: string): Promise<SignupStartResponse> {
  let data: unknown

  try {
    const response = await api.post<unknown>('/v1/auth/signup/start', { email })
    data = response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 409) {
      throw new Error('이미 가입된 이메일입니다.', { cause: error })
    }

    throw new Error(getServerErrorMessage(error, '회원가입을 시작하지 못했습니다.'), {
      cause: error,
    })
  }

  if (
    typeof data !== 'object' ||
    data === null ||
    !('signupSessionId' in data) ||
    typeof data.signupSessionId !== 'string'
  ) {
    throw new Error('서버 응답에서 가입 세션 ID를 찾지 못했습니다.')
  }

  return { signupSessionId: data.signupSessionId }
}

// 비밀번호 설정 단계에서 기존 가입 세션의 이메일을 수정합니다.
export async function updateSignupEmail(
  signupSessionId: string,
  email: string,
): Promise<SignupEmailUpdateResponse> {
  let data: unknown

  try {
    const response = await api.patch<unknown>('/v1/auth/signup/email', {
      signupSessionId,
      email,
    })
    data = response.data
  } catch (error) {
    throw new Error(getServerErrorMessage(error, '이메일을 수정하지 못했습니다.'), {
      cause: error,
    })
  }

  if (
    typeof data !== 'object' ||
    data === null ||
    !('signupSessionId' in data) ||
    typeof data.signupSessionId !== 'string' ||
    !('email' in data) ||
    typeof data.email !== 'string'
  ) {
    throw new Error('서버 응답에서 수정된 이메일 정보를 확인하지 못했습니다.')
  }

  return { signupSessionId: data.signupSessionId, email: data.email }
}

// 가입 세션에 비밀번호를 저장하고 이메일 인증 단계로 진행합니다.
export async function setSignupPassword(
  input: SignupPasswordInput,
): Promise<SignupPasswordResponse> {
  try {
    const response = await api.post<SignupPasswordResponse>('/v1/auth/signup/password', input)

    return response.data
  } catch (error) {
    throw new Error(
      getServerErrorMessage(error, '비밀번호를 저장하지 못했습니다. 다시 시도해 주세요.'),
      { cause: error },
    )
  }
}

// 현재 가입에 적용할 약관 목록과 서버 발급 ID를 가져옵니다.
export async function getSignupTerms(): Promise<SignupTermsResponse> {
  try {
    const response = await api.get<unknown>('/v1/auth/signup/terms', { timeout: 15_000 })
    const data = response.data

    if (
      typeof data !== 'object' ||
      data === null ||
      !('terms' in data) ||
      !Array.isArray(data.terms) ||
      !data.terms.every(
        (term) =>
          typeof term === 'object' &&
          term !== null &&
          'id' in term &&
          typeof term.id === 'string' &&
          'code' in term &&
          typeof term.code === 'string' &&
          'version' in term &&
          typeof term.version === 'string' &&
          'title' in term &&
          typeof term.title === 'string' &&
          'content' in term &&
          typeof term.content === 'string' &&
          'required' in term &&
          typeof term.required === 'boolean',
      )
    ) {
      throw new Error('서버 약관 응답 형식이 올바르지 않습니다.')
    }

    if (data.terms.length === 0) {
      throw new Error('현재 가입에 필요한 약관이 없습니다.')
    }

    return { terms: data.terms as SignupTerm[] }
  } catch (error) {
    if (!axios.isAxiosError(error)) {
      if (error instanceof Error) throw error
      throw new Error('약관 목록을 불러오지 못했습니다.', { cause: error })
    }

    const fallbackMessage =
      error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT'
        ? '약관 목록 서버가 15초 안에 응답하지 않았습니다. 잠시 후 다시 시도해 주세요.'
        : error.response
          ? `약관 목록 요청에 실패했습니다. (HTTP ${error.response.status})`
          : '약관 목록 서버에 연결할 수 없습니다. 네트워크를 확인해 주세요.'

    throw new Error(getServerErrorMessage(error, fallbackMessage), {
      cause: error,
    })
  }
}

// 가입 세션으로 인증 메일을 발송합니다.
export async function sendSignupVerificationCode(
  signupSessionId: string,
): Promise<SignupEmailSendResponse> {
  try {
    const response = await api.post<SignupEmailSendResponse>(
      '/v1/auth/signup/email/send',
      { signupSessionId },
    )
    return response.data
  } catch (error) {
    throw new Error(getServerErrorMessage(error, '인증 메일을 보내지 못했습니다.'), {
      cause: error,
    })
  }
}

// 사용자가 입력한 인증 코드를 확인하고 약관 단계로 진행합니다.
export async function verifySignupEmail(
  signupSessionId: string,
  code: string,
): Promise<SignupEmailVerifyResponse> {
  try {
    const response = await api.post<SignupEmailVerifyResponse>(
      '/v1/auth/signup/email/verify',
      { signupSessionId, code },
    )
    return response.data
  } catch (error) {
    throw new Error(getServerErrorMessage(error, '인증 코드를 확인하지 못했습니다.'), {
      cause: error,
    })
  }
}

// 선택 상태와 서버가 발급한 약관 ID를 보내 최종 가입을 완료합니다.
export async function completeSignup(
  signupSessionId: string,
  consents: SignupConsent[],
): Promise<SignupCompleteResponse> {
  try {
    const response = await api.post<SignupCompleteResponse>('/v1/auth/signup/terms', {
      signupSessionId,
      consents,
    })
    setAccessToken(response.data.accessToken)
    sessionStorage.setItem(USER_CACHE_KEY, JSON.stringify(response.data.user))
    return response.data
  } catch (error) {
    throw new Error(getServerErrorMessage(error, '회원가입을 완료하지 못했습니다.'), {
      cause: error,
    })
  }
}

export async function login(loginId: string, password: string) {
  const response = await apiRequest<LoginResponse>('/api/v1/auth/login', {
    method: 'POST',
    authenticated: false,
    body: { login: loginId, password },
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
