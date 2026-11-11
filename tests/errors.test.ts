import assert from 'node:assert/strict'
import test from 'node:test'
import {
  ApiError,
  getApiErrorKind,
  getApiErrorMessage,
  getApiErrorStatus,
} from '../src/services/errors.ts'

const fallback = '요청을 완료하지 못했습니다.'

test('fetch와 cause로 감싼 Axios 오류가 같은 화면 상태로 분류된다', () => {
  for (const [status, kind] of [
    [0, 'network'],
    [401, 'sessionExpired'],
    [403, 'forbidden'],
    [404, 'notFound'],
    [500, 'server'],
    [502, 'server'],
    [503, 'unavailable'],
  ] as const) {
    const fetchError = new ApiError('서버 내부 상세 정보', status)
    const axiosError = new Error('인증 요청 실패', {
      cause: { isAxiosError: true, response: status ? { status } : undefined },
    })
    assert.equal(getApiErrorKind(fetchError), kind)
    assert.equal(getApiErrorKind(axiosError), kind)
    assert.equal(getApiErrorMessage(fetchError, fallback), getApiErrorMessage(axiosError, fallback))
  }
})

test('서버 오류의 내부 메시지는 사용자에게 노출하지 않는다', () => {
  for (const status of [500, 502, 503, 504]) {
    const error = {
      isAxiosError: true,
      response: { status, data: { error: 'SQL connection refused: internal database' } },
    }
    const message = getApiErrorMessage(error, fallback)
    assert.doesNotMatch(message, /SQL|database|refused/)
    assert.match(message, /다시 시도/)
  }
})

test('입력 오류의 설명과 이메일 중복 안내를 유지한다', () => {
  const conflict = new Error('이미 가입된 이메일입니다.', {
    cause: { isAxiosError: true, response: { status: 409 } },
  })
  assert.equal(getApiErrorMessage(conflict, fallback), '이미 가입된 이메일입니다.')
  assert.equal(getApiErrorKind(conflict), 'request')
  assert.equal(
    getApiErrorMessage(
      {
        isAxiosError: true,
        response: { status: 400, data: { message: '인증 코드를 확인해 주세요.' } },
      },
      fallback,
    ),
    '인증 코드를 확인해 주세요.',
  )
})

test('404는 권한 상태로 추측하지 않고 서버가 준 상태를 유지한다', () => {
  assert.equal(getApiErrorKind(new ApiError('비공개 대상', 404)), 'notFound')
  assert.equal(getApiErrorKind(new ApiError('접근 불가', 403)), 'forbidden')
})

test('용량·형식·요청 제한 오류는 다시 진행할 방법을 안내한다', () => {
  assert.match(getApiErrorMessage(new ApiError('', 413), fallback), /더 작은 파일/)
  assert.match(getApiErrorMessage(new ApiError('', 415), fallback), /파일 형식/)
  assert.match(getApiErrorMessage(new ApiError('', 429), fallback), /잠시 후/)
})

test('누락되거나 잘못된 오류 응답에는 기본 안내를 사용한다', () => {
  for (const error of [
    null,
    undefined,
    {},
    new Error(''),
    { isAxiosError: true, response: { status: 400, data: { error: { detail: 'invalid' } } } },
  ]) {
    assert.equal(getApiErrorMessage(error, fallback), fallback)
  }
  assert.equal(getApiErrorStatus(new Error('입력값 오류')), undefined)
})

test('순환 cause에서도 종료하고 예외를 던지지 않는다', () => {
  const error = new Error('입력값 오류')
  error.cause = error
  assert.equal(getApiErrorStatus(error), undefined)
  assert.equal(getApiErrorMessage(error, fallback), '입력값 오류')
})
