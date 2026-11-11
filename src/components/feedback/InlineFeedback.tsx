import type { ComponentProps } from 'react'
import FeedbackIcon from './FeedbackIcon'
import { commonStyles } from '../common/styles'

export type InlineFeedbackProps = Omit<ComponentProps<'div'>, 'children'> & {
  message?: string
  tone?: 'error' | 'warning' | 'success' | 'info'
  variant?: 'panel' | 'inline'
}

const tones = {
  error: 'border-[#f4cecb] bg-[#fff5f4] text-[#b42318]',
  warning: 'border-[#f3dfb0] bg-[#fffbef] text-[#8a5a12]',
  success: 'border-[#c9e7d8] bg-[#f0faf5] text-[#23724a]',
  info: 'border-[#d7e3fc] bg-[#f3f7ff] text-[#2856a9]',
}

export default function InlineFeedback({
  message,
  tone = 'error',
  variant = 'panel',
  className = '',
  ...props
}: InlineFeedbackProps) {
  if (!message) return null
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      aria-atomic="true"
      {...props}
      className={`flex min-w-0 items-start gap-[8px] text-[14px] leading-[21px] [overflow-wrap:anywhere] ${commonStyles.focus} ${tones[tone]} ${variant === 'panel' ? 'rounded-[8px] border px-[12px] py-[10px]' : 'border-0 bg-transparent!'} ${className}`}
    >
      <FeedbackIcon
        name={tone === 'success' ? 'check' : tone === 'info' ? 'info' : 'alert'}
        className="mt-[2px] size-[17px] shrink-0"
      />
      <span>{message}</span>
    </div>
  )
}
