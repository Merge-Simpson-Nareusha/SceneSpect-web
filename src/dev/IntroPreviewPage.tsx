import { useEffect, useId, useRef, useState } from 'react'
import VideoControl from '../components/media/VideoControl'
import playIcon from '../assets/icons/media/play.svg'
import playHoverIcon from '../assets/icons/media/play-hover.svg'
import pauseIcon from '../assets/icons/media/pause.svg'
import pauseHoverIcon from '../assets/icons/media/pause-hover.svg'
import ErrorState from '../components/feedback/ErrorState'

const examples = [
  { label: '재생 · Default', src: playIcon },
  { label: '재생 · Hover', src: playHoverIcon },
  { label: '일시정지 · Default', src: pauseIcon },
  { label: '일시정지 · Hover', src: pauseHoverIcon },
]

const playbackLabels = {
  ready: '재생 준비 완료',
  playing: '재생 중',
  paused: '일시정지',
  ended: '재생 완료',
}

export default function IntroPreviewPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoId = useId()
  const [source, setSource] = useState<{ name: string; url: string } | null>(null)
  const [playback, setPlayback] = useState<keyof typeof playbackLabels>('ready')
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!source) return
    return () => URL.revokeObjectURL(source.url)
  }, [source])

  const togglePlayback = async () => {
    const video = videoRef.current
    if (!video || !ready) return
    setError('')
    try {
      if (video.paused) await video.play()
      else video.pause()
    } catch {
      setError('영상을 재생하지 못했습니다. 파일 형식과 브라우저 재생 지원을 확인해 주세요.')
    }
  }

  return (
    <main className="mx-auto min-h-svh max-w-[1100px] space-y-[32px] px-[40px] py-[40px] text-[#16181d]">
      <header>
        <p className="text-[14px] text-[#737b88]">04_Component / 01 · 소개</p>
        <h1 className="mt-[8px] text-[28px] font-semibold">영상 컨트롤 미리보기</h1>
        <p className="mt-[12px] text-[16px]">Figma 원본 60px 크기의 재생·일시정지 버튼입니다.</p>
        <p className="mt-[8px] text-[14px] text-[#737b88]">
          어두운 배경은 흰색 반투명 버튼을 확인하기 위한 미리보기용입니다. 실제 페이지에서는 영상
          위에 배치합니다.
        </p>
      </header>
      <section aria-labelledby="states-heading">
        <h2 id="states-heading" className="mb-[16px] text-[20px] font-semibold">
          디자인 상태 예시
        </h2>
        <p className="mb-[16px] text-[14px] text-[#737b88]">
          아래 이미지는 모양 비교용입니다. 실제 버튼 동작은 영상 파일을 선택해 확인합니다.
        </p>
        <div className="flex flex-wrap gap-[40px] rounded-[8px] bg-[#16181d] p-[32px] text-white">
          {examples.map(({ label, src }) => (
            <figure key={label} className="space-y-[16px]">
              <img src={src} alt="" width={60} height={60} />
              <figcaption className="text-[14px]">{label}</figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section aria-labelledby="playback-heading" className="space-y-[16px]">
        <h2 id="playback-heading" className="text-[20px] font-semibold">
          실제 영상 연결
        </h2>
        <label className="block space-y-[8px] text-[14px]">
          <span className="block">테스트할 영상 파일 선택</span>
          <input
            type="file"
            accept="video/*"
            className="block max-w-full rounded-[5px] border border-[#e2e8f0] p-[12px]"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (!file) return
              setReady(false)
              setPlayback('ready')
              setError('')
              setSource({ name: file.name, url: URL.createObjectURL(file) })
            }}
          />
        </label>
        <p className="text-[14px] text-[#737b88]">
          선택한 파일은 브라우저에서만 재생하며 서버로 전송하지 않습니다.
        </p>
        <div className="rounded-[8px] bg-[#16181d] p-[24px] text-white">
          {source ? (
            <video
              key={source.url}
              ref={videoRef}
              id={videoId}
              src={source.url}
              aria-label={source.name}
              controls
              playsInline
              preload="metadata"
              className="mb-[24px] max-h-[420px] w-full"
              onLoadedData={() => setReady(true)}
              onPlay={() => setPlayback('playing')}
              onPause={(event) => setPlayback(event.currentTarget.ended ? 'ended' : 'paused')}
              onEnded={() => setPlayback('ended')}
              onSeeked={(event) => {
                const video = event.currentTarget
                setPlayback(video.ended ? 'ended' : video.paused ? 'paused' : 'playing')
              }}
              onError={() => {
                setReady(false)
                setPlayback('ready')
                setError('이 영상을 불러올 수 없습니다. 다른 영상 파일을 선택해 주세요.')
              }}
            />
          ) : (
            <p className="mb-[24px] text-[14px]">영상 파일을 선택하면 재생 버튼이 활성화됩니다.</p>
          )}
          <div className="flex items-center gap-[20px]">
            <VideoControl
              isPlaying={playback === 'playing'}
              disabled={!ready}
              aria-controls={source ? videoId : undefined}
              onClick={() => void togglePlayback()}
            />
            <p role="status" className="text-[14px]">
              {error
                ? '재생할 수 없음'
                : !source
                  ? '선택한 영상 없음'
                  : !ready
                    ? '영상을 준비하는 중'
                    : playbackLabels[playback]}
            </p>
          </div>
        </div>
        {error && (
          <ErrorState
            size="compact"
            icon="video"
            title="영상을 불러오지 못했어요"
            description={error}
            actions={[
              {
                label: '다시 불러오기',
                onClick: () => {
                  setError('')
                  setReady(false)
                  videoRef.current?.load()
                },
              },
            ]}
          />
        )}
      </section>
      <a href="?preview=common" className="text-[14px] text-[#2962ff] underline underline-offset-4">
        00 공통 컴포넌트 보기
      </a>
      <a
        href="?preview=team"
        className="ml-[24px] text-[14px] text-[#2962ff] underline underline-offset-4"
      >
        03 팀 관리 컴포넌트 보기
      </a>
    </main>
  )
}
