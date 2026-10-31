/**
 * 인증 관련 서버 통신 코드를 작성하는 파일입니다.
 * 화면 컴포넌트(UI) 코드는 이 파일에 넣지 않습니다.
 *
 * 여기에 작성할 내용:
 * 1. 로그인, 회원가입, 이메일 인증 등 각 API의 요청 데이터 타입
 *    - 예: 이메일/비밀번호, 인증번호
 * 2. 서버가 돌려주는 응답 데이터 타입
 *    - 예: 사용자 정보, 성공 여부, 액세스 토큰
 * 3. 서버 API를 호출하는 함수
 *    - 예: 로그인, 회원가입, 인증번호 발송 및 확인
 * 4. 공통 요청 처리
 *    - API 기본 주소, JSON 변환, 실패 응답/네트워크 오류 처리
 *
 * 백엔드 API 주소와 경로, 요청·응답 형식이 정해지면 그 규격에 맞춰 구현하세요.
 * 비밀 키나 서버 비밀번호는 프론트엔드 코드에 저장하지 마세요.
 */

// ====== 이전 코드 =======

// type SignupStartResponse = {
//   signupSessionId: string
// }

// export async function startSignup(email: string): Promise<SignupStartResponse> {
//   // if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_AUTH === 'true') {
//   //   return { signupSessionId: 'mock-session-id' }
//   // }
//   // const startedAt = performance.now()
//   // console.log(`${(performance.now() - startedAt).toFixed(2)}ms`)
//   const response = await fetch('/api/v1/auth/signup/start', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ email }),
//   })
//   //여기 더미데이터 넣어서 오는데 시간 측정
//   // console.log(`${(performance.now() - startedAt).toFixed(2)}ms`)
//   const data: unknown = await response.json().catch(() => null)

//   if (!response.ok) {
//     if (response.status === 409) {
//       throw new Error('이미 가입된 이메일입니다.')
//     }

//     throw new Error('회원가입을 시작하지 못했습니다.')
//   }

//   if (
//     typeof data !== 'object' ||
//     data === null ||
//     !('signupSessionId' in data) ||
//     typeof data.signupSessionId !== 'string'
//   ) {
//     throw new Error('서버 응답에서 가입 세션 ID를 찾지 못했습니다.')
//   }

//   // console.log(`${(performance.now() - startedAt).toFixed(2)}ms`)

//   return { signupSessionId: data.signupSessionId }
// }
// //아래 시간측정
// //걸리는 시간 문제 보고 문제없으면 리액트 불러오는데 문제

// ====== axios 적용 =======

import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

type SignupStartResponse = {
  signupSessionId: string
}

export async function startSignup(
  email: string,
): Promise<SignupStartResponse> {
  let data: unknown

  try {
    const response = await api.post<unknown>(
      '/v1/auth/signup/start',
      { email },
    )

    data = response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 409) {
      throw new Error('이미 가입된 이메일입니다.', { cause: error })
    }

    throw new Error('회원가입을 시작하지 못했습니다.', { cause: error })
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