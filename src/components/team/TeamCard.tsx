import { commonStyles } from '../common/styles'
import type { TeamMember } from './types'
import avatar from '../../assets/icons/team/card-avatar.svg'
import more from '../../assets/icons/team/card-more.svg'
import memberPreview from '../../assets/icons/team/card-members.svg'
import arrow from '../../assets/icons/team/card-arrow.svg'

export type TeamCardProps = {
  name: string
  description: string
  memberCount: number
  role: string
  avatarSrc?: string
  members?: Pick<TeamMember, 'id' | 'name' | 'avatarSrc'>[]
  onOpen: () => void
  onSettings: () => void
  className?: string
}

export default function TeamCard({
  name,
  description,
  memberCount,
  role,
  avatarSrc,
  members,
  onOpen,
  onSettings,
  className = '',
}: TeamCardProps) {
  const visibleMembers = members?.slice(0, 5)
  const extraMembers = Math.max(0, memberCount - (visibleMembers?.length ?? 5))
  return (
    <article
      className={`group relative flex h-[244px] w-[400px] max-w-full flex-col gap-[12px] rounded-[12px] border border-[#e5e7eb] bg-white p-[4px] text-[#16181d] transition-colors focus-within:border-[#b7cbff] focus-within:bg-[#f8faff] hover:border-[#b7cbff] hover:bg-[#f8faff] motion-reduce:transition-none ${className}`}
    >
      <button
        type="button"
        aria-label={`${name} 팀 열기`}
        onClick={onOpen}
        className={`absolute inset-0 cursor-pointer rounded-[12px] ${commonStyles.focus}`}
      />
      <div className="pointer-events-none flex h-[64px] shrink-0 items-center justify-between px-[18px] py-[9px]">
        {avatarSrc ? (
          <img src={avatarSrc} alt="" className="size-[46px] rounded-full object-cover" />
        ) : (
          <img src={avatar} alt="" className="size-[46px] max-w-none shrink-0" />
        )}
        <button
          type="button"
          aria-label={`${name} 팀 설정`}
          onClick={onSettings}
          className={`pointer-events-auto relative z-10 flex size-[32px] translate-x-[5px] cursor-pointer items-center justify-center rounded-[8px] ${commonStyles.focus}`}
        >
          <img src={more} alt="" className="h-auto w-[22px] max-w-none shrink-0" />
        </button>
      </div>
      <div className="pointer-events-none flex min-h-0 flex-1 flex-col justify-between px-[18px] pb-[18px]">
        <div className="flex min-w-0 flex-col gap-[2px] leading-[normal] tracking-[-0.04em]">
          <h3 className="truncate text-[32px] font-medium max-sm:text-[26px]" title={name}>
            {name}
          </h3>
          <p className="line-clamp-2 text-[16px]" title={description}>
            {description}
          </p>
        </div>
        <div className="flex items-center gap-[4px]" aria-label={`팀 멤버 ${memberCount}명`}>
          {visibleMembers ? (
            <div className="flex -space-x-[10px]">
              {visibleMembers.map((member) => (
                <span
                  key={member.id}
                  title={member.name}
                  className="flex size-[30px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1142b0] text-[14px] text-white"
                >
                  {member.avatarSrc ? (
                    <img src={member.avatarSrc} alt="" className="size-full object-cover" />
                  ) : (
                    member.name.slice(0, 1)
                  )}
                </span>
              ))}
            </div>
          ) : (
            <img src={memberPreview} alt="" className="h-[30px] max-w-none shrink-0" />
          )}
          {extraMembers > 0 && (
            <span className="text-[14px] leading-[normal] tracking-[-0.04em]">+{extraMembers}</span>
          )}
        </div>
        <div className="flex items-center justify-between text-[16px] leading-[normal] tracking-[-0.04em]">
          <p>{role}</p>
          <span
            className="flex items-center gap-[2px] opacity-0 group-focus-within:opacity-100 group-hover:opacity-100"
            aria-hidden="true"
          >
            팀 열기
            <img src={arrow} alt="" className="max-w-none -scale-y-100 rotate-180" />
          </span>
        </div>
      </div>
    </article>
  )
}
