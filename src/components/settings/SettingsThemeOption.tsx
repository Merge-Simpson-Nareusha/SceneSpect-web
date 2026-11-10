export type SettingsTheme = 'light' | 'dark' | 'system'

export type SettingsThemeOptionProps = {
  theme: SettingsTheme
  selected: boolean
  name: string
  onSelect: (theme: SettingsTheme) => void
  className?: string
}

const themes = {
  light: {
    label: '라이트',
    preview: 'bg-[#f8f9fb]',
    header: 'bg-white',
    surface: 'bg-[#f8f9fb]',
    panel: 'bg-white',
  },
  dark: {
    label: '다크',
    preview: 'bg-[#262b35]',
    header: 'bg-[#353b46]',
    surface: 'bg-[#262b35]',
    panel: 'bg-[#353b46]',
  },
  system: {
    label: '시스템 설정',
    preview: 'bg-[#eef1f5]',
    header: 'bg-white',
    surface: 'bg-[#e5eaf0]',
    panel: 'bg-white',
  },
} as const

export default function SettingsThemeOption({
  theme,
  selected,
  name,
  onSelect,
  className = '',
}: SettingsThemeOptionProps) {
  const colors = themes[theme]

  return (
    <label
      className={`relative block w-[246px] shrink-0 cursor-pointer rounded-[12px] border bg-white p-[15px] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-[#2962ff] ${selected ? 'h-[200px] border-[2px] border-[#2864e9] p-[14px]' : 'h-[198px] border-[#e8ebf0] hover:border-[#c9d0dc]'} ${className}`}
    >
      <input
        type="radio"
        name={name}
        value={theme}
        checked={selected}
        onChange={() => onSelect(theme)}
        className="sr-only"
      />
      <div
        aria-hidden="true"
        className={`h-[131px] w-[214px] overflow-hidden rounded-[8px] ${colors.preview}`}
      >
        <div className={`flex h-[23px] items-center gap-[5px] pl-[9px] ${colors.header}`}>
          {[0, 1, 2].map((dot) => (
            <span key={dot} className="size-[5px] rounded-[3px] bg-[#e2e6ed]" />
          ))}
        </div>
        <div className={`flex h-[108px] gap-[10px] pt-[12px] pl-[12px] ${colors.surface}`}>
          <div
            className={`flex h-[79px] w-[46px] flex-col gap-[8px] rounded-[5px] pt-[10px] pl-[7px] ${colors.panel}`}
          >
            <span className="h-[5px] w-[29px] rounded-[3px] bg-[#2864e9]" />
            <span className="h-[5px] w-[29px] rounded-[3px] bg-[#d7dbe4]" />
            <span className="h-[5px] w-[29px] rounded-[3px] bg-[#d7dbe4]" />
          </div>
          <div
            className={`flex h-[80px] w-[130px] flex-col gap-[9px] rounded-[5px] pt-[9px] pl-[10px] ${colors.panel}`}
          >
            <span className="h-[7px] w-[86px] rounded-[4px] bg-[#bec8d8]" />
            <span className="h-[5px] w-[105px] rounded-[3px] bg-[#e2e6ed]" />
            <span className="h-[30px] w-[105px] rounded-[5px] bg-[#e3ebff]" />
          </div>
        </div>
      </div>
      <div className="mt-[12px] flex h-[38px] items-center justify-between">
        <span className="text-[15px] font-semibold text-[#171a21]">{colors.label}</span>
        <span
          aria-hidden="true"
          className={`size-[19px] rounded-full border-solid bg-white ${selected ? 'border-[5px] border-[#2864e9]' : 'border-[2px] border-[#c9d0dc]'}`}
        />
      </div>
    </label>
  )
}
