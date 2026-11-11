# 오류 화면과 안내

이슈 #32의 공통 오류 UI입니다. 기존 Pretendard, 공통 버튼, 포커스 스타일을 사용합니다.

## 확인 경로

- `/404` 및 등록되지 않은 URL: 페이지 없음
- `/403`: 접근 권한 없음
- `/500`: 서버 오류
- `/503`: 서비스 일시 중단
- `/network-error`: 연결 실패
- `/session-expired`: 세션 만료
- `/components-preview.html?preview=errors`: 전체 오류·예외 상태와 내부 알림 미리보기

팀 목록의 조회 오류는 HTTP 상태에 맞는 `ErrorState`로 표시합니다. 인증 만료는 세션 만료 화면으로 이동합니다. 로그인 시 잘못된 인증 정보는 로그인 폼에서 안내합니다.

403과 404는 팀 목록 이동 및 이전 페이지 버튼을 제공합니다. 이전 이동은 Router 기록 또는 같은 출처에서 넘어온 브라우저 기록이 있을 때 수행하고, 확인할 수 없으면 팀 목록으로 이동합니다. 세션 만료 화면의 팀 링크는 로그인으로 연결하며, 다른 화면은 기존 팀 페이지의 인증·갱신 처리를 따릅니다. 사용자 프로필 캐시로 로그인 유효성을 추정하지 않습니다.

전체 페이지의 재시도는 전달된 `onRetry` 콜백을 우선 사용하고, 콜백이 없으면 현재 페이지를 새로고침합니다. 임의의 Backend 요청이나 분석 Job 생성 요청을 복원해서 다시 보내지 않습니다. 실제 실패 작업을 복구하려면 해당 페이지에서 안전한 재시도 콜백을 연결해야 합니다.

폼, 설정, 초대, 이미지 선택 오류는 `InlineFeedback`으로 표시합니다. 오류는 `alert`, 성공·정보·주의 안내는 `status`로 구분하고 긴 문구를 줄바꿈합니다. 저장 실패 시 기존 입력값은 유지합니다. 컴포넌트 미리보기는 배포 진입점에 포함하지 않습니다.

## 재사용

`src/components/feedback`에서 공개 컴포넌트와 타입을 가져옵니다.

```tsx
<ErrorState
  title="영상을 불러오지 못했어요"
  description="연결을 확인한 뒤 다시 시도해 주세요."
  icon="video"
  size="compact"
  actions={[{ label: '다시 불러오기', onClick: reloadVideo }]}
/>

<InlineFeedback message={saveError} />
<InlineFeedback message={validationError} variant="inline" />
<InlineFeedback message="저장했습니다." tone="success" />

<ExceptionState kind="uploadFailed" reason="network" onRetry={retryUpload} onSelectFile={selectFile} />
<ExceptionState kind="analysisFailed" onRetry={retryAnalysis} />
<ExceptionState kind="invalidInvitation" reason="expired" />
```

작업 콜백은 실제 요청이 끝날 때까지의 Promise를 반환해야 합니다. `ErrorState`는 실행 중 재시도 버튼을 비활성화하고 중복 호출을 막습니다. 콜백이 실패하면 안내를 표시하고 다시 시도할 수 있게 합니다. 업로드 형식·용량 오류에는 파일 재선택만 제공합니다. 분석·영상 상태는 사용하는 페이지에서 유지합니다.

영상 업로드·AI 분석·초대 링크 검증 API는 이 저장소에 연결되지 않았으므로 해당 UI는 개발용 미리보기에서 확인합니다. 미리보기의 재시도·파일 선택은 서버 요청을 보내지 않습니다.

`getApiErrorMessage`와 `getApiErrorKind`는 Fetch 및 Axios 오류와 `cause`에 담긴 상태를 공통으로 처리합니다. 404와 403은 서버가 반환한 상태를 그대로 구분합니다. 5xx와 연결 오류는 공통 안내로 바꾸고, 입력 관련 4xx는 구체적인 설명을 유지합니다. React 렌더링 오류에는 `ErrorBoundary`가 500 화면을 표시합니다.

토큰 갱신 중의 5xx·연결 실패는 세션 만료로 처리하지 않습니다. 동시에 갱신을 기다리는 요청에도 같은 오류를 전달합니다. 이메일 인증 서버의 장애는 인증 코드를 잘못 입력한 상태로 표시하지 않습니다.

검증: `npm test`, `npm run lint`, `npm run build`.
