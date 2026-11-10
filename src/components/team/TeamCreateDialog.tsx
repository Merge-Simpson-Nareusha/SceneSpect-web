import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import TeamCreateButton from './TeamCreateButton'

export type TeamCreateInput = {
  name: string
  description: string
}

export type TeamCreateDialogProps = {
  open: boolean
  onClose: () => void
  onCreate: (team: TeamCreateInput) => void
  onJoin?: (inviteCode: string) => void
}

type DialogView = 'choice' | 'create' | 'join'

export default function TeamCreateDialog({
  open,
  onClose,
  onCreate,
  onJoin,
}: TeamCreateDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [view, setView] = useState<DialogView>('choice')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const id = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const close = () => {
    setView('choice')
    setName('')
    setDescription('')
    setInviteCode('')
    onClose()
  }

  const goToChoice = () => {
    setView('choice')
  }

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedName = name.trim()
    if (!normalizedName) return

    onCreate({ name: normalizedName, description: description.trim() })
    setView('choice')
    setName('')
    setDescription('')
    setInviteCode('')
  }

  const handleJoin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedCode = inviteCode.trim()
    if (!normalizedCode) return

    if (onJoin) {
      onJoin(normalizedCode)
      return
    }
    console.info('팀 참가 기능은 서버 연결 후 이용할 수 있습니다.')
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={`${id}-title`}
      onCancel={(event) => {
        event.preventDefault()
        close()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close()
      }}
      className="m-auto max-h-[calc(100svh-32px)] w-[560px] max-w-[calc(100vw-32px)] overflow-y-auto rounded-[16px] border border-[#e5e7eb] bg-white p-0 text-[#16181d] shadow-xl backdrop:bg-black/40"
    >
      {view === 'choice' ? (
        <div className="flex flex-col gap-6 p-6 sm:p-8">
          <header>
            <h2 id={`${id}-title`} className="text-2xl font-semibold">
              새 팀
            </h2>
            <p className="mt-2 text-sm text-[#737b88]">
              팀을 새로 만들거나 초대받은 팀에 참가하세요.
            </p>
          </header>
          <div className="grid grid-cols-1 gap-3 min-[500px]:grid-cols-2">
            <TeamCreateButton
              type="button"
              size="large"
              icon="none"
              onClick={() => setView('create')}
              className="w-full max-[499px]:h-[52px] max-[499px]:px-5 max-[499px]:text-[20px]"
            >
              새 팀 만들기
            </TeamCreateButton>
            <TeamCreateButton
              type="button"
              size="large"
              icon="none"
              onClick={() => {
                setView('join')
              }}
              className="w-full max-[499px]:h-[52px] max-[499px]:px-5 max-[499px]:text-[20px]"
            >
              새 팀 참가
            </TeamCreateButton>
          </div>
        </div>
      ) : view === 'create' ? (
        <form onSubmit={handleCreate} className="flex flex-col gap-6 p-6 sm:p-8">
          <header>
            <button
              type="button"
              onClick={goToChoice}
              className="mb-3 cursor-pointer text-sm font-medium text-[#2563eb] hover:underline"
            >
              ← 이전
            </button>
            <h2 id={`${id}-title`} className="text-2xl font-semibold">
              새 팀 만들기
            </h2>
            <p className="mt-2 text-sm text-[#737b88]">
              새 팀의 기본 정보를 입력해 주세요.
            </p>
          </header>
          <label htmlFor={`${id}-name`} className="flex flex-col gap-2 text-sm font-medium">
            팀 이름
            <input
              id={`${id}-name`}
              autoFocus
              required
              maxLength={60}
              value={name}
              onChange={(event) => setName(event.currentTarget.value)}
              placeholder="팀 이름을 입력해 주세요"
              className="h-12 rounded-lg border border-[#e3e6eb] px-4 text-base font-normal outline-none focus-visible:border-[#2563eb] focus-visible:ring-2 focus-visible:ring-[#2563eb]/20"
            />
          </label>
          <label htmlFor={`${id}-description`} className="flex flex-col gap-2 text-sm font-medium">
            팀 설명 <span className="font-normal text-[#8b929e]">선택</span>
            <textarea
              id={`${id}-description`}
              rows={4}
              maxLength={240}
              value={description}
              onChange={(event) => setDescription(event.currentTarget.value)}
              placeholder="팀 설명을 입력해 주세요"
              className="resize-y rounded-lg border border-[#e3e6eb] p-4 text-base font-normal outline-none focus-visible:border-[#2563eb] focus-visible:ring-2 focus-visible:ring-[#2563eb]/20"
            />
          </label>
          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <button
              type="button"
              onClick={goToChoice}
              className="h-11 cursor-pointer rounded-lg border border-[#e3e6eb] px-5 text-sm font-medium hover:bg-[#f6f7f9]"
            >
              이전
            </button>
            <button
              type="submit"
              className="h-11 cursor-pointer rounded-lg bg-[#2563eb] px-5 text-sm font-semibold text-white hover:bg-[#3d7af2]"
            >
              팀 만들기
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleJoin} className="flex flex-col gap-6 p-6 sm:p-8">
          <header>
            <button
              type="button"
              onClick={goToChoice}
              className="mb-3 cursor-pointer text-sm font-medium text-[#2563eb] hover:underline"
            >
              ← 이전
            </button>
            <h2 id={`${id}-title`} className="text-2xl font-semibold">
              새 팀 참가
            </h2>
            <p className="mt-2 text-sm text-[#737b88]">
              팀 초대 코드나 링크를 입력해 주세요.
            </p>
          </header>
          <label htmlFor={`${id}-invite-code`} className="flex flex-col gap-2 text-sm font-medium">
            초대 코드 또는 링크
            <input
              id={`${id}-invite-code`}
              autoFocus
              required
              value={inviteCode}
              onChange={(event) => setInviteCode(event.currentTarget.value)}
              placeholder="초대 코드 또는 링크를 입력해 주세요"
              className="h-12 rounded-lg border border-[#e3e6eb] px-4 text-base font-normal outline-none focus-visible:border-[#2563eb] focus-visible:ring-2 focus-visible:ring-[#2563eb]/20"
            />
          </label>
          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <button
              type="button"
              onClick={goToChoice}
              className="h-11 cursor-pointer rounded-lg border border-[#e3e6eb] px-5 text-sm font-medium hover:bg-[#f6f7f9]"
            >
              이전
            </button>
            <button
              type="submit"
              className="h-11 cursor-pointer rounded-lg bg-[#2563eb] px-5 text-sm font-semibold text-white hover:bg-[#3d7af2]"
            >
              팀 참가
            </button>
          </div>
        </form>
      )}
    </dialog>
  )
}
