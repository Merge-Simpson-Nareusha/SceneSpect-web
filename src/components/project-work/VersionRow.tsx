import versionLayers from '../../assets/icons/project-work/version-layers.svg'
import { commonStyles } from '../common/styles'

export type VersionRowProps = {
  title: string
  detail: string
  isCurrent: boolean
  onSelect: () => void
  className?: string
}

export default function VersionRow({
  title,
  detail,
  isCurrent,
  onSelect,
  className = '',
}: VersionRowProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={isCurrent ? 'true' : undefined}
      className={`flex min-h-[94px] w-[402px] max-w-full cursor-pointer items-center gap-[13px] rounded-[9px] border border-[#e3e6eb] bg-white px-[16px] py-[12px] text-left hover:border-[#b9c9e7] ${commonStyles.focus} ${className}`}
    >
      <span className="flex size-[46px] shrink-0 items-center justify-center rounded-[8px] bg-[#eff5ff]">
        <img src={versionLayers} alt="" width="22" height="22" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-[7px] leading-[normal]">
        <span className="truncate text-[15px] font-semibold text-[#16181d]" title={title}>
          {title}
        </span>
        <span className="truncate text-[12px] text-[#6b7280]" title={detail}>
          {detail}
        </span>
      </span>
      {isCurrent && <span className="shrink-0 text-[12px] font-semibold text-[#2563eb]">현재</span>}
    </button>
  )
}
