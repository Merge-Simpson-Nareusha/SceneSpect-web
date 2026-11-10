import { useEffect, useId, useRef, useState } from 'react'
import { commonStyles } from '../common/styles'
import type { TeamSort } from './types'
import { sortOptions } from './sortOptions'
import TeamSortMenu from './TeamSortMenu'
import chevron from '../../assets/icons/team/sort-chevron.svg'

export type TeamSortButtonProps = {
  value: TeamSort
  onChange: (value: TeamSort) => void
}

export default function TeamSortButton({ value, onChange }: TeamSortButtonProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const selectedLabel = sortOptions.find((option) => option.value === value)!.label

  useEffect(() => {
    if (!open) return
    menuRef.current?.querySelector<HTMLButtonElement>('[aria-checked="true"]')?.focus()
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      setOpen(false)
      triggerRef.current?.focus()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div
      ref={rootRef}
      className="relative w-max shrink-0"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-label={`팀 정렬, 현재 ${selectedLabel}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen(!open)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            setOpen(true)
          }
        }}
        className={`flex h-[44px] min-w-[88px] cursor-pointer items-center justify-center gap-[6px] rounded-[8px] border border-[#e3e6eb] bg-white px-[16px] text-[16px] leading-[normal] font-medium tracking-[-0.04em] text-[#16181d] hover:border-[#d5d9e0] hover:bg-[#f6f7f9] ${commonStyles.focus}`}
      >
        정렬
        <span
          className={`relative h-[14px] w-[16px] shrink-0 ${open ? '-scale-y-100' : ''}`}
          aria-hidden="true"
        >
          <img src={chevron} alt="" className="absolute top-0 left-[0.722px] max-w-none" />
        </span>
      </button>
      {open && (
        <TeamSortMenu
          ref={menuRef}
          id={menuId}
          value={value}
          className="absolute top-[calc(100%+8px)] left-1/2 z-30 -translate-x-1/2 max-md:left-0 max-md:translate-x-0"
          onChange={(next) => {
            onChange(next)
            setOpen(false)
            triggerRef.current?.focus()
          }}
        />
      )}
    </div>
  )
}
