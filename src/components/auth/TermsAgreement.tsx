import { useEffect, useId, useRef, useState } from 'react'
import radioCheckedIcon from '../../assets/icons/form/radio-checked.svg'
import radioUncheckedIcon from '../../assets/icons/form/radio-unchecked.svg'
import type { SignupTerm } from '../../services/auth'

// 전체 동의 또는 개별 약관 동의 행을 표시하는 재사용 컴포넌트입니다.
// - variant="all": 전체 동의 체크 행을 표시합니다.
// - variant="default": 서버에서 받은 약관과 상세 보기 버튼을 표시합니다.
// - checked/onChange: 동의 여부를 부모 컴포넌트에서 관리합니다.
type TermsAgreementProps =
  | {
      variant: 'all'
      checked: boolean
      onChange: (checked: boolean) => void
    }
  | {
      variant: 'default'
      term: SignupTerm
      checked: boolean
      onChange: (checked: boolean) => void
    }

function TermsAgreement(props: TermsAgreementProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !isDetailsOpen) return

    dialog.showModal()
    return () => {
      if (dialog.open) dialog.close()
    }
  }, [isDetailsOpen])

  const checkbox = (
    <input
      type="checkbox"
      checked={props.checked}
      onChange={(event) => props.onChange(event.currentTarget.checked)}
      className="peer sr-only"
    />
  )
  const checkboxIcon = (
    <img
      src={props.checked ? radioCheckedIcon : radioUncheckedIcon}
      alt=""
      aria-hidden="true"
      className="h-[1.1875rem] w-[1.1875rem] shrink-0"
    />
  )

  if (props.variant === 'all') {
    return (
      <label className="flex h-[3.25rem] w-full cursor-pointer items-center gap-[clamp(0.75rem,1.67cqw,1.5rem)] rounded-[0.5rem] bg-[#ECECEC] px-[clamp(0.75rem,1.39cqw,1.25rem)]">
        {checkbox}
        {checkboxIcon}
        <span className="text-[1rem] font-normal text-[#16181D]">
          전체동의하기
        </span>
      </label>
    )
  }

  const { term } = props
  const isRequired = term.required

  return (
    <>
      <div className="flex h-[2.5rem] w-full items-center gap-[clamp(0.625rem,1.39cqw,1.25rem)] px-[clamp(0.75rem,1.39cqw,1.25rem)]">
        <label className="flex h-full min-w-0 flex-1 cursor-pointer items-center gap-[clamp(0.75rem,1.67cqw,1.5rem)]">
          {checkbox}
          {checkboxIcon}
          <span className="truncate text-[1rem] font-normal tracking-[-0.04em] text-[#16181D]">
            {term.title} 동의
          </span>
        </label>
        <span
          className={`flex h-[1.1875rem] shrink-0 items-center rounded-[0.25rem] px-[0.5rem] text-[0.875rem] leading-none ${isRequired ? 'bg-[#DBEAFE] text-[#2563EB]' : 'bg-[#D1D1D1] text-[#16181D]'}`}
        >
          {isRequired ? '필수' : '선택'}
        </span>
        <button
          type="button"
          aria-label={`${term.title} 자세히 보기`}
          onClick={() => setIsDetailsOpen(true)}
          className="flex h-[1.1875rem] w-[1.1875rem] shrink-0 cursor-pointer items-center justify-center text-[#B0B0B0]"
        >
          <svg viewBox="0 0 16 24" className="h-[1.1875rem] w-[0.8125rem]" fill="none" aria-hidden="true">
            <path
              d="m4 2 8 10-8 10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={() => setIsDetailsOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setIsDetailsOpen(false)
        }}
        className="m-auto max-h-[min(80svh,43.75rem)] w-[min(40rem,calc(100%-2rem))] max-w-none overflow-y-auto rounded-[0.75rem] p-0 text-[#16181D] shadow-xl backdrop:bg-black/50"
      >
        <div className="flex flex-col gap-5 p-[clamp(1.25rem,3.33cqw,2rem)]">
          <div className="flex items-start justify-between gap-4">
            <h2 id={titleId} className="text-[1.25rem] font-semibold">
              {term.title}
            </h2>
            <button
              type="button"
              aria-label="약관 상세 닫기"
              onClick={() => setIsDetailsOpen(false)}
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center text-2xl leading-none text-[#777]"
            >
              ×
            </button>
          </div>
          <p className="text-[1rem] leading-7 text-[#555]">{term.content}</p>
        </div>
      </dialog>
    </>
  )
}

export default TermsAgreement
