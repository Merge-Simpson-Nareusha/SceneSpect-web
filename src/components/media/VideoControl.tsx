import type { ButtonHTMLAttributes, MouseEventHandler } from 'react'
import { commonStyles } from '../common/styles'
import playIcon from '../../assets/icons/media/play.svg'
import playHoverIcon from '../../assets/icons/media/play-hover.svg'
import pauseIcon from '../../assets/icons/media/pause.svg'
import pauseHoverIcon from '../../assets/icons/media/pause-hover.svg'

export type VideoControlProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'type' | 'onClick'
> & {
  isPlaying: boolean
  onClick: MouseEventHandler<HTMLButtonElement>
}

/** Figma Media/VideoControl. 실제 영상의 play/pause 이벤트에 맞춰 isPlaying을 전달합니다. */
export default function VideoControl({
  isPlaying,
  onClick,
  className = '',
  ...props
}: VideoControlProps) {
  return (
    <button
      {...props}
      type="button"
      onClick={onClick}
      aria-label={isPlaying ? '영상 일시정지' : '영상 재생'}
      className={`group relative inline-flex size-[60px] shrink-0 cursor-pointer items-center justify-center rounded-full disabled:cursor-not-allowed disabled:opacity-50 ${commonStyles.focus} ${className}`}
    >
      <img
        src={isPlaying ? pauseIcon : playIcon}
        alt=""
        width={60}
        height={60}
        draggable={false}
        className="pointer-events-none block group-enabled:group-hover:hidden group-enabled:group-focus-visible:hidden"
      />
      <img
        src={isPlaying ? pauseHoverIcon : playHoverIcon}
        alt=""
        width={60}
        height={60}
        draggable={false}
        className="pointer-events-none hidden group-enabled:group-hover:block group-enabled:group-focus-visible:block"
      />
    </button>
  )
}
