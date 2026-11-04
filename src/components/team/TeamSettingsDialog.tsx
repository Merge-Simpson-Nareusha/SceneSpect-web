import { useEffect, useId, useRef, useState } from 'react'
import { commonStyles } from '../common/styles'
import TeamCreateButton from './TeamCreateButton'
import TeamMemberRow from './TeamMemberRow'
import type { TeamDetails, TeamMember } from './types'
import close from '../../assets/icons/team/close.svg'
import edit from '../../assets/icons/team/avatar-edit.svg'
import separator from '../../assets/icons/team/separator.svg'
import transferArrow from '../../assets/icons/team/transfer-arrow.svg'

export type TeamSettingsDialogProps = {
  open: boolean
  onClose: () => void
  value: TeamDetails
  onChange: (value: TeamDetails) => void
  onSave: (value: TeamDetails) => void
  members: TeamMember[]
  onAvatarChange: (file: File) => void
  onInvite: () => void
  onMemberMenu: (member: TeamMember) => void
  onTransferRequest: () => void
  onDeleteRequest: () => void
  initialView?: 'info' | 'members'
  saving?: boolean
  saveError?: string
}

function Divider() {
  return (
    <div className="h-[2px] w-full overflow-hidden" aria-hidden="true">
      <img src={separator} alt="" className="max-w-none -translate-y-[1px]" />
    </div>
  )
}

const fields = [
  { key: 'name', label: '팀 이름', placeholder: '팀 이름', required: true },
  { key: 'description', label: '팀 설명', placeholder: '팀 설명을 입력해 주세요', required: false },
  {
    key: 'youtubeUrl',
    label: '팀 유튜브 링크',
    placeholder: '유튜브 채널 링크를 입력해 주세요',
    required: false,
  },
  {
    key: 'guidelines',
    label: '팀 가이드라인',
    placeholder: '팀의 프로젝트에서 AI의 판단기준을 입력하세요',
    required: true,
  },
] as const

type FieldError = { field: (typeof fields)[number]['key']; message: string }

function validateDetails(value: TeamDetails): FieldError | null {
  for (const field of fields) {
    if (field.required && !value[field.key].trim()) {
      return { field: field.key, message: `${field.label}을 입력해 주세요.` }
    }
    if (field.key === 'youtubeUrl' && value.youtubeUrl.trim()) {
      try {
        new URL(value.youtubeUrl)
      } catch {
        return { field: 'youtubeUrl', message: '유효한 팀 유튜브 링크를 입력해 주세요.' }
      }
    }
  }
  return null
}

function SettingsContent({
  onClose,
  value,
  onChange,
  onSave,
  members,
  onAvatarChange,
  onInvite,
  onMemberMenu,
  onTransferRequest,
  onDeleteRequest,
  initialView = 'info',
  saving = false,
  saveError,
}: Omit<TeamSettingsDialogProps, 'open'>) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const saveErrorRef = useRef<HTMLParagraphElement>(null)
  const [view, setView] = useState(initialView)
  const [validationError, setValidationError] = useState<FieldError | null>(null)
  const id = useId()

  useEffect(() => {
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
  }, [])

  useEffect(() => {
    if (validationError && view === 'info') {
      document.getElementById(`${id}-${validationError.field}`)?.focus()
    }
  }, [id, validationError, view])

  useEffect(() => {
    if (saveError) saveErrorRef.current?.focus()
  }, [saveError])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-help`}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return
        const dialog = event.currentTarget
        const controls = [
          ...dialog.querySelectorAll<HTMLElement>(
            'button:not(:disabled):not([tabindex="-1"]), input:not(:disabled):not([tabindex="-1"]), textarea:not(:disabled):not([tabindex="-1"]), a[href], [tabindex="0"]',
          ),
        ].filter((element) => element.getClientRects().length > 0)
        const first = controls[0]
        const last = controls.at(-1)
        if (!first || !last) {
          event.preventDefault()
          return
        }
        if (
          event.shiftKey &&
          (document.activeElement === first || document.activeElement === dialog)
        ) {
          event.preventDefault()
          last.focus()
        } else if (
          !event.shiftKey &&
          (document.activeElement === last || document.activeElement === dialog)
        ) {
          event.preventDefault()
          first.focus()
        }
      }}
      onCancel={(event) => {
        event.preventDefault()
        if (!saving) onClose()
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget || saving) return
        const bounds = event.currentTarget.getBoundingClientRect()
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          onClose()
      }}
      className="m-auto max-h-[calc(100svh-48px)] w-[1000px] max-w-[calc(100vw-48px)] overflow-y-auto rounded-[12px] border-2 border-[#e5e7eb] bg-white p-0 text-[#16181d] backdrop:bg-black/40"
    >
      <form
        noValidate
        className="flex flex-col gap-[20px] px-[20px] pt-[30px] pb-[40px]"
        aria-busy={saving}
        onSubmit={(event) => {
          event.preventDefault()
          if (saving) return
          const error = validateDetails(value)
          setValidationError(error)
          if (error) {
            setView('info')
            return
          }
          onSave(value)
        }}
      >
        <header className="flex items-center justify-between gap-[20px] pr-[20px] pl-[10px]">
          <div className="flex min-w-0 flex-col gap-[8px] leading-[normal] font-medium tracking-[-0.04em]">
            <h2 id={`${id}-title`} className="text-[44px]">
              팀 설정
            </h2>
            <p id={`${id}-help`} className="text-[26px] text-[#6b7280]">
              팀 정보와 멤버를 관리할 수 있습니다.
            </p>
          </div>
          <button
            type="button"
            aria-label="팀 설정 닫기"
            disabled={saving}
            onClick={onClose}
            className={`flex size-[44px] shrink-0 cursor-pointer items-center justify-end rounded-[8px] disabled:cursor-wait ${commonStyles.focus}`}
          >
            <img src={close} alt="" className="max-w-none shrink-0" />
          </button>
        </header>
        <div className="flex flex-col gap-[40px]">
          <div
            role="tablist"
            aria-label="팀 설정 항목"
            className="flex gap-[40px] border-b-2 border-[#e5e7eb] px-[10px]"
            onKeyDown={(event) => {
              const tabs = [
                ...event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
              ]
              const index = tabs.indexOf(document.activeElement as HTMLButtonElement)
              let next: number
              if (event.key === 'ArrowRight' || event.key === 'ArrowLeft')
                next = 1 - Math.max(0, index)
              else if (event.key === 'Home') next = 0
              else if (event.key === 'End') next = 1
              else return
              event.preventDefault()
              setView(next === 0 ? 'info' : 'members')
              tabs[next]?.focus()
            }}
          >
            {(['info', 'members'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                id={`${id}-${tab}-tab`}
                aria-selected={view === tab}
                aria-controls={view === tab ? `${id}-${tab}-panel` : undefined}
                tabIndex={view === tab ? 0 : -1}
                onClick={() => setView(tab)}
                className={`cursor-pointer border-b-2 px-[2px] py-[16px] text-[30px] leading-[normal] font-medium tracking-[-0.04em] ${view === tab ? 'border-[#2563eb] text-[#2563eb]' : 'border-transparent'} ${commonStyles.focus}`}
              >
                {tab === 'info' ? '기본 정보' : '멤버관리'}
              </button>
            ))}
          </div>
          {view === 'info' ? (
            <div
              role="tabpanel"
              id={`${id}-info-panel`}
              aria-labelledby={`${id}-info-tab`}
              className="flex flex-col gap-[40px]"
            >
              <div className="flex items-center gap-[10px] pr-[20px] pl-[10px]">
                <input
                  ref={avatarInputRef}
                  type="file"
                  disabled={saving}
                  accept="image/*"
                  aria-label="팀 프로필 이미지 선택"
                  className="sr-only"
                  tabIndex={-1}
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0]
                    if (file) onAvatarChange(file)
                    event.currentTarget.value = ''
                  }}
                />
                <button
                  type="button"
                  aria-label="팀 프로필 변경"
                  disabled={saving}
                  onClick={() => avatarInputRef.current?.click()}
                  className={`group/avatar relative flex size-[80px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[12px] bg-[#2563eb] text-[40px] leading-[normal] font-medium text-white enabled:hover:bg-[#6b98f0] enabled:focus-visible:bg-[#6b98f0] ${commonStyles.focus}`}
                >
                  <span className="group-enabled/avatar:group-hover/avatar:opacity-10 group-enabled/avatar:group-focus-visible/avatar:opacity-10">
                    {value.avatarSrc ? (
                      <img src={value.avatarSrc} alt="" className="size-[80px] object-cover" />
                    ) : (
                      value.name.trim().slice(0, 1) || 'S'
                    )}
                  </span>
                  <img
                    src={edit}
                    alt=""
                    className="absolute hidden max-w-none group-enabled/avatar:group-hover/avatar:block group-enabled/avatar:group-focus-visible/avatar:block"
                  />
                </button>
                <div className="leading-[normal] font-medium tracking-[-0.02em]">
                  <p className="text-[30px]">팀 프로필</p>
                  <p className="text-[20px] text-[#6b7280]">목록에 표시되는 팀 아이콘</p>
                </div>
              </div>
              {fields.map((field) => (
                <div
                  key={field.key}
                  className={`flex flex-col gap-[6px] px-[10px] ${field.key === 'guidelines' ? 'min-h-[180px]' : 'min-h-[100px]'}`}
                >
                  <div className="flex items-center justify-between gap-[16px] leading-[normal] font-medium">
                    <label
                      htmlFor={`${id}-${field.key}`}
                      className="text-[30px] tracking-[-0.04em]"
                    >
                      {field.label}
                    </label>
                    <span className="text-[20px] tracking-[-0.02em] text-[#b0b0b0]">
                      {field.required ? '필수' : '선택'}
                    </span>
                  </div>
                  {field.key === 'guidelines' ? (
                    <textarea
                      id={`${id}-${field.key}`}
                      required
                      aria-invalid={validationError?.field === field.key || undefined}
                      aria-describedby={
                        validationError?.field === field.key
                          ? `${id}-${field.key}-error`
                          : undefined
                      }
                      disabled={saving}
                      placeholder={field.placeholder}
                      value={value[field.key]}
                      onChange={(event) => {
                        onChange({ ...value, [field.key]: event.currentTarget.value })
                        setValidationError(null)
                      }}
                      className={`min-h-[138px] w-full shrink-0 resize-y rounded-[4px] border border-[#ececec] p-[20px] text-[20px] leading-[normal] tracking-[-0.04em] placeholder:text-[#b0b0b0] aria-invalid:border-[#ef4444] ${commonStyles.focus}`}
                    />
                  ) : (
                    <input
                      id={`${id}-${field.key}`}
                      type={field.key === 'youtubeUrl' ? 'url' : 'text'}
                      required={field.required}
                      aria-invalid={validationError?.field === field.key || undefined}
                      aria-describedby={
                        validationError?.field === field.key
                          ? `${id}-${field.key}-error`
                          : undefined
                      }
                      disabled={saving}
                      placeholder={field.placeholder}
                      value={value[field.key]}
                      onChange={(event) => {
                        onChange({ ...value, [field.key]: event.currentTarget.value })
                        setValidationError(null)
                      }}
                      className={`h-[58px] w-full shrink-0 rounded-[4px] border border-[#ececec] px-[20px] text-[20px] leading-[normal] tracking-[-0.04em] placeholder:text-[#b0b0b0] aria-invalid:border-[#ef4444] ${commonStyles.focus}`}
                    />
                  )}
                  {validationError?.field === field.key && (
                    <p
                      id={`${id}-${field.key}-error`}
                      role="alert"
                      className="text-[18px] leading-[normal] text-[#ef4444]"
                    >
                      {validationError.message}
                    </p>
                  )}
                </div>
              ))}
              <Divider />
              <button
                type="button"
                disabled={saving}
                onClick={onDeleteRequest}
                className={`w-max cursor-pointer px-[20px] text-[30px] leading-[normal] font-medium tracking-[-0.02em] text-[#ef4444] disabled:cursor-wait ${commonStyles.focus}`}
              >
                팀 삭제
              </button>
              <Divider />
            </div>
          ) : (
            <div
              role="tabpanel"
              id={`${id}-members-panel`}
              aria-labelledby={`${id}-members-tab`}
              className="flex flex-col gap-[40px]"
            >
              <div className="flex items-center justify-between gap-[20px] px-[10px]">
                <h3 className="flex gap-[10px] text-[30px] leading-[normal] font-semibold tracking-[-0.04em] text-black">
                  팀 멤버<span className="text-[#6b7280]">{members.length}명</span>
                </h3>
                <TeamCreateButton size="large" icon="invite" onClick={onInvite} disabled={saving}>
                  팀원 초대
                </TeamCreateButton>
              </div>
              <ul className="flex flex-col gap-[40px] rounded-[12px] border-2 border-[#e5e7eb] p-[40px]">
                {members.map((member) => (
                  <li key={member.id}>
                    <TeamMemberRow member={member} disabled={saving} onMenuClick={onMemberMenu} />
                  </li>
                ))}
                {members.length === 0 && (
                  <li className="text-[20px] text-[#6b7280]">아직 등록된 팀 멤버가 없습니다.</li>
                )}
              </ul>
              <Divider />
              <button
                type="button"
                disabled={saving}
                onClick={onTransferRequest}
                className={`flex w-full cursor-pointer items-center justify-between gap-[20px] text-left leading-[normal] font-medium tracking-[-0.04em] disabled:cursor-wait ${commonStyles.focus}`}
              >
                <span className="flex flex-col gap-[10px]">
                  <span className="text-[30px] text-black">팀장 이관</span>
                  <span className="text-[20px] text-[#6b7280]">이관 조건은 팀 협의 후 결정</span>
                </span>
                <img src={transferArrow} alt="" className="max-w-none -scale-y-100 rotate-180" />
              </button>
              <Divider />
            </div>
          )}
          {saveError && (
            <p
              ref={saveErrorRef}
              role="alert"
              tabIndex={-1}
              className={`px-[10px] text-[18px] text-[#ef4444] ${commonStyles.focus}`}
            >
              {saveError}
            </p>
          )}
          <footer className="flex items-center justify-end gap-[20px]">
            <button
              type="button"
              disabled={saving}
              onClick={onClose}
              className={`flex h-[60px] cursor-pointer items-center justify-center rounded-[8px] border border-[#e3e6eb] bg-white px-[28px] text-[24px] leading-[normal] font-medium tracking-[-0.04em] enabled:hover:bg-[#f6f7f9] disabled:cursor-wait ${commonStyles.focus}`}
            >
              취소
            </button>
            <TeamCreateButton type="submit" size="large" disabled={saving}>
              {saving ? '저장 중' : '변경사항 저장'}
            </TeamCreateButton>
          </footer>
        </div>
      </form>
    </dialog>
  )
}

export default function TeamSettingsDialog({ open, ...props }: TeamSettingsDialogProps) {
  return open ? <SettingsContent {...props} /> : null
}
