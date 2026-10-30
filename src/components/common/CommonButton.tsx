import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import lightArrow from '../../assets/icons/common/arrow-light.svg'
import darkArrow from '../../assets/icons/common/arrow-dark.svg'

export type ButtonVariant = 'compactLight' | 'compactDark' | 'ctaLight' | 'ctaDark'
export type ButtonAppearance = {
  variant?: ButtonVariant
  size?: 'default' | 'design'
  previewState?: 'default' | 'hover'
}

function buttonClasses({
  variant = 'compactLight',
  size = 'default',
  previewState = 'default',
}: ButtonAppearance) {
  const dark = variant === 'compactDark' || variant === 'ctaDark'
  const cta = variant === 'ctaDark' || variant === 'ctaLight'
  return [
    'inline-flex shrink-0 items-center gap-[16px] whitespace-nowrap transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2962ff] motion-reduce:transition-none',
    dark
      ? `text-white hover:bg-[#2a2d34] ${previewState === 'hover' ? 'bg-[#2a2d34]' : 'bg-[#16181d]'}`
      : `text-[#16181d] hover:bg-[#e2e8f0] ${previewState === 'hover' ? 'bg-[#e2e8f0]' : 'bg-[#f1f5f9]'}`,
    cta
      ? size === 'design'
        ? 'h-[95px] w-[412px] justify-between rounded-[8px] px-[40px] text-[40px] leading-[48px] font-medium tracking-[-0.8px]'
        : 'min-h-[56px] min-w-[240px] justify-between rounded-[8px] px-[24px] py-[14px] text-[20px] leading-[28px] font-medium tracking-[-0.4px]'
      : size === 'design'
        ? 'h-[52px] justify-center rounded-[5px] px-[20px] py-[8px] text-[30px] leading-[36px] font-light'
        : 'min-h-[44px] justify-center rounded-[6px] px-[16px] py-[10px] text-[16px] leading-[24px] font-normal',
  ].join(' ')
}

function ButtonContent({
  variant = 'compactLight',
  size = 'default',
  children,
}: {
  variant?: ButtonVariant
  size?: ButtonAppearance['size']
  children?: ReactNode
}) {
  const cta = variant === 'ctaLight' || variant === 'ctaDark'
  return (
    <>
      {children ?? (cta ? '로그인 하러가기' : '로그인')}
      {cta && (
        <img
          src={variant === 'ctaDark' ? lightArrow : darkArrow}
          alt=""
          className={`${size === 'design' ? 'h-[28.5px] w-[34.2px]' : 'h-[18px] w-[22px]'} shrink-0`}
        />
      )}
    </>
  )
}

export default function CommonButton({
  variant,
  size,
  previewState,
  className = '',
  children,
  type = 'button',
  ...props
}: ButtonAppearance & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      type={type}
      className={`${buttonClasses({ variant, size, previewState })} cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      <ButtonContent variant={variant} size={size}>
        {children}
      </ButtonContent>
    </button>
  )
}

export function CommonButtonLink({
  variant,
  size,
  previewState,
  className = '',
  children,
  ...props
}: ButtonAppearance & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a {...props} className={`${buttonClasses({ variant, size, previewState })} ${className}`}>
      <ButtonContent variant={variant} size={size}>
        {children}
      </ButtonContent>
    </a>
  )
}
