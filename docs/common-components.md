# 00 · 공통 컴포넌트

React + TypeScript + Tailwind CSS로 구현한 데스크톱 UI입니다. 인증 API는 호출하지 않습니다.

## 미리보기

`npm run dev` 후 다음 주소를 엽니다.

- `http://localhost:5173/components-preview.html`: 00 전체, 버튼 기본·Hover 예시, 계정 드롭다운
- `http://localhost:5173/components-preview.html?preview=header`: 실제 페이지 상단에 배치한 헤더
- `/`: 기존 회원가입 화면

미리보기는 `components-preview.html`과 `src/dev/`의 별도 개발용 진입점을 사용합니다.
기존 `App.tsx`와 `src/main.tsx`에는 미리보기 분기를 추가하지 않습니다.
기본 `npm run build`는 `index.html`만 진입점으로 사용하므로 미리보기 HTML과 전용 코드는 배포 결과에 포함되지 않습니다.
미리보기에서만 사용하는 Mac 메뉴바도 `src/dev/`에 둡니다.

## Figma 대응

| Figma                 | 코드                           | 지원 내용                                          |
| --------------------- | ------------------------------ | -------------------------------------------------- |
| Brand/Logo            | BrandLogo                      | full, symbol, wordmark                             |
| Button/Base           | CommonButton, CommonButtonLink | compactLight, compactDark, ctaLight, ctaDark       |
| Button/Base · Account | AccountButton                  | 기본, Hover, Open 및 프로필·설정·로그아웃          |
| Navigation/Header     | NavigationHeader               | guest, signedIn                                    |
| Shared/MacMenuBar     | MockMacMenuBar                 | 미리보기 체크박스로만 표시하는 검은색 33px 목업 바 |

헤더는 16px 메뉴·계정 글씨와 164px 로고를 사용합니다.
기본 실사용 크기는 일반 버튼 16px·높이 44px, CTA 20px·높이 56px입니다.
Figma 원본 색상·형태를 유지하면서 실사용에 맞게 글씨와 여백을 조정했습니다.
원본 버튼 크기는 `size="design"`으로 선택할 수 있고, 미리보기의 비교 체크박스로 확인합니다.
계정 이름은 내용에 따라 늘어나며, 헤더의 가용 폭을 넘는 경우 말줄임 대신 줄바꿈합니다.
드롭다운도 내용에 따라 늘어나고, 최대 폭을 넘는 이름·이메일은 전체를 줄바꿈해서 표시합니다.
모바일용 레이아웃은 아직 포함하지 않습니다.

## 사용 예시

```tsx
import { BrandLogo, CommonButton, CommonButtonLink, AccountButton } from './components/common'
import NavigationHeader from './components/layout/NavigationHeader'

<BrandLogo variant="full" />
<BrandLogo variant="wordmark" width={160} />
<CommonButton variant="compactDark" onClick={handleConfirm}>확인</CommonButton>
<CommonButtonLink variant="ctaLight" href="/login">로그인 하러가기</CommonButtonLink>
<AccountButton
  userName="희린"
  email="example@gmail.com"
  profileHref="/profile"
  settingsHref="/settings"
  onLogout={handleLogout}
/>
<NavigationHeader
  auth="signedIn"
  userName="희린"
  email="example@gmail.com"
  profileHref="/profile"
  settingsHref="/settings"
  onLogout={handleLogout}
  activeHref="/service"
  links={[
    { label: '서비스', href: '/service' },
    { label: '프로젝트 소개', href: '/projects' },
    { label: '팀 소개', href: '/team' },
  ]}
/>
```

예시 경로와 콜백은 페이지 담당자가 실제 라우팅·인증 처리에 연결해야 합니다.
`previewState="hover"`는 미리보기에서 Hover 색상을 고정하기 위한 옵션입니다.
실제 컴포넌트는 마우스 Hover와 키보드 포커스를 자체 지원합니다.

계정 드롭다운 정렬은 `align="start"`(기본) 또는 `align="end"`로 지정합니다.
헤더에서는 `align="end"`를 사용합니다. `size`는 크기만 담당하며 `default`, `design` 중 선택합니다.

계정 드롭다운은 기본적으로 내부 상태로 동작합니다. 부모가 제어하려면
`AccountButton`에 `open`, `onOpenChange`를 함께 전달하거나,
`NavigationHeader`에 `accountOpen`, `onAccountOpenChange`를 함께 전달합니다.
바깥 클릭·Escape·포커스가 컴포넌트 밖으로 이동하면 닫히며, Escape는 버튼으로 포커스를 돌려줍니다.
API 호출이나 실제 로그아웃 처리는 부모의 `onLogout` 콜백이 담당합니다.

기존 `components/auth/Button.tsx`는 인증 화면 전용으로 유지합니다.
다른 팀원이 작업 중인 로그인·회원가입 화면을 이 변경으로 일괄 교체하지 않습니다.

## 확인

```bash
npm run build
npm run lint
```

미리보기에서 로고 3종, 버튼 4종의 기본·Hover 상태, 로그인 전후 헤더,
계정 Open·Escape·바깥 클릭·Tab 닫기, 긴 이름과 공백 이름을 확인할 수 있습니다.
목업용 Mac 메뉴바는 실제 웹 UI가 아니라는 Figma 설명에 따라 별도 미리보기로 제한합니다.
