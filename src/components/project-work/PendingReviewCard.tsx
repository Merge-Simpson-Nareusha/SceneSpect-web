import { commonStyles } from '../common/styles'

export type PendingReviewCardProps = {
  title: string
  description: string
  onViewProposal: () => void
  className?: string
}

export default function PendingReviewCard({
  title,
  description,
  onViewProposal,
  className = '',
}: PendingReviewCardProps) {
  return (
    <article
      className={`flex min-h-[118px] w-[414px] max-w-full flex-col justify-between gap-[11px] rounded-[10px] border border-[#eadcc2] bg-[#fffcf7] px-[16px] pt-[14px] pb-[12px] ${className}`}
    >
      <div className="flex items-center justify-between gap-[8px] leading-[normal]">
        <h3 className="min-w-0 truncate text-[15px] font-semibold text-[#16181d]" title={title}>
          {title}
        </h3>
        <span className="flex h-[25px] w-[75px] shrink-0 items-center justify-center rounded-[6px] bg-[#fff6e8] text-[12px] font-semibold text-[#986920]">
          승인 대기
        </span>
      </div>
      <p className="line-clamp-2 text-[12px] text-[#6b7280]">{description}</p>
      <div className="flex flex-wrap items-center justify-between gap-[8px] text-[12px] font-medium">
        <span className="text-[#986920]">승인 담당자 확인 후 버전으로 기록</span>
        <button
          type="button"
          onClick={onViewProposal}
          className={`shrink-0 cursor-pointer rounded-[4px] text-[#6b7280] hover:underline ${commonStyles.focus}`}
        >
          제안 보기 ›
        </button>
      </div>
    </article>
  )
}
