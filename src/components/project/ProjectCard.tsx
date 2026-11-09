import workArrow from '../../assets/icons/project/work-arrow.svg'
import { commonStyles } from '../common/styles'
import styles from './ProjectCard.module.css'

const statusLabels = {
  inProgress: '진행 중',
  paused: '중지됨',
  completed: '완료됨',
}

export type ProjectStatus = keyof typeof statusLabels
export type ProjectCardPreviewState = 'hover' | 'actionHover'

export type ProjectCardProps = {
  name: string
  description: string
  status: ProjectStatus
  updatedLabel: string
  coverSrc?: string
  onOpen: () => void
  className?: string
  previewState?: ProjectCardPreviewState
}

export default function ProjectCard({
  name,
  description,
  status,
  updatedLabel,
  coverSrc,
  onOpen,
  className = '',
  previewState,
}: ProjectCardProps) {
  return (
    <article
      data-status={status}
      data-preview-state={previewState}
      className={`${styles.card} relative isolate flex h-[240px] w-[427px] max-w-full flex-col justify-between overflow-hidden rounded-[12px] bg-[#1c2538] px-[18px] py-[34px] leading-[normal] text-white ${className}`}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {coverSrc && (
          <img
            key={coverSrc}
            src={coverSrc}
            alt=""
            onError={(event) => {
              event.currentTarget.hidden = true
            }}
            className="absolute inset-0 size-full object-cover"
          />
        )}
        <div className={`${styles.shade} absolute inset-0`} />
      </div>
      <div className={`${styles.details} min-w-0 space-y-[8px]`}>
        <h3 className="truncate text-[32px] font-bold" title={name}>
          {name}
        </h3>
        <p className={`${styles.description} truncate text-[14px] font-medium`} title={description}>
          {description}
        </p>
      </div>
      <div className="flex items-center justify-between gap-[8px]">
        <div
          className={`${styles.details} flex min-w-0 items-center gap-[12px] px-[4px] text-[14px] font-semibold`}
        >
          <span
            className={`${styles.badge} shrink-0 rounded-[4px] px-[6px] py-[4px] whitespace-nowrap`}
          >
            {statusLabels[status]}
          </span>
          <span className="truncate" title={updatedLabel}>
            {updatedLabel}
          </span>
        </div>
        <button
          type="button"
          aria-label={`${name} 작업하기`}
          onClick={onOpen}
          className={`${styles.action} flex h-[36px] w-[85px] shrink-0 cursor-pointer items-center justify-between rounded-[4px] px-[10px] text-[14px] font-bold tracking-[-0.56px] whitespace-nowrap text-[#f1f5f9] ${commonStyles.focus}`}
        >
          <img src={workArrow} alt="" className="max-w-none shrink-0 -scale-y-100 rotate-180" />
          작업하기
        </button>
      </div>
    </article>
  )
}
