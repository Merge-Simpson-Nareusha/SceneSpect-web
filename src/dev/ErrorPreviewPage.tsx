import { useRef, useState } from 'react'
import BrandLogo from '../components/common/BrandLogo'
import { commonStyles } from '../components/common/styles'
import { ExceptionState, InlineFeedback } from '../components/feedback'

const previews = [
  { kind: 'notFound', label: '404', href: '/404' },
  { kind: 'forbidden', label: '403', href: '/403' },
  { kind: 'server', label: '500', href: '/500' },
  { kind: 'unavailable', label: '503', href: '/503' },
  { kind: 'network', label: '네트워크', href: '/network-error' },
  { kind: 'sessionExpired', label: '세션 만료', href: '/session-expired' },
  { kind: 'uploadFailed', label: '업로드 실패' },
  { kind: 'analysisFailed', label: 'AI 분석 실패' },
  { kind: 'invalidInvitation', label: '초대 링크 오류' },
] as const
type PreviewKind = (typeof previews)[number]['kind']

export default function ErrorPreviewPage() {
  const [kind, setKind] = useState<PreviewKind>('notFound')
  const [uploadReason, setUploadReason] = useState<'format' | 'size' | 'network' | 'unknown'>(
    'network',
  )
  const [invitationReason, setInvitationReason] = useState<'expired' | 'invalid' | 'unavailable'>(
    'expired',
  )
  const [notice, setNotice] = useState('')
  const [simulateFailure, setSimulateFailure] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)
  const selectedPreview = previews.find((preview) => preview.kind === kind)
  const selectedPage = selectedPreview && 'href' in selectedPreview ? selectedPreview : undefined

  const retry = async () => {
    setNotice('')
    await new Promise((resolve) => window.setTimeout(resolve, 1200))
    if (simulateFailure) throw new Error('개발용 재시도 실패')
    setNotice('재시도 동작을 확인했습니다. 실제 서버 요청은 보내지 않았습니다.')
  }

  return (
    <main className="mx-auto min-h-svh max-w-[1280px] space-y-[28px] px-[20px] py-[32px] text-[#16181d] sm:px-[40px]">
      <header className="space-y-[12px]">
        <BrandLogo width={146} />
        <p className="pt-[16px] text-[12px] font-medium tracking-[0.08em] text-[#737b88]">
          ERROR & EXCEPTION STATES
        </p>
        <h1 className="text-[28px] font-semibold tracking-[-0.04em]">오류 화면 미리보기</h1>
        <p className="text-[14px] leading-[24px] text-[#737b88]">
          페이지 오류는 실제 경로를 표시합니다. 작업 실패 예외 상태의 재시도는 1.2초 뒤 완료되는
          개발용 동작입니다.
        </p>
        <nav
          aria-label="컴포넌트 미리보기 이동"
          className="flex flex-wrap gap-[20px] text-[13px] text-[#2962ff] underline underline-offset-4"
        >
          <a href="?preview=common">공통 컴포넌트</a>
          <a href="?preview=team">팀 관리</a>
          <a href="?preview=work">프로젝트 작업</a>
        </nav>
      </header>

      <nav aria-label="오류 유형 선택" className="flex flex-wrap gap-[8px]">
        {previews.map((preview) => (
          <button
            key={preview.kind}
            type="button"
            aria-pressed={kind === preview.kind}
            onClick={() => {
              setKind(preview.kind)
              setNotice('')
            }}
            className={`min-h-[40px] cursor-pointer rounded-[7px] border px-[14px] text-[13px] font-medium ${kind === preview.kind ? 'border-[#16181d] bg-[#16181d] text-white' : 'border-[#e3e7ee] bg-white text-[#737b88] hover:border-[#aab7cd]'} ${commonStyles.focus}`}
          >
            {preview.label}
          </button>
        ))}
      </nav>

      <div className="flex flex-wrap items-center gap-[16px] text-[13px]">
        {kind === 'uploadFailed' && (
          <label className="flex items-center gap-[10px]">
            실패 원인
            <select
              aria-label="업로드 실패 원인"
              value={uploadReason}
              onChange={(event) => setUploadReason(event.target.value as typeof uploadReason)}
              className="h-[40px] rounded-[6px] border border-[#e3e7ee] px-[10px]"
            >
              <option value="network">네트워크 오류</option>
              <option value="format">파일 형식</option>
              <option value="size">파일 용량</option>
              <option value="unknown">기타 오류</option>
            </select>
          </label>
        )}
        {kind === 'invalidInvitation' && (
          <label className="flex items-center gap-[10px]">
            초대 상태
            <select
              aria-label="초대 링크 상태"
              value={invitationReason}
              onChange={(event) =>
                setInvitationReason(event.target.value as typeof invitationReason)
              }
              className="h-[40px] rounded-[6px] border border-[#e3e7ee] px-[10px]"
            >
              <option value="expired">만료됨</option>
              <option value="invalid">유효하지 않음</option>
              <option value="unavailable">사용 불가</option>
            </select>
          </label>
        )}
        {!selectedPage && (kind === 'uploadFailed' || kind === 'analysisFailed') && (
          <label className="flex min-h-[40px] cursor-pointer items-center gap-[8px]">
            <input
              type="checkbox"
              checked={simulateFailure}
              onChange={(event) => setSimulateFailure(event.target.checked)}
            />
            재시도 실패도 확인
          </label>
        )}
        {selectedPage && (
          <a
            href={selectedPage.href}
            className="ml-auto text-[#2962ff] underline underline-offset-4"
          >
            실제 페이지 열기 ↗
          </a>
        )}
      </div>

      {selectedPage ? (
        <div className="relative left-1/2 w-screen -translate-x-1/2 bg-white">
          <iframe
            key={selectedPage.href}
            src={selectedPage.href}
            title={`${selectedPage.label} 오류 페이지 미리보기`}
            className="block h-svh w-full border-0 bg-white"
          />
        </div>
      ) : (
        <div className="min-h-[420px] overflow-hidden rounded-[16px] border border-[#e3e7ee] bg-white">
          {kind === 'uploadFailed' ? (
            <ExceptionState
              key={`${kind}-${uploadReason}`}
              kind={kind}
              reason={uploadReason}
              onSelectFile={() => fileInput.current?.click()}
              onRetry={retry}
            />
          ) : kind === 'analysisFailed' ? (
            <ExceptionState key={kind} kind={kind} onRetry={retry} />
          ) : kind === 'invalidInvitation' ? (
            <ExceptionState
              key={`${kind}-${invitationReason}`}
              kind={kind}
              reason={invitationReason}
            />
          ) : null}
        </div>
      )}
      <input
        ref={fileInput}
        type="file"
        accept="video/*"
        aria-label="미리보기 영상 파일 선택"
        className="hidden"
        onChange={(event) => {
          const file = event.currentTarget.files?.[0]
          if (file) setNotice(`${file.name} 파일을 선택했습니다. 서버로 업로드하지 않았습니다.`)
          event.currentTarget.value = ''
        }}
      />
      <InlineFeedback message={notice} tone="info" />

      <section
        aria-labelledby="inline-feedback-heading"
        className="space-y-[12px] border-t border-[#e8edf5] pt-[28px]"
      >
        <h2 id="inline-feedback-heading" className="mb-[16px] text-[18px] font-semibold">
          화면 내부 안내
        </h2>
        <InlineFeedback message="서버에 일시적인 문제가 생겼습니다. 입력한 내용은 유지됩니다. 잠시 후 다시 시도해 주세요." />
        <InlineFeedback message="이메일 또는 비밀번호를 확인해 주세요." variant="inline" />
        <InlineFeedback
          message="저장되지 않은 변경사항이 있습니다. 저장한 뒤 닫아 주세요."
          tone="warning"
        />
        <InlineFeedback message="팀 설정을 저장했습니다." tone="success" />
        <InlineFeedback message="팀 정보를 불러오는 중입니다." tone="info" />
      </section>
    </main>
  )
}
