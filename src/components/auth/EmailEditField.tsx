// 회원가입 단계 사이에서 이메일을 표시하고 수정하는 컴포넌트입니다.
// - value: 현재 이메일 주소를 표시하고 입력값으로 사용합니다.
// - onChange: 수정된 이메일 주소를 부모 컴포넌트에 전달합니다.
// - 수정/완료 동작은 회원가입 단계에 따라 부모 컴포넌트에서 제어합니다.
type EmailEditFieldProps = {
  value: string
  onChange: (value: string) => void
  isEditing: boolean
  onEdit: () => void
  onDone: () => void
}

function EmailEditField({ value, onChange, isEditing, onEdit, onDone }: EmailEditFieldProps) {
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

  const handleEdit = () => {
    if (!isEditing) {
      onEdit()
      return
    }

    if (isEmailValid) onDone()
  }

  return (
    <div
      className={`flex h-[3.25rem] w-full items-center justify-between gap-4 rounded-[0.3125rem] px-[clamp(0.75rem,1.39cqw,1.25rem)] text-[clamp(0.875rem,1.11cqw,1rem)] text-[#16181D] ${isEditing ? 'border border-[#ECECEC] bg-white' : 'bg-[#ECECEC]'}`}
    >
      {isEditing ? (
        <input
          autoFocus
          type="email"
          name="email"
          aria-label="이메일"
          value={value}
          onChange={(event) => onChange(event.currentTarget.value)}
          className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#B0B0B0]"
        />
      ) : (
        <span className="min-w-0 flex-1 truncate">{value}</span>
      )}
      <button
        type="button"
        onClick={handleEdit}
        disabled={isEditing && !isEmailValid}
        className="shrink-0 text-[#2563EB] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isEditing ? '완료' : '수정'}
      </button>
    </div>
  )
}

export default EmailEditField
