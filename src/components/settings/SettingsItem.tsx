import { commonStyles } from '../common/styles'

export type SettingsItemProps = {
  title: string
  description: string
  actionLabel: string
  onAction: () => void
  className?: string
}

export default function SettingsItem({
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: SettingsItemProps) {
  return (
    <div
      className={`flex min-h-[78px] w-[782px] max-w-full items-center justify-between gap-[16px] bg-white px-[22px] ${className}`}
    >
      <div className="min-w-0 space-y-[7px] leading-[normal]">
        <p className="truncate text-[16px] font-medium text-[#171a21]" title={title}>
          {title}
        </p>
        <p className="truncate text-[13px] text-[#838a94]" title={description}>
          {description}
        </p>
      </div>
      <button
        type="button"
        onClick={onAction}
        className={`shrink-0 cursor-pointer text-[14px] font-medium text-[#2864e9] ${commonStyles.focus}`}
      >
        {actionLabel} <span aria-hidden="true">›</span>
      </button>
    </div>
  )
}
