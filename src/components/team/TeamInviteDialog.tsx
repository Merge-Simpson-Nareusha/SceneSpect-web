import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { commonStyles } from '../common/styles'
import TeamCreateButton from './TeamCreateButton'
import InlineFeedback from '../feedback/InlineFeedback'
import type { InlineFeedbackProps } from '../feedback/InlineFeedback'
import { getApiErrorMessage } from '../../services/api'

export type TeamInviteDialogProps = {
  teamName: string
  teamCode: string
  onClose: () => void
  onInviteEmail?: (email: string) => boolean | Promise<boolean>
}

export default function TeamInviteDialog({
  teamName,
  teamCode,
  onClose,
  onInviteEmail,
}: TeamInviteDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const emailInputId = useId()
  const [email, setEmail] = useState('')
  const [feedback, setFeedback] = useState<{
    message: string
    tone: InlineFeedbackProps['tone']
  } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const close = () => {
    if (!submitting) onClose()
  }

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    dialog.showModal()
    return () => {
      dialog.close()
      if (previousFocus?.isConnected) previousFocus.focus()
    }
  }, [])

  const handleInvite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail || submitting) return

    if (!onInviteEmail) {
      console.warn('[API] 이메일 초대 엔드포인트가 제공된 명세에 없어 요청을 보내지 않았습니다.')
      return
    }

    setSubmitting(true)
    setFeedback(null)
    try {
      const sent = await onInviteEmail(normalizedEmail)
      if (!sent) {
        setFeedback({
          message: '이 이메일은 이미 팀에 있거나 초대 대기 중입니다.',
          tone: 'warning',
        })
        return
      }
      setEmail('')
      setFeedback({ message: '초대 메일을 보냈습니다.', tone: 'success' })
    } catch (error) {
      setFeedback({
        message: getApiErrorMessage(error, '초대 메일을 보내지 못했습니다. 다시 시도해 주세요.'),
        tone: 'error',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(teamCode)
      setFeedback({ message: '팀 코드를 복사했습니다.', tone: 'success' })
    } catch {
      setFeedback({
        message: '코드를 복사할 수 없습니다. 팀 코드를 선택해 직접 복사해 주세요.',
        tone: 'error',
      })
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={`${emailInputId}-title`}
      onCancel={(event) => {
        event.preventDefault()
        close()
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return
        const bounds = event.currentTarget.getBoundingClientRect()
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          close()
      }}
      className="m-auto max-h-[calc(100svh-32px)] w-[720px] max-w-[calc(100vw-32px)] overflow-y-auto rounded-[16px] border border-[#e5e7eb] bg-white p-0 text-[#16181d] shadow-xl backdrop:bg-black/40"
    >
      <form onSubmit={handleInvite} className="flex flex-col gap-6 p-4 sm:p-8">
        <header>
          <h2 id={`${emailInputId}-title`} className="text-2xl font-semibold">
            팀원 초대
          </h2>
          <p className="mt-2 text-sm text-[#737b88]">{teamName}</p>
        </header>

        <div className="flex flex-col gap-2">
          <section className="flex min-w-0 flex-col gap-3 rounded-xl p-3 sm:p-4">
            <h3 className="text-[16px] font-semibold sm:text-[18px]">팀 코드로 초대</h3>
            <button
              type="button"
              aria-label="팀 코드 복사"
              title="팀 코드 복사"
              onClick={copyCode}
              className={`group relative flex min-h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-[#f1f5f9] px-3 py-3 text-[clamp(1rem,4vw,1.375rem)] font-semibold tracking-[0.08em] text-[#2563eb] ${commonStyles.focus}`}
            >
              <span>{teamCode}</span>
              <span className="absolute right-3 rounded-md bg-white px-2 py-1 text-xs font-medium tracking-normal text-[#2563eb] opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none">
                복사
              </span>
            </button>
          </section>

          <section className="flex min-w-0 flex-col gap-3 rounded-xl p-3 pb-0 sm:p-4 sm:pb-0">
            <h3 className="text-[16px] font-semibold sm:text-[18px]">이메일로 초대하기</h3>
            <input
              id={emailInputId}
              aria-label="이메일 주소"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.currentTarget.value)
                setFeedback(null)
              }}
              placeholder="example@email.com"
              disabled={!onInviteEmail || submitting}
              aria-describedby={feedback ? `${emailInputId}-feedback` : undefined}
              className={`h-12 w-full rounded-lg border border-[#e3e6eb] px-3 text-base font-normal outline-none focus-visible:border-[#2563eb] focus-visible:ring-2 focus-visible:ring-[#2563eb]/20 sm:px-4 sm:text-lg ${commonStyles.focus}`}
            />
          </section>
        </div>

        <InlineFeedback
          id={`${emailInputId}-feedback`}
          message={feedback?.message}
          tone={feedback?.tone}
        />

        <footer className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <button
            type="button"
            onClick={close}
            disabled={submitting}
            className={`h-11 cursor-pointer rounded-lg border border-[#e3e6eb] px-5 text-sm font-medium hover:bg-[#f6f7f9] ${commonStyles.focus}`}
          >
            닫기
          </button>
          <TeamCreateButton
            type="submit"
            disabled={!onInviteEmail || submitting}
            title={onInviteEmail ? undefined : '이메일 초대는 준비 중입니다'}
            className="w-full sm:w-auto"
          >
            {submitting ? '초대 보내는 중…' : '이메일로 초대'}
          </TeamCreateButton>
        </footer>
      </form>
    </dialog>
  )
}
