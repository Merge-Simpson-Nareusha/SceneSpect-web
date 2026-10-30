import { useEffect, useId, useRef, useState } from 'react'
import { commonStyles } from './styles'
import userIcon from '../../assets/icons/navigation/user.svg'
import chevron from '../../assets/icons/navigation/chevron.svg'
import profileIcon from '../../assets/icons/common/profile.svg'
import settingsIcon from '../../assets/icons/common/settings.svg'
import logoutIcon from '../../assets/icons/common/logout.svg'
import divider from '../../assets/icons/common/divider.svg'

type AccountStateProps =
  | { open: boolean; onOpenChange: (open: boolean) => void }
  | { open?: undefined; onOpenChange?: never }

export type AccountButtonProps = AccountStateProps & {
  userName: string
  email: string
  profileHref: string
  settingsHref: string
  onLogout: () => void
  size?: 'default' | 'design'
  align?: 'start' | 'end'
  previewState?: 'default' | 'hover'
}

/** API 호출 없이 부모가 전달한 링크와 로그아웃 콜백을 사용하는 계정 뷰. */
export default function AccountButton({
  userName,
  email,
  profileHref,
  settingsHref,
  onLogout,
  size = 'default',
  align = 'start',
  open,
  onOpenChange,
  previewState = 'default',
}: AccountButtonProps) {
  const [localOpen, setLocalOpen] = useState(false)
  const expanded = open ?? localOpen
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()
  const displayName = userName.trim() || '사용자'
  const setOpen = (value: boolean) => {
    if (open === undefined) setLocalOpen(value)
    onOpenChange?.(value)
  }

  useEffect(() => {
    if (!expanded) return
    const close = () => {
      if (open === undefined) setLocalOpen(false)
      onOpenChange?.(false)
    }
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) close()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [expanded, open, onOpenChange])

  const focusClasses = commonStyles.focus
  const originalSize = size === 'design'
  const rowClasses = `flex min-h-[40px] w-full items-center gap-[12px] ${commonStyles.controlRadius} px-[10px] text-left ${originalSize ? 'text-[20px] leading-[28px]' : 'text-[16px] leading-[24px]'} transition-colors hover:bg-[#f1f5f9] motion-reduce:transition-none ${focusClasses}`
  return (
    <div
      ref={rootRef}
      className="relative w-max max-w-[min(280px,100%)] min-w-0 text-[#16181d]"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-label={`${displayName} 계정 메뉴`}
        title={displayName}
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setOpen(!expanded)}
        className={`flex w-full min-w-0 cursor-pointer items-center gap-[10px] ${commonStyles.controlRadius} py-[8px] transition-colors hover:bg-[#e2e8f0] motion-reduce:transition-none ${previewState === 'hover' ? 'bg-[#e2e8f0]' : 'bg-[#f1f5f9]'} ${originalSize ? 'min-h-[49px] px-[16px] text-[28px] leading-[33px] font-light' : 'min-h-[44px] px-[12px] text-[16px] leading-[24px] font-normal'} ${focusClasses}`}
      >
        <img
          src={userIcon}
          alt=""
          className={`${originalSize ? 'size-[23.5px]' : 'size-[20px]'} shrink-0`}
        />
        <span className="min-w-0 truncate text-left">{displayName}</span>
        <span
          className={`flex w-[16px] shrink-0 items-center justify-center transition-transform motion-reduce:transition-none ${expanded ? 'rotate-180' : ''}`}
        >
          <img
            src={chevron}
            alt=""
            className={`${originalSize ? 'h-[17.5px] w-[9.3px]' : 'h-[14px] w-[7.43px]'} rotate-90`}
          />
        </span>
      </button>
      <div
        id={panelId}
        hidden={!expanded}
        aria-label="계정 옵션"
        className={`absolute top-[calc(100%+11px)] z-30 flex w-max max-w-[min(420px,calc(100vw-48px))] flex-col gap-[20px] ${commonStyles.controlRadius} border border-[#f1f5f9] bg-white p-[16px] ${align === 'end' ? 'right-0' : 'left-0'} ${originalSize ? 'min-w-[225px]' : 'min-w-[260px]'}`}
      >
        <div className="flex items-center gap-[10px] py-[2px]">
          <div aria-hidden="true" className="size-[50px] shrink-0 rounded-full bg-[#f1f5f9]" />
          <div className="min-w-0">
            <p
              className={`${originalSize ? 'text-[28px] leading-[34px]' : 'text-[18px] leading-[26px] font-normal'} [overflow-wrap:anywhere]`}
            >
              {displayName}
            </p>
            <p className="mt-[2px] text-[12px] leading-[18px] font-light [overflow-wrap:anywhere] text-[#807d7d]">
              {email}
            </p>
          </div>
        </div>
        <img src={divider} alt="" className="h-px w-full" />
        <a href={profileHref} onClick={() => setOpen(false)} className={rowClasses}>
          <img src={profileIcon} alt="" className="h-[17.5px] w-[14.5px] shrink-0" />
          마이페이지
        </a>
        <a href={settingsHref} onClick={() => setOpen(false)} className={rowClasses}>
          <img src={settingsIcon} alt="" className="h-[17.5px] w-[15.8px] shrink-0" />
          설정
        </a>
        <img src={divider} alt="" className="h-px w-full" />
        <button
          type="button"
          className={`${rowClasses} cursor-pointer text-[#ef4444]`}
          onClick={() => {
            setOpen(false)
            onLogout()
          }}
        >
          <img src={logoutIcon} alt="" className="size-[17.5px] shrink-0" />
          로그아웃
        </button>
      </div>
    </div>
  )
}
