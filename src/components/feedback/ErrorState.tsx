import { useId, useRef, useState } from 'react'
import CommonButton, { CommonButtonLink } from '../common/CommonButton'
import FeedbackIcon from './FeedbackIcon'
import type { FeedbackIconName } from './FeedbackIcon'
import InlineFeedback from './InlineFeedback'

export type ErrorAction = { label: string; pendingLabel?: string } & (
  { href: string; onClick?: never } | { onClick: () => void | Promise<void>; href?: never }
)

export type ErrorStateProps = {
  title: string
  description: string
  code?: string
  icon?: FeedbackIconName
  actions?: ErrorAction[]
  size?: 'page' | 'section' | 'compact'
  headingLevel?: 1 | 2 | 3
  className?: string
}

export default function ErrorState({
  title,
  description,
  code,
  icon = 'alert',
  actions = [],
  size = 'section',
  headingLevel = 2,
  className = '',
}: ErrorStateProps) {
  const id = useId()
  const [pendingAction, setPendingAction] = useState<number | null>(null)
  const pendingRef = useRef(false)
  const [actionError, setActionError] = useState('')
  const Heading = headingLevel === 1 ? 'h1' : headingLevel === 3 ? 'h3' : 'h2'

  const runAction = async (action: ErrorAction, index: number) => {
    if (!action.onClick || pendingRef.current) return
    pendingRef.current = true
    setPendingAction(index)
    setActionError('')
    try {
      await action.onClick()
    } catch (error) {
      console.error('[UI] 오류 복구 동작에 실패했습니다.', error)
      setActionError('다시 시도하지 못했습니다. 잠시 후 다시 시도해 주세요.')
    } finally {
      pendingRef.current = false
      setPendingAction(null)
    }
  }

  return (
    <section
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
      aria-busy={pendingAction !== null}
      className={`flex min-w-0 flex-col items-center text-center text-[#16181d] ${size === 'page' ? 'py-[40px] sm:py-[64px]' : size === 'compact' ? 'px-[20px] py-[28px]' : 'px-[24px] py-[56px] sm:py-[72px]'} ${className}`}
    >
      {size === 'page' ? (
        <div aria-hidden="true" className="relative mb-[32px] w-[244px] sm:mb-[40px] sm:w-[280px]">
          <div className="relative -rotate-3 overflow-hidden rounded-[14px] border border-[#d8dfea] bg-white shadow-[0_12px_40px_-18px_#bac6dc]">
            <div className="flex h-[28px] items-center gap-[5px] border-b border-[#e5ebf4] bg-[#f8fafc] px-[12px]">
              <span className="size-[5px] rounded-full bg-[#c9d2e2]" />
              <span className="size-[5px] rounded-full bg-[#c9d2e2]" />
              <span className="size-[5px] rounded-full bg-[#c9d2e2]" />
              <span className="ml-auto h-[3px] w-[38px] rounded-full bg-[#dce3ee]" />
            </div>
            <div className="flex h-[120px] items-center justify-center bg-[#f8faff] text-[68px] leading-none font-semibold tracking-[-5px] text-[#d0dbef] sm:h-[136px] sm:text-[80px]">
              {code && /^\d+$/.test(code) ? (
                code
              ) : (
                <FeedbackIcon name={icon} className="size-[64px] text-[#9cb4e2]" />
              )}
            </div>
            <div className="flex h-[22px] items-center gap-[4px] border-t border-[#e5ebf4] px-[12px]">
              <span className="h-[3px] w-[38%] rounded-full bg-[#2962ff]" />
              <span className="h-[3px] flex-1 rounded-full bg-[#e5ebf4]" />
            </div>
          </div>
          <span className="absolute -right-[14px] bottom-[20px] flex size-[52px] rotate-6 items-center justify-center rounded-[15px] border-[5px] border-white bg-[#2962ff] text-white shadow-sm">
            <FeedbackIcon name={icon} className="size-[25px]" />
          </span>
        </div>
      ) : (
        <span
          aria-hidden="true"
          className={`mb-[20px] flex items-center justify-center rounded-[16px] border border-[#e1e8f5] bg-[#f3f6fc] text-[#2962ff] ${size === 'compact' ? 'size-[48px]' : 'size-[60px]'}`}
        >
          <FeedbackIcon
            name={icon}
            className={size === 'compact' ? 'size-[24px]' : 'size-[28px]'}
          />
        </span>
      )}
      {code && (
        <p className="mb-[12px] text-[11px] leading-[16px] font-semibold tracking-[0.14em] text-[#66758d]">
          {code}
        </p>
      )}
      <Heading
        id={`${id}-title`}
        className={`max-w-full font-semibold tracking-[-0.04em] [text-wrap:balance] ${size === 'page' ? 'text-[28px] leading-[38px] sm:text-[36px] sm:leading-[46px]' : size === 'compact' ? 'text-[18px] leading-[27px]' : 'text-[24px] leading-[34px]'}`}
      >
        {title}
      </Heading>
      <p
        id={`${id}-description`}
        className={`mt-[12px] max-w-[440px] [overflow-wrap:anywhere] whitespace-pre-line text-[#737b88] ${size === 'compact' ? 'text-[14px] leading-[23px]' : 'text-[15px] leading-[25px] sm:text-[16px] sm:leading-[27px]'}`}
      >
        {description}
      </p>
      {actions.length > 0 && (
        <div
          className={`mt-[28px] flex w-full max-w-[420px] flex-col justify-center gap-[10px] min-[480px]:w-auto min-[480px]:flex-row ${size === 'page' ? 'sm:mt-[32px]' : ''}`}
        >
          {actions.map((action, index) =>
            action.href !== undefined ? (
              <CommonButtonLink
                key={`${index}-${action.label}`}
                href={action.href}
                variant={index === 0 ? 'compactDark' : 'compactLight'}
                className="min-h-[46px] justify-center px-[22px] text-[14px] font-medium"
              >
                {action.label}
              </CommonButtonLink>
            ) : (
              <CommonButton
                key={`${index}-${action.label}`}
                onClick={() => void runAction(action, index)}
                disabled={pendingAction !== null}
                variant={index === 0 ? 'compactDark' : 'compactLight'}
                className="min-h-[46px] justify-center px-[22px] text-[14px] font-medium"
              >
                {pendingAction === index && (
                  <span
                    aria-hidden="true"
                    className="size-[14px] animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none"
                  />
                )}
                {pendingAction === index ? (action.pendingLabel ?? '다시 시도 중…') : action.label}
              </CommonButton>
            ),
          )}
        </div>
      )}
      {actionError && (
        <InlineFeedback message={actionError} className="mt-[16px] max-w-[420px] text-left" />
      )}
    </section>
  )
}
