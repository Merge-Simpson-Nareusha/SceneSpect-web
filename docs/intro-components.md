# 01 · 소개 컴포넌트

Figma `04_Component > 01 · 소개 > Media/VideoControl`을 구현합니다.
소개 페이지 전체가 아니라 해당 페이지에서 재사용하는 영상 컨트롤입니다.

## 디자인

- 원본 SVG의 재생·일시정지 Default/Hover 4종을 사용합니다.
- 버튼과 이미지 크기는 Figma의 60×60px을 유지합니다.
- 원본의 흰색 반투명 형태를 유지합니다. 미리보기의 어두운 배경은 아이콘 비교를 위한 배경입니다.
- 키보드 포커스에도 Hover 이미지를 표시하고 기존 공통 포커스 테두리를 적용합니다.
- Figma의 `Playback=Stop`은 두 줄짜리 일시정지 아이콘입니다. 실행 동작과 접근성 이름은 일시정지로 해석합니다.

## 사용

```tsx
import { VideoControl } from './components/media'

;<VideoControl
  isPlaying={isPlaying}
  onClick={handlePlayback}
  disabled={!videoReady}
  aria-controls="intro-video"
/>
```

`isPlaying`과 `onClick`은 필수입니다. 실제 `<video>`의 `play`, `pause`, `ended` 이벤트로 상태를 갱신하고,
페이지의 클릭 처리에서 `video.play()` 또는 `video.pause()`를 호출합니다.
버튼 안에서 재생 상태를 임의로 뒤집지 않으므로 재생 실패나 기본 플레이어 조작과 표시가 어긋나지 않습니다.
재생 실패는 페이지에서 처리하고 사용자에게 알립니다. API, 자동 재생, 전체 영상 플레이어 UI는 포함하지 않습니다.

## 미리보기

`npm run dev` 후 `http://localhost:5173/components-preview.html?preview=intro`를 엽니다.

- 네 상태의 원본 이미지 비교
- 로컬 영상 파일 선택 후 실제 재생/일시정지
- 기본 비디오 컨트롤로 조작했을 때 버튼 상태 동기화
- 재생 전 비활성 상태, 파일 오류 표시, 키보드 조작

미리보기는 개발 전용입니다. 영상 파일은 브라우저 메모리에서만 사용하며 서버로 전송하지 않습니다.
선택한 파일의 임시 URL은 교체 또는 미리보기 종료 시 해제합니다.
실제 소개 영상과 페이지 연결은 소개 페이지 담당자가 지정합니다.
