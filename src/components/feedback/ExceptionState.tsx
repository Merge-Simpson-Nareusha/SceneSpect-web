import ErrorState from './ErrorState'
import type { ErrorAction } from './ErrorState'

type RetryAction = () => void | Promise<void>

type ExceptionStateProps =
  | {
      kind: 'uploadFailed'
      reason?: 'format' | 'size' | 'network' | 'unknown'
      onSelectFile: RetryAction
      onRetry?: RetryAction
    }
  | { kind: 'analysisFailed'; onRetry: RetryAction }
  | {
      kind: 'invalidInvitation'
      reason?: 'expired' | 'invalid' | 'unavailable'
      teamListHref?: string
    }

const uploadMessages = {
  format:
    '지원하지 않는 영상 형식이에요.\n업로드 가능한 형식을 확인하고 다른 파일을 선택해 주세요.',
  size: '영상 용량이 업로드 한도를 초과했어요.\n더 작은 영상 파일을 선택해 주세요.',
  network: '연결이 끊겨 영상 업로드가 중단되었어요.\n인터넷 연결을 확인하고 다시 시도해 주세요.',
  unknown: '영상 업로드를 완료하지 못했어요.\n다시 시도하거나 다른 파일을 선택해 주세요.',
}

const invitationMessages = {
  expired: '초대 링크의 유효기간이 지났어요.\n팀 관리자에게 새로운 초대를 요청해 주세요.',
  invalid: '올바른 초대 링크가 아니에요.\n주소를 확인하거나 팀 관리자에게 새 초대를 요청해 주세요.',
  unavailable:
    '이 초대 링크는 더 이상 사용할 수 없어요.\n팀 관리자에게 새로운 초대를 요청해 주세요.',
}

export default function ExceptionState(props: ExceptionStateProps) {
  if (props.kind === 'uploadFailed') {
    const canRetry =
      props.reason === 'network' || props.reason === undefined || props.reason === 'unknown'
    const actions: ErrorAction[] = []
    if (canRetry && props.onRetry)
      actions.push({
        label: '업로드 다시 시도',
        pendingLabel: '업로드 요청 중…',
        onClick: props.onRetry,
      })
    actions.push({ label: '다른 파일 선택', onClick: props.onSelectFile })
    return (
      <ErrorState
        code="UPLOAD FAILED"
        icon="upload"
        title="영상을 업로드하지 못했어요"
        description={uploadMessages[props.reason ?? 'unknown']}
        actions={actions}
      />
    )
  }
  if (props.kind === 'analysisFailed') {
    return (
      <ErrorState
        code="ANALYSIS FAILED"
        icon="analysis"
        title="AI 분석을 완료하지 못했어요"
        description={'위험 구간을 분석하는 중 문제가 생겼어요.\n잠시 후 분석을 다시 요청해 주세요.'}
        actions={[
          { label: '분석 다시 시도', pendingLabel: '분석 요청 중…', onClick: props.onRetry },
        ]}
      />
    )
  }
  return (
    <ErrorState
      code="INVALID INVITATION"
      icon="link"
      title="초대 링크를 사용할 수 없어요"
      description={invitationMessages[props.reason ?? 'invalid']}
      actions={[{ label: '내 팀으로 돌아가기', href: props.teamListHref ?? '/teams' }]}
    />
  )
}
