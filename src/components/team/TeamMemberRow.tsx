import { commonStyles } from '../common/styles'
import type { TeamMember } from './types'
import more from '../../assets/icons/team/member-more.svg'

export type TeamMemberRowProps = {
  member: TeamMember
  onMenuClick?: (member: TeamMember) => void
  disabled?: boolean
  className?: string
}

export default function TeamMemberRow({
  member,
  onMenuClick,
  disabled = false,
  className = '',
}: TeamMemberRowProps) {
  return (
    <div
      className={`flex min-h-[50px] w-full items-center justify-between gap-[20px] leading-[normal] tracking-[-0.04em] ${className}`}
    >
      <div className="flex min-w-0 items-center gap-[6px]">
        <span className="flex size-[50px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1142b0] text-[24px] font-semibold text-white">
          {member.avatarSrc ? (
            <img src={member.avatarSrc} alt="" className="size-full object-cover" />
          ) : (
            member.name.slice(0, 1)
          )}
        </span>
        <div className="flex min-w-0 flex-col gap-[2px] font-semibold">
          <p className="text-[20px] wrap-anywhere text-black">{member.name}</p>
          <p className="text-[14px] text-[#6b7280]">{member.role}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-[20px]">
        <p className="text-[26px] font-medium text-[#6b7280]">{member.role}</p>
        {member.showMenu !== false && onMenuClick && (
          <button
            type="button"
            aria-label={`${member.name} 멤버 메뉴`}
            disabled={disabled}
            onClick={() => onMenuClick(member)}
            className={`flex min-h-[40px] w-[26px] cursor-pointer items-center justify-center rounded-[8px] disabled:cursor-not-allowed disabled:opacity-50 ${commonStyles.focus}`}
          >
            <img src={more} alt="" className="max-w-none shrink-0" />
          </button>
        )}
      </div>
    </div>
  )
}
