import { useEffect, useId, useRef, useState } from 'react'
import { commonStyles } from '../common/styles'
import type { TeamMember } from './types'
import more from '../../assets/icons/team/member-more.svg'

const availableRoles = ['부팀장', '수정허용', '보기허용'] as const

export type TeamMemberRowProps = {
  member: TeamMember
  onMenuClick?: (member: TeamMember) => void
  onRoleChange?: (member: TeamMember, role: string) => void | Promise<void>
  onWarning?: (member: TeamMember) => void | Promise<void>
  onRemoveMember?: (member: TeamMember) => void | Promise<void>
  disabled?: boolean
  size?: 'default' | 'compact'
  className?: string
}

export default function TeamMemberRow({
  member,
  onMenuClick,
  onRoleChange,
  onWarning,
  onRemoveMember,
  disabled = false,
  size = 'default',
  className = '',
}: TeamMemberRowProps) {
  const compact = size === 'compact'
  const menuId = useId()
  const menuRootRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return
    const selectedRole = menuRef.current?.querySelector<HTMLButtonElement>(
      '[aria-checked="true"]',
    )
    const firstRole = menuRef.current?.querySelector<HTMLButtonElement>(
      '[role="menuitemradio"]',
    )
    if (selectedRole) selectedRole.focus()
    else firstRole?.focus()

    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !menuRootRef.current?.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      setMenuOpen(false)
      triggerRef.current?.focus()
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  return (
    <div
      className={`flex w-full items-center justify-between leading-[normal] tracking-[-0.04em] ${compact ? 'min-h-[40px] gap-[12px] max-sm:gap-2' : 'min-h-[50px] gap-[20px]'} ${className}`}
    >
      <div className={`flex min-w-0 items-center ${compact ? 'gap-[8px] max-sm:gap-1.5' : 'gap-[6px]'}`}>
        <span
          className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1142b0] font-semibold text-white ${compact ? 'size-[40px] text-[18px] max-sm:size-8 max-sm:text-[14px]' : 'size-[50px] text-[24px]'}`}
        >
          {member.avatarSrc ? (
            <img src={member.avatarSrc} alt="" className="size-full object-cover" />
          ) : (
            member.name.slice(0, 1)
          )}
        </span>
        <div className="flex min-w-0 flex-col gap-[2px] font-semibold">
          <p className={`${compact ? 'text-[16px] max-sm:text-[14px]' : 'text-[20px]'} wrap-anywhere text-black`}>
            {member.name}
          </p>
          <p className={`${compact ? 'max-sm:hidden text-[12px]' : 'text-[14px]'} text-[#6b7280]`}>
            {member.warningCount ? `${member.role} · 경고 ${member.warningCount}회` : member.role}
          </p>
        </div>
      </div>
      <div className={`flex shrink-0 items-center ${compact ? 'gap-[12px] max-sm:gap-2' : 'gap-[20px]'}`}>
        <p className={`${compact ? 'text-[16px] max-sm:text-[14px]' : 'text-[26px]'} font-medium text-[#6b7280]`}>
          {member.role}
        </p>
        {member.showMenu !== false && (onMenuClick || onRoleChange || onWarning || onRemoveMember) && (
          <div ref={menuRootRef} className="relative">
            <button
              ref={triggerRef}
              type="button"
              aria-label={`${member.name} 멤버 메뉴`}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-controls={menuOpen ? menuId : undefined}
              disabled={disabled}
              onClick={() => {
                if (onRoleChange || onWarning || onRemoveMember) setMenuOpen((current) => !current)
                else onMenuClick?.(member)
              }}
              onKeyDown={(event) => {
                if (
                  (!onRoleChange && !onWarning && !onRemoveMember) ||
                  (event.key !== 'ArrowDown' && event.key !== 'ArrowUp')
                ) return
                event.preventDefault()
                setMenuOpen(true)
              }}
              className={`flex cursor-pointer items-center justify-center rounded-[8px] disabled:cursor-not-allowed disabled:opacity-50 ${compact ? 'min-h-[32px] w-[24px] max-sm:w-5' : 'min-h-[40px] w-[26px]'} ${commonStyles.focus}`}
            >
              <img
                src={more}
                alt=""
                className={`max-w-none shrink-0 ${compact ? 'w-[18px]' : ''}`}
              />
            </button>
            {menuOpen && (onRoleChange || onWarning || onRemoveMember) && (
              <div
                ref={menuRef}
                id={menuId}
                role="menu"
                aria-label={`${member.name} 역할 선택`}
                onKeyDown={(event) => {
                  const items = [
                    ...event.currentTarget.querySelectorAll<HTMLButtonElement>(
                      'button[role^="menuitem"]',
                    ),
                  ]
                  const index = items.indexOf(document.activeElement as HTMLButtonElement)
                  let next: number
                  if (event.key === 'ArrowDown') next = (index + 1) % items.length
                  else if (event.key === 'ArrowUp')
                    next = index < 0 ? items.length - 1 : (index - 1 + items.length) % items.length
                  else if (event.key === 'Home') next = 0
                  else if (event.key === 'End') next = items.length - 1
                  else return
                  event.preventDefault()
                  items[next]?.focus()
                }}
                className="absolute top-[calc(100%+6px)] right-0 z-50 flex min-w-[160px] flex-col gap-1 rounded-[8px] border border-[#e2e6ec] bg-white p-1 shadow-lg"
              >
                {availableRoles.map((role) => (
                  <button
                    key={role}
                    type="button"
                    role="menuitemradio"
                    aria-checked={member.role === role}
                    onClick={() => {
                      void onRoleChange?.(member, role)
                      setMenuOpen(false)
                      triggerRef.current?.focus()
                    }}
                    className={`flex min-h-[40px] w-full cursor-pointer items-center rounded-[6px] px-3 text-left text-sm font-medium ${member.role === role ? 'bg-[#eaf1ff] text-[#2563eb]' : 'text-[#16181d] hover:bg-[#f3f7ff]'} ${commonStyles.focus}`}
                  >
                    {role}
                  </button>
                ))}
                {(onWarning || onRemoveMember) && (
                  <div role="separator" className="my-1 h-px bg-[#e2e6ec]" />
                )}
                {onWarning && (
                  <button
                    type="button"
                    role="menuitem"
                    disabled={disabled}
                    onClick={() => {
                      void onWarning(member)
                      setMenuOpen(false)
                      triggerRef.current?.focus()
                    }}
                    className={`flex min-h-[40px] w-full cursor-pointer items-center rounded-[6px] px-3 text-left text-sm font-medium text-[#16181d] hover:bg-[#f3f7ff] disabled:cursor-wait disabled:opacity-50 ${commonStyles.focus}`}
                  >
                    경고 1회 주기
                  </button>
                )}
                {onRemoveMember && (
                  <button
                    type="button"
                    role="menuitem"
                    disabled={disabled}
                    onClick={() => {
                      void onRemoveMember(member)
                      setMenuOpen(false)
                      triggerRef.current?.focus()
                    }}
                    className={`flex min-h-[40px] w-full cursor-pointer items-center rounded-[6px] px-3 text-left text-sm font-medium text-[#dc2626] hover:bg-[#fef2f2] disabled:cursor-wait disabled:opacity-50 ${commonStyles.focus}`}
                  >
                    팀에서 내보내기
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
