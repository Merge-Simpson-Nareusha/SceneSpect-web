import type { ButtonHTMLAttributes } from 'react'
import { commonStyles } from '../common/styles'
import plus from '../../assets/icons/team/plus.svg'
import invitePlus from '../../assets/icons/team/invite-plus.svg'

export type TeamCreateButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: 'default' | 'large'
  icon?: 'plus' | 'invite'
}

export default function TeamCreateButton({
  children = '새 팀',
  size = 'default',
  icon = 'plus',
  type = 'button',
  className = '',
  ...props
}: TeamCreateButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={`inline-flex shrink-0 cursor-pointer items-center justify-center gap-[8px] rounded-[8px] bg-[#2563eb] font-semibold tracking-[-0.04em] whitespace-nowrap text-white transition-colors enabled:hover:bg-[#3d7af2] disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none ${size === 'large' ? `h-[60px] text-[24px] ${icon === 'invite' ? 'min-w-[151px] px-[20px]' : 'px-[30px]'}` : 'h-[50px] min-w-[102px] px-[22px] text-[19px]'} ${commonStyles.focus} ${className}`}
    >
      <span className="flex size-[14px] shrink-0 items-center justify-center" aria-hidden="true">
        <img src={icon === 'invite' ? invitePlus : plus} alt="" className="max-w-none shrink-0" />
      </span>
      {children}
    </button>
  )
}
