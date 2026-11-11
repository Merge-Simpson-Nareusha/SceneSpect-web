import { useId, useRef, useState } from 'react'
import uploadIcon from '../../assets/icons/project-work/upload.svg'
import { commonStyles } from '../common/styles'

export type ThumbnailDropzoneProps = {
  onFileSelect: (file: File) => void
  imageUrl?: string
  className?: string
}

const isSupportedImage = (file: File) => file.type === 'image/jpeg' || file.type === 'image/png'

export default function ThumbnailDropzone({
  onFileSelect,
  imageUrl,
  className = '',
}: ThumbnailDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const errorId = useId()
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)

  const chooseFile = (file: File | undefined) => {
    if (!file) return
    if (!isSupportedImage(file)) {
      setError('JPG 또는 PNG 이미지를 선택해 주세요.')
      return
    }
    setError('')
    onFileSelect(file)
  }

  return (
    <div
      className={`flex w-[402px] max-w-full flex-col gap-[13px] rounded-[10px] border border-[#e3e6eb] bg-white px-[18px] py-[16px] ${className}`}
      onDragOver={(event) => {
        event.preventDefault()
        setDragging(true)
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setDragging(false)
      }}
      onDrop={(event) => {
        event.preventDefault()
        setDragging(false)
        chooseFile(event.dataTransfer.files[0])
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        aria-label="썸네일 이미지 선택"
        aria-describedby={error ? errorId : undefined}
        tabIndex={-1}
        className="sr-only"
        onChange={(event) => {
          chooseFile(event.target.files?.[0])
          event.target.value = ''
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`flex h-[140px] w-full cursor-pointer flex-col items-center justify-center gap-[8px] overflow-hidden rounded-[8px] border border-[#cad5e4] bg-[#f8fafc] text-center ${dragging ? 'border-[#2563eb] bg-[#eff5ff]' : 'hover:border-[#9bb9f0]'} ${commonStyles.focus}`}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="현재 썸네일" className="h-full w-full object-contain" />
        ) : (
          <>
            <img src={uploadIcon} alt="" width="23" height="23" />
            <span className="text-[14px] font-medium text-[#16181d]">썸네일 이미지 등록</span>
            <span className="px-[8px] text-[12px] text-[#6b7280]">
              이미지를 드래그하거나 파일을 선택하세요.
            </span>
          </>
        )}
      </button>
      <div className="flex min-h-[43px] flex-wrap items-center justify-between gap-[8px]">
        <span className="text-[12px] text-[#6b7280]">권장 비율 16:9 · JPG, PNG</span>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`h-[43px] w-[105px] shrink-0 cursor-pointer rounded-[8px] bg-[#2563eb] text-[14px] font-semibold text-white hover:bg-[#1d4ed8] ${commonStyles.focus}`}
        >
          파일 선택
        </button>
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-[12px] text-[#e64c50]">
          {error}
        </p>
      )}
    </div>
  )
}
