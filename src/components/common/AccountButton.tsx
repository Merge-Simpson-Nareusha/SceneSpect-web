import { useEffect, useId, useRef, useState } from 'react'
import userIcon from '../../assets/icons/navigation/user.svg'
import chevron from '../../assets/icons/navigation/chevron.svg'
import profileIcon from '../../assets/icons/common/profile.svg'
import settingsIcon from '../../assets/icons/common/settings.svg'
import logoutIcon from '../../assets/icons/common/logout.svg'
import divider from '../../assets/icons/common/divider.svg'

export type AccountButtonProps = {
  userName?: string
  email?: string
  profileHref?: string
  settingsHref?: string
  onLogout?: () => void
  size?: 'design' | 'header'
  open?: boolean
  onOpenChange?: (open: boolean) => void
  previewState?: 'default' | 'hover'
}

/** API 호출 없이 부모가 전달한 링크와 로그아웃 콜백을 사용하는 계정 뷰. */
export default function AccountButton({
  userName = '이름임',
  email = 'example@gmail.com',
  profileHref = '#profile',
  settingsHref = '#settings',
  onLogout,
  size = 'design',
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

  const focusStyle =
    'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2962ff]'
  const rowStyle = `flex min-h-[40px] w-full items-center gap-[12px] rounded-[4px] px-[10px] text-left text-[20px] leading-[28px] hover:bg-[#f1f5f9] ${focusStyle}`
  return (
    <div
      ref={rootRef}
      className="relative min-w-0 text-[#16181d]"
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
        className={`flex max-w-full min-w-0 cursor-pointer items-center rounded-[5px] py-[8px] transition-colors hover:bg-[#e2e8f0] motion-reduce:transition-none ${expanded || previewState === 'hover' ? 'bg-[#e2e8f0]' : 'bg-[#f1f5f9]'} ${size === 'header' ? 'min-h-[44px] gap-[8px] px-[12px] text-[18px] leading-[26px]' : 'h-[49px] gap-[10px] px-[16px] text-[28px] leading-[33px] font-light'} ${focusStyle}`}
      >
        <img
          src={userIcon}
          alt=""
          className={`${size === 'header' ? 'size-[20px]' : 'size-[23.5px]'} shrink-0`}
        />
        <span className="min-w-0 truncate">{displayName}</span>
        <span
          className={`flex w-[16px] shrink-0 items-center justify-center transition-transform motion-reduce:transition-none ${expanded ? 'rotate-180' : ''}`}
        >
          <img src={chevron} alt="" className="h-[17.5px] w-[9.3px] rotate-90" />
        </span>
      </button>
      <div
        id={panelId}
        hidden={!expanded}
        aria-label="계정 옵션"
        className="absolute top-[calc(100%+11px)] right-0 z-30 w-[225px] rounded-[5px] border border-[#f1f5f9] bg-white p-[16px] shadow-sm"
      >
        <div className="flex items-center gap-[10px] py-[2px]">
          <div aria-hidden="true" className="size-[50px] shrink-0 rounded-full bg-[#f1f5f9]" />
          <div className="min-w-0">
            <p className="truncate text-[28px] leading-[34px]" title={displayName}>
              {displayName}
            </p>
            <p
              className="truncate text-[12px] leading-[18px] font-light text-[#807d7d]"
              title={email}
            >
              {email}
            </p>
          </div>
        </div>
        <img src={divider} alt="" className="my-[20px] h-px w-full" />
        <a href={profileHref} onClick={() => setOpen(false)} className={rowStyle}>
          <img src={profileIcon} alt="" className="h-[17.5px] w-[14.5px] shrink-0" />
          마이페이지
        </a>
        <a href={settingsHref} onClick={() => setOpen(false)} className={`${rowStyle} mt-[12px]`}>
          <img src={settingsIcon} alt="" className="h-[17.5px] w-[15.8px] shrink-0" />
          설정
        </a>
        <img src={divider} alt="" className="my-[20px] h-px w-full" />
        <button
          type="button"
          className={`${rowStyle} cursor-pointer text-[#ef4444]`}
          onClick={() => {
            setOpen(false)
            onLogout?.()
          }}
        >
          <img src={logoutIcon} alt="" className="size-[17.5px] shrink-0" />
          로그아웃
        </button>
      </div>
    </div>
  )
}
