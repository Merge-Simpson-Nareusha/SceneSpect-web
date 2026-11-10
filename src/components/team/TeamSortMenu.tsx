import type { HTMLAttributes, Ref } from 'react'
import type { TeamSort } from './types'
import { sortOptions } from './sortOptions'
import TeamSortItem from './TeamSortItem'

export type TeamSortMenuProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  value: TeamSort
  onChange: (value: TeamSort) => void
  ref?: Ref<HTMLDivElement>
}

export default function TeamSortMenu({
  value,
  onChange,
  className = '',
  ref,
  ...props
}: TeamSortMenuProps) {
  return (
    <div
      {...props}
      ref={ref}
      role="menu"
      aria-label="팀 정렬 기준"
      className={`flex w-[300px] max-w-[calc(100vw-48px)] flex-col gap-[10px] rounded-[16px] border border-[#e2e6ec] bg-white p-[6px] ${className}`}
      onKeyDown={(event) => {
        props.onKeyDown?.(event)
        if (event.defaultPrevented) return
        const items = [
          ...event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]'),
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
    >
      {sortOptions.map((option) => (
        <TeamSortItem
          key={option.value}
          sort={option.value}
          selected={value === option.value}
          tabIndex={-1}
          onClick={() => onChange(option.value)}
        />
      ))}
    </div>
  )
}
