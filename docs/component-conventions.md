# 현재 컴포넌트 작성 기준

2026-11-04 기준 프로젝트 설정과 main의 인증, 00 공통, 01 소개, 작업 중인 03 팀 관리 코드를 비교한 기록입니다. 새 팀 규칙을 추가하는 문서가 아니라 현재 적용된 방식과 유지할 차이를 설명합니다.

## 설정에 있는 규칙

- React + TypeScript의 `.tsx` 파일, Tailwind CSS를 사용합니다.
- `.prettierrc.json`: 작은따옴표, 세미콜론 생략, 후행 쉼표, 줄 너비 100, `prettier-plugin-tailwindcss`의 클래스 자동 정렬을 사용합니다.
- `eslint.config.js`: JavaScript/TypeScript 권장 규칙, React Hooks, React Refresh 검사를 사용합니다.
- CSS 클래스 이름의 BEM 접두사, ID 접두사, import 순서나 hex 대소문자를 별도로 강제하는 설정은 없습니다.

## 기존 코드에서 공유하는 방식

- 컴포넌트와 파일은 `AuthFormField`, `AccountButton`, `VideoControl`, `TeamCard`처럼 PascalCase로 씁니다. 일반 변수와 함수, props는 camelCase를 사용합니다.
- 스타일은 `className`에 Tailwind 유틸리티로 작성합니다. 여러 상태에 필요한 문자열을 변수나 함수로 나누는 패턴도 사용합니다. 길이가 길다는 이유만으로 별도의 CSS 클래스를 만들 필요는 없습니다.
- 버튼 등 HTML 속성을 넓게 전달할 때는 React의 `ButtonHTMLAttributes` 등을 사용합니다. API에 해당하는 props와 DOM 속성이 겹치면 `Omit`으로 분리합니다.
- 재사용 컴포넌트의 DOM 연결에는 기존 `AuthFormField`, `AccountButton`처럼 `useId()`를 사용합니다. 입력의 label과 안내/오류, 메뉴 및 탭은 실제 존재하는 ID에 연결합니다. ID를 스타일 선택자로 쓰지는 않습니다.
- `onClick`, `onChange`, `onSave` 등으로 사용하는 페이지가 동작을 전달합니다. 화면 상태와 접근성 처리는 컴포넌트에서 담당합니다. 화면 전용 인증 처리까지 모두 동일한 구조로 바꾸지는 않습니다.
- 폰트는 `src/index.css`의 Pretendard 설정을 공유합니다. 00, 01, 03의 키보드 포커스는 `common/styles.ts`를 재사용합니다.
- `common`, `media`, `team`처럼 기능별 폴더를 사용하고 해당 폴더의 index에서 컴포넌트와 공개 타입을 내보냅니다. 인증 컴포넌트는 기존의 직접 import 방식을 유지합니다.
- 예시 데이터와 실행 확인용 UI는 `src/dev/`에 둡니다. `components-preview.html`로 접근하며 App이나 실제 라우팅에 미리보기 분기를 추가하지 않습니다.

## 유지한 차이

- 인증 화면은 rem, cqw, svh와 clamp를 사용해 화면에 맞춥니다. 00은 실사용 크기와 Figma 비교 크기를 제공하고, 01과 03은 각 Figma 컴포넌트의 px 크기를 주로 유지합니다. 단위를 일괄 변환하면 기존 디자인과 전역 rem 크기 보정의 영향을 바꾸므로 변환하지 않았습니다.
- 인증 코드의 `#16181D`, 00/03의 `#16181d`는 같은 색입니다. 대소문자를 맞추려고 기존 파일 전체를 바꾸지는 않습니다.
- 00의 버튼/계정 모서리 5px, CTA 8px과 03의 카드 12px, 정렬 행 10px/메뉴 16px은 각 디자인에서 다른 값입니다. 모든 컴포넌트에 하나의 반경을 강제하지 않습니다.
- `login-page-*`는 인증 페이지의 전역 CSS 보정에 사용되는 기존 이름입니다. 03에 같은 접두사를 붙이지 않습니다.

## 이번에 맞춘 부분

- main에 빠져 있던 기존 `feature/#11-common-ui`의 비활성 버튼 Hover 수정과 비활성/키보드 미리보기를 반영했습니다. 01 컴포넌트는 푸시된 브랜치와 차이가 없었습니다.
- 팀 카드와 멤버 행에 className 전달을 추가했습니다. 멤버 행은 showMenu:false를 자체적으로 처리해 단독 사용과 설정 창에서 동일하게 동작합니다.
- 03 컴포넌트 9개의 공개 Props 타입을 index에서 모두 내보냅니다.
- 조건부로 렌더링되는 설정 패널은 존재하는 패널에만 aria-controls를 연결합니다.
