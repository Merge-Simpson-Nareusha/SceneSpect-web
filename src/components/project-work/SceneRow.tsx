export type SceneRowProps = {
  timecode: string
  duration: string
  title: string
  description: string
  onSelect: () => void
  className?: string
}

export default function SceneRow({
  timecode,
  duration,
  title,
  description,
  onSelect,
  className = '',
}: SceneRowProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex min-h-[91px] w-[402px] max-w-full cursor-pointer items-center gap-[14px] rounded-[9px] border border-[#e3e6eb] bg-white p-[14px] text-left hover:border-[#b9c9e7] ${commonStyles.focus} ${className}`}
    >
      <span className="flex h-[54px] w-[74px] shrink-0 flex-col items-center justify-center gap-[5px] rounded-[7px] bg-[#eff5ff] leading-none">
        <span className="text-[14px] font-semibold text-[#2563eb]">{timecode}</span>
        <span className="text-[11px] text-[#6b7280]">{duration}</span>
      </span>
      <span className="flex min-w-0 flex-col gap-[7px] leading-[normal]">
        <span className="truncate text-[15px] font-semibold text-[#16181d]" title={title}>
          {title}
        </span>
        <span className="line-clamp-2 text-[12px] text-[#6b7280]">{description}</span>
      </span>
    </button>
  )
}
import { commonStyles } from '../common/styles'
