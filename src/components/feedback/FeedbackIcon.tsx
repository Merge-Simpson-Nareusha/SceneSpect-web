export type FeedbackIconName =
  | 'search'
  | 'lock'
  | 'server'
  | 'network'
  | 'clock'
  | 'upload'
  | 'analysis'
  | 'link'
  | 'video'
  | 'alert'
  | 'check'
  | 'info'

export default function FeedbackIcon({
  name = 'alert',
  className = '',
}: {
  name?: FeedbackIconName
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {name === 'search' ? (
        <>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m16 16 4.5 4.5M8.5 10.5h4" />
        </>
      ) : name === 'lock' ? (
        <>
          <rect x="5" y="10" width="14" height="11" rx="3" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
        </>
      ) : name === 'server' ? (
        <>
          <rect x="3" y="3" width="18" height="7" rx="2" />
          <path d="M7 6.5h.01M11 6.5h6M3 15v4a2 2 0 0 0 2 2h9M7 17.5h.01M18 13v4m0 3h.01" />
        </>
      ) : name === 'network' ? (
        <>
          <path d="M3 3 21 21M2 8a16 16 0 0 1 3.5-2M9 5a16 16 0 0 1 13 3M5 12a11 11 0 0 1 3.5-1.8M13 10a11 11 0 0 1 6 2M8.5 16a6 6 0 0 1 7 0M12 20h.01" />
        </>
      ) : name === 'clock' ? (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </>
      ) : name === 'upload' ? (
        <>
          <path d="M12 16V3m-4 4 4-4 4 4M4 14v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
        </>
      ) : name === 'analysis' ? (
        <>
          <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3ZM20 2v4m-2-2h4" />
        </>
      ) : name === 'link' ? (
        <>
          <path d="m10 13 4-4M8 16l-1 1a3.5 3.5 0 0 1-5-5l4-4a3.5 3.5 0 0 1 5 0m2 8a3.5 3.5 0 0 0 5 0l4-4a3.5 3.5 0 0 0-5-5l-1 1M4 3l2 2m12 14 2 2" />
        </>
      ) : name === 'video' ? (
        <>
          <rect x="3" y="5" width="18" height="14" rx="3" />
          <path d="m10 9 5 3-5 3V9Z" />
        </>
      ) : name === 'check' ? (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12 3 3 5-6" />
        </>
      ) : (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d={name === 'info' ? 'M12 11v6m0-10h.01' : 'M12 7v6m0 4h.01'} />
        </>
      )}
    </svg>
  )
}
