import type { ButtonHTMLAttributes } from 'react'
import { commonStyles } from '../common/styles'
import type { TeamSort } from './types'
import { sortOptions } from './sortOptions'
import TeamSortIcon from './TeamSortIcon'
import check from '../../assets/icons/team/sort-check.svg'

export type TeamSortItemProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  sort: TeamSort
  selected?: boolean
}

export default function TeamSortItem({
  sort,
  selected = false,
  className = '',
  ...props
}: TeamSortItemProps) {
  const option = sortOptions.find((item) => item.value === sort)!
  return (
    <button
      {...props}
      type="button"
      role="menuitemradio"
      aria-checked={selected}
      className={`flex h-[44px] w-full cursor-pointer items-center justify-between rounded-[8px] px-[8px] text-left text-[16px] leading-[normal] font-medium disabled:cursor-not-allowed disabled:opacity-50 ${selected ? 'bg-[#eaf1ff] text-[#2563eb]' : 'text-[#16181d] focus-visible:bg-[#f3f7ff] enabled:hover:bg-[#f3f7ff]'} ${commonStyles.focus} ${className}`}
    >
      <span className="flex items-center gap-[8px]">
        <TeamSortIcon sort={sort} selected={selected} />
        {option.label}
      </span>
      {selected && (
        <span className="relative h-[12px] w-[16px] shrink-0" aria-hidden="true">
          <img src={check} alt="" className="absolute -top-[1px] -left-[1px] h-[12px] w-[16px] max-w-none" />
        </span>
      )}
    </button>
  )
}
