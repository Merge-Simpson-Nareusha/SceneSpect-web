import type { TeamSort } from './types'
import { sortOptions } from './sortOptions'

export type TeamSortIconProps = {
  sort: TeamSort
  selected?: boolean
}

export default function TeamSortIcon({ sort, selected = false }: TeamSortIconProps) {
  const option = sortOptions.find((item) => item.value === sort)!
  return (
    <span className="relative block size-[30px] shrink-0" aria-hidden="true">
      <img
        src={selected ? option.selectedIcon : option.icon}
        alt=""
        className="absolute -top-[1px] -left-[1px] max-w-none"
      />
    </span>
  )
}
