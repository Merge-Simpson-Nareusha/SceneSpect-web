import { useEffect, useId, useRef, useState } from 'react'
import { commonStyles } from '../common/styles'
import type { ProjectApprovalRequest, ProjectSettingsValue } from './types'

export type ProjectSettingsDialogProps = {
  open: boolean
  onClose: () => void
  value: ProjectSettingsValue
  onChange: (value: ProjectSettingsValue) => void
  onSave: (value: ProjectSettingsValue) => void
  onImageChange: (file: File) => void
  teamName: string
  statusLabel: string
  approvalRequests: ProjectApprovalRequest[]
  avatarLabel?: string
  reviewerName?: string
  onDeleteRequest?: () => void
  initialView?: 'info' | 'approval'
  saving?: boolean
  saveError?: string
}

export default function ProjectSettingsDialog({
  open,
  onClose,
  value,
  onChange,
  onSave,
  onImageChange,
  teamName,
  statusLabel,
  approvalRequests,
  avatarLabel,
  reviewerName,
  onDeleteRequest,
  initialView = 'info',
  saving = false,
  saveError,
}: ProjectSettingsDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const infoTabRef = useRef<HTMLButtonElement>(null)
  const approvalTabRef = useRef<HTMLButtonElement>(null)
  const saveErrorRef = useRef<HTMLParagraphElement>(null)
  const [view, setView] = useState(initialView)
  const [nameError, setNameError] = useState('')
  const id = useId()

  useEffect(() => {
    if (!open) return
    const dialog = dialogRef.current
    if (!dialog) return
    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      if (previousFocus?.isConnected) previousFocus.focus()
    }
  }, [open])

  useEffect(() => {
    if (open && saveError) saveErrorRef.current?.focus()
  }, [open, saveError])

  if (!open) return null

  const changeView = (next: 'info' | 'approval', focusTab = false) => {
    if (saving) return
    setView(next)
    if (focusTab) {
      if (next === 'info') infoTabRef.current?.focus()
      else approvalTabRef.current?.focus()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={`${id}-title`}
      onCancel={(event) => {
        event.preventDefault()
        if (!saving) onClose()
      }}
      className="m-auto max-h-[calc(100svh-32px)] w-[860px] max-w-[calc(100vw-32px)] overflow-y-auto rounded-[11px] border border-[#e3e6eb] bg-white p-0 text-[#16181d] backdrop:bg-black/40"
    >
      <form
        noValidate
        aria-busy={saving}
        onSubmit={(event) => {
          event.preventDefault()
          if (saving || view !== 'info') return
          if (!value.name.trim()) {
            setNameError('프로젝트 이름을 입력해 주세요.')
            event.currentTarget
              .querySelector<HTMLInputElement>('input[name="project-name"]')
              ?.focus()
            return
          }
          setNameError('')
          onSave(value)
        }}
        className="flex min-h-[720px] flex-col gap-[13px] px-[clamp(18px,4vw,32px)] pt-[26px] pb-[22px]"
      >
        <header className="flex min-h-[54px] items-center justify-between gap-[16px]">
          <h2 id={`${id}-title`} className="text-[28px] font-semibold">
            프로젝트 설정
          </h2>
          <button
            type="button"
            aria-label="프로젝트 설정 닫기"
            onClick={onClose}
            disabled={saving}
            className={`flex size-[35px] shrink-0 cursor-pointer items-center justify-center text-[27px] text-[#6b7280] disabled:cursor-wait ${commonStyles.focus}`}
          >
            ×
          </button>
        </header>
        <div className="h-px shrink-0 bg-[#e3e6eb]" aria-hidden="true" />
        <div
          role="tablist"
          aria-label="프로젝트 설정 항목"
          className="flex min-h-[46px] gap-[29px]"
          onKeyDown={(event) => {
            if (saving) return
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
            event.preventDefault()
            const next =
              event.key === 'Home'
                ? 'info'
                : event.key === 'End'
                  ? 'approval'
                  : view === 'info'
                    ? 'approval'
                    : 'info'
            changeView(next, true)
          }}
        >
          <button
            ref={infoTabRef}
            id={`${id}-info-tab`}
            type="button"
            role="tab"
            aria-selected={view === 'info'}
            aria-controls={view === 'info' ? `${id}-panel` : undefined}
            tabIndex={view === 'info' ? 0 : -1}
            disabled={saving}
            onClick={() => changeView('info')}
            className={`w-[102px] cursor-pointer border-b-[2px] text-[16px] disabled:cursor-wait ${view === 'info' ? 'border-[#2563eb] font-semibold text-[#2563eb]' : 'border-transparent font-medium text-[#6b7280]'} ${commonStyles.focus}`}
          >
            기본 정보
          </button>
          <button
            ref={approvalTabRef}
            id={`${id}-approval-tab`}
            type="button"
            role="tab"
            aria-selected={view === 'approval'}
            aria-controls={view === 'approval' ? `${id}-panel` : undefined}
            tabIndex={view === 'approval' ? 0 : -1}
            disabled={saving}
            onClick={() => changeView('approval')}
            className={`w-[125px] cursor-pointer border-b-[2px] text-[16px] disabled:cursor-wait ${view === 'approval' ? 'border-[#2563eb] font-semibold text-[#2563eb]' : 'border-transparent font-medium text-[#6b7280]'} ${commonStyles.focus}`}
          >
            승인 및 관리
          </button>
        </div>

        <div
          id={`${id}-panel`}
          role="tabpanel"
          aria-labelledby={`${id}-${view}-tab`}
          className="flex flex-1 flex-col gap-[13px]"
        >
          {view === 'info' ? (
            <>
              <div className="flex min-h-[80px] items-center gap-[15px]">
                <div className="flex size-[58px] shrink-0 items-center justify-center overflow-hidden rounded-[11px] bg-[#2563eb] text-[25px] font-medium text-white">
                  {value.imageUrl ? (
                    <img
                      src={value.imageUrl}
                      alt="현재 프로젝트 대표 이미지"
                      className="size-full object-cover"
                    />
                  ) : (
                    avatarLabel || value.name.trim().charAt(0).toUpperCase() || 'P'
                  )}
                </div>
                <div className="min-w-0 flex-1 space-y-[6px]">
                  <p className="text-[16px] font-semibold">대표 이미지</p>
                  <p className="text-[13px] text-[#6b7280]">프로젝트 목록에 표시됩니다.</p>
                </div>
                <input
                  ref={imageInputRef}
                  type="file"
                  disabled={saving}
                  accept="image/*"
                  aria-label="프로젝트 대표 이미지 선택"
                  tabIndex={-1}
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file && !saving) onImageChange(file)
                    event.target.value = ''
                  }}
                />
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => imageInputRef.current?.click()}
                  className={`h-[40px] w-[100px] shrink-0 cursor-pointer rounded-[8px] border border-[#e3e6eb] text-[14px] font-semibold disabled:cursor-wait ${commonStyles.focus}`}
                >
                  변경
                </button>
              </div>
              <label className="flex flex-col gap-[7px] text-[15px] font-semibold">
                프로젝트 이름
                <input
                  name="project-name"
                  value={value.name}
                  disabled={saving}
                  onChange={(event) => {
                    setNameError('')
                    onChange({ ...value, name: event.target.value })
                  }}
                  aria-invalid={Boolean(nameError)}
                  aria-describedby={nameError ? `${id}-name-error` : undefined}
                  placeholder="프로젝트 이름"
                  className={`h-[48px] w-full rounded-[6px] border border-[#e3e6eb] px-[14px] text-[14px] font-normal placeholder:text-[#6b7280] disabled:cursor-wait ${commonStyles.focus}`}
                />
                {nameError && (
                  <span id={`${id}-name-error`} role="alert" className="text-[12px] text-[#e64c50]">
                    {nameError}
                  </span>
                )}
              </label>
              <label className="flex flex-col gap-[7px] text-[15px] font-semibold">
                프로젝트 설명
                <textarea
                  value={value.description}
                  disabled={saving}
                  onChange={(event) => onChange({ ...value, description: event.target.value })}
                  placeholder="프로젝트 설명"
                  rows={2}
                  className={`h-[74px] w-full resize-y rounded-[6px] border border-[#e3e6eb] px-[14px] py-[12px] text-[14px] font-normal placeholder:text-[#6b7280] disabled:cursor-wait ${commonStyles.focus}`}
                />
              </label>
              <div className="grid gap-[20px] sm:grid-cols-2">
                <div className="space-y-[8px]">
                  <p className="text-[15px] font-semibold">소속 팀</p>
                  <p className="flex min-h-[46px] items-center rounded-[6px] bg-[#f8fafc] px-[14px] text-[14px] text-[#6b7280]">
                    {teamName}
                  </p>
                </div>
                <div className="space-y-[8px]">
                  <p className="text-[15px] font-semibold">프로젝트 상태</p>
                  <p className="flex min-h-[46px] items-center rounded-[6px] bg-[#f8fafc] px-[14px] text-[14px] text-[#6b7280]">
                    {statusLabel}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-[7px]">
                <h3 className="text-[20px] font-semibold">버전 승인</h3>
                <p className="text-[14px] text-[#6b7280]">
                  제출된 수정본은 승인 후 버전으로 기록됩니다.
                </p>
              </div>
              <div className="flex min-h-[73px] items-center justify-between gap-[12px]">
                <div className="space-y-[8px]">
                  <p className="text-[16px] font-semibold">승인 담당자</p>
                  {!reviewerName && (
                    <p className="text-[13px] text-[#6b7280]">팀에서 승인 권한을 정해야 합니다.</p>
                  )}
                </div>
                <span className="rounded-[6px] bg-[#f8fafc] px-[15px] py-[6px] text-[12px] text-[#6b7280]">
                  {reviewerName || '미정'}
                </span>
              </div>
              <div className="h-px shrink-0 bg-[#e3e6eb]" aria-hidden="true" />
              <div className="flex items-center justify-between">
                <h3 className="text-[19px] font-semibold">검토 요청</h3>
                <span className="text-[13px] text-[#6b7280]">{approvalRequests.length}건</span>
              </div>
              <div className="space-y-[10px]">
                {approvalRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex min-h-[84px] items-center justify-between gap-[12px] rounded-[8px] border border-[#e3e6eb] px-[17px]"
                  >
                    <div className="min-w-0 space-y-[7px]">
                      <p className="truncate text-[16px] font-semibold" title={request.title}>
                        {request.title}
                      </p>
                      <p
                        className="truncate text-[13px] text-[#6b7280]"
                        title={request.description}
                      >
                        {request.description}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-[6px] bg-[#fff7ec] px-[20px] py-[6px] text-[12px] font-medium text-[#a66a29]">
                      {request.statusLabel}
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-[7px]">
                <h3 className="text-[16px] font-semibold">버전 기록</h3>
                <p className="text-[13px] text-[#6b7280]">
                  승인된 수정본만 버전 목록에 추가됩니다.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="h-px shrink-0 bg-[#e3e6eb]" aria-hidden="true" />
        <div className="flex min-h-[38px] items-center justify-between gap-[12px]">
          <button
            type="button"
            onClick={onDeleteRequest}
            disabled={!onDeleteRequest || saving}
            className={`text-[14px] font-medium text-[#e64c50] disabled:cursor-not-allowed ${commonStyles.focus}`}
          >
            프로젝트 삭제
          </button>
          <span className="text-[12px] text-[#9ca3af]">
            {onDeleteRequest ? '' : '권한 정책 미정'}
          </span>
        </div>
        <div className="h-px shrink-0 bg-[#e3e6eb]" aria-hidden="true" />
        {saveError && (
          <p ref={saveErrorRef} role="alert" tabIndex={-1} className="text-[13px] text-[#e64c50]">
            {saveError}
          </p>
        )}
        <footer className="flex min-h-[45px] justify-end gap-[10px]">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className={`h-[44px] w-[105px] cursor-pointer rounded-[8px] border border-[#e3e6eb] text-[14px] font-semibold disabled:cursor-wait ${commonStyles.focus}`}
          >
            {view === 'info' ? '취소' : '닫기'}
          </button>
          {view === 'info' && (
            <button
              type="submit"
              disabled={saving}
              className={`h-[44px] w-[112px] cursor-pointer rounded-[8px] bg-[#2563eb] text-[14px] font-semibold text-white disabled:cursor-wait disabled:opacity-60 ${commonStyles.focus}`}
            >
              {saving ? '저장 중' : '저장'}
            </button>
          )}
        </footer>
      </form>
    </dialog>
  )
}
