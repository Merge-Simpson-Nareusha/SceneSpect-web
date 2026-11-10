export type SettingsSectionHeadingProps = {
  title: string
  description: string
  className?: string
}

export default function SettingsSectionHeading({
  title,
  description,
  className = '',
}: SettingsSectionHeadingProps) {
  return (
    <div className={`w-[782px] max-w-full space-y-[8px] leading-[normal] ${className}`}>
      <h2 className="text-[19px] font-semibold text-[#171a21]">{title}</h2>
      <p className="text-[14px] text-[#838a94]">{description}</p>
    </div>
  )
}
