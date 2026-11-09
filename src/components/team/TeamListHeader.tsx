import type { TeamSort } from './types'
import TeamSortButton from './TeamSortButton'
import TeamCreateButton from './TeamCreateButton'

export type TeamListHeaderProps = {
  title?: string
  sort: TeamSort
  onSortChange: (value: TeamSort) => void
  onCreate: () => void
  className?: string
}

export default function TeamListHeader({
  title = '내 팀',
  sort,
  onSortChange,
  onCreate,
  className = '',
}: TeamListHeaderProps) {
  return (
    <header
      className={`flex w-full items-start justify-between gap-[24px] px-[70px] py-[16px] text-[#16181d] ${className}`}
    >
      <h2 className="text-[32px] leading-[normal] font-semibold tracking-[-0.04em] max-md:text-[28px]">
        {title}
      </h2>
      <div className="flex shrink-0 items-center gap-[16px] max-md:gap-3">
        <TeamSortButton value={sort} onChange={onSortChange} />
        <TeamCreateButton onClick={onCreate} />
      </div>
    </header>
  )
}
