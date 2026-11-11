import type { PageErrorKind } from '../../services/errors'
import type { ErrorStateProps } from './ErrorState'

export const errorContent: Record<
  PageErrorKind,
  Pick<ErrorStateProps, 'title' | 'description' | 'code' | 'icon'>
> = {
  notFound: {
    code: '404',
    icon: 'search',
    title: '페이지를 찾을 수 없어요',
    description:
      '주소가 올바른지 확인해 주세요.\n페이지가 삭제되었거나 주소가 변경되었을 수 있어요.',
  },
  forbidden: {
    code: '403',
    icon: 'lock',
    title: '접근 권한이 없어요',
    description: '이 페이지에 접근할 권한이 없어요.\n팀 관리자에게 권한을 문의해 주세요.',
  },
  server: {
    code: '500',
    icon: 'server',
    title: '요청을 처리하지 못했어요',
    description: '서버에서 예상치 못한 문제가 발생했어요.\n잠시 후 다시 시도해 주세요.',
  },
  unavailable: {
    code: '503',
    icon: 'clock',
    title: '서비스를 잠시 이용할 수 없어요',
    description: '현재 서버를 이용할 수 없어요.\n잠시 후 다시 시도해 주세요.',
  },
  network: {
    code: 'NETWORK',
    icon: 'network',
    title: '연결을 확인해 주세요',
    description: '서버에 연결하지 못했어요.\n인터넷 연결을 확인한 뒤 다시 시도해 주세요.',
  },
  sessionExpired: {
    code: 'SESSION EXPIRED',
    icon: 'clock',
    title: '다시 로그인해 주세요',
    description:
      '로그인이 만료되어 작업을 계속할 수 없어요.\n다시 로그인하면 서비스를 이용할 수 있어요.',
  },
}
