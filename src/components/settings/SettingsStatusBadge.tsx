export type SettingsStatusBadgeProps = {
  children: string
  className?: string
}

export default function SettingsStatusBadge({
  children,
  className = '',
}: SettingsStatusBadgeProps) {
  return (
    <span
      className={`inline-flex min-h-[28px] min-w-[47px] items-center justify-center rounded-[7px] bg-[#eef4ff] px-[5px] text-[12px] leading-[normal] font-medium whitespace-nowrap text-[#2864e9] ${className}`}
    >
      {children}
    </span>
  )
}
