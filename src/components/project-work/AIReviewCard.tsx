import { commonStyles } from '../common/styles'

export type AIReviewCardProps = {
  timecode: string
  message: string
  onViewEvidence: () => void
  className?: string
}

export default function AIReviewCard({
  timecode,
  message,
  onViewEvidence,
  className = '',
}: AIReviewCardProps) {
  return (
    <article
      className={`flex min-h-[121px] w-[414px] max-w-full flex-col justify-between gap-[11px] rounded-[10px] border border-[#dccdfc] bg-[#f5f1ff] px-[16px] pt-[14px] pb-[13px] ${className}`}
    >
      <div className="flex min-w-0 items-center gap-[9px] leading-[normal] text-[#6945bf]">
        <span className="flex h-[24px] w-[52px] shrink-0 items-center justify-center rounded-[6px] bg-[#6945bf] text-[12px] font-semibold text-white">
          AI
        </span>
        <span className="truncate text-[15px] font-semibold">AI 검토 의견</span>
        <span className="shrink-0 text-[12px] font-medium">{timecode}</span>
      </div>
      <p className="line-clamp-2 text-[13px] font-medium text-[#16181d]">{message}</p>
      <div className="flex flex-wrap items-center justify-between gap-[8px]">
        <span className="text-[11px] text-[#6b7280]">검토용 제안 · 심사 판정 아님</span>
        <button
          type="button"
          onClick={onViewEvidence}
          className={`shrink-0 cursor-pointer rounded-[4px] text-[12px] font-semibold text-[#6945bf] hover:underline ${commonStyles.focus}`}
        >
          근거 보기 ›
        </button>
      </div>
    </article>
  )
}
