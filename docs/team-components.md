# 03 팀 관리 컴포넌트

Figma `04_Component > 03 팀 관리`의 재사용 뷰입니다. 관련 이슈는 #17이고, 팀 목록 페이지 구현은 #16에서 진행합니다.

## 구성

| Figma               | 파일                                         | 역할                                          |
| ------------------- | -------------------------------------------- | --------------------------------------------- |
| Team/Card           | `src/components/team/TeamCard.tsx`           | 팀 이름, 설명, 프로필, 멤버, 열기와 설정 동작 |
| Team/CreateButton   | `src/components/team/TeamCreateButton.tsx`   | 새 팀, 초대, 저장 버튼                        |
| Team/ListHeader     | `src/components/team/TeamListHeader.tsx`     | 제목, 정렬, 새 팀 버튼 배치                   |
| Team/SortButton     | `src/components/team/TeamSortButton.tsx`     | 정렬 메뉴 열기와 닫기                         |
| Team/SortMenu       | `src/components/team/TeamSortMenu.tsx`       | 세 가지 정렬 선택                             |
| Team/SortItem       | `src/components/team/TeamSortItem.tsx`       | 정렬 옵션 행                                  |
| Team/SortIcon       | `src/components/team/TeamSortIcon.tsx`       | 정렬 기준별 기본, 선택 아이콘                 |
| Team/MemberRow      | `src/components/team/TeamMemberRow.tsx`      | 멤버 이름, 역할, 더보기 버튼                  |
| Team/SettingsDialog | `src/components/team/TeamSettingsDialog.tsx` | 기본 정보, 프로필 변경, 멤버 관리 모달        |

## 페이지에서 연결

```tsx
import { TeamListHeader, TeamCard, TeamSettingsDialog } from './components/team'

<TeamListHeader
  sort={sort}
  onSortChange={setSort}
  onCreate={openTeamCreate}
/>

<TeamCard
  name={team.name}
  description={team.description}
  role={myRole}
  memberCount={team.memberCount}
  members={team.members}
  avatarSrc={team.avatarSrc}
  onOpen={openTeam}
  onSettings={openTeamSettings}
/>

<TeamSettingsDialog
  open={settingsOpen}
  onClose={closeSettings}
  value={draft}
  onChange={setDraft}
  onSave={saveTeam}
  members={members}
  onAvatarChange={selectTeamAvatar}
  onInvite={openMemberInvite}
  onMemberMenu={openMemberMenu}
  onTransferRequest={openLeaderTransfer}
  onDeleteRequest={openDeleteConfirmation}
  saving={saving}
  saveError={saveError}
/>
```

- 데이터와 실행 동작은 사용하는 페이지에서 전달합니다. 라우팅, 목록 조회, 정렬 API, 업로드, 저장, 삭제, 초대와 권한 변경 요청은 컴포넌트 안에서 실행하지 않습니다.
- `TeamSort`는 `recent`, `name`, `created`입니다. 선택된 기준을 페이지에 전달하며, 실제 목록 정렬은 페이지가 담당합니다.
- Figma의 일부 정렬 변형 이름과 화면에서 선택된 항목이 서로 다릅니다. 코드에서는 화면의 라벨을 기준으로 의미를 일치시켰습니다.
- `TeamCard`는 전체 카드의 열기 버튼과 별도의 설정 버튼을 둡니다. 설정 버튼은 팀 열기 동작을 실행하지 않습니다.
- 카드의 `members`를 전달하면 실제 멤버 이미지 또는 이름 첫 글자를 최대 5개 표시합니다. 생략하면 Figma의 장식용 프로필 묶음을 표시합니다. 실제 사용자 목록을 연결할 때는 `members`를 전달합니다.
- `TeamMember.showMenu: false` 또는 `TeamMemberRow`의 `onMenuClick` 생략으로 더보기 버튼을 감출 수 있습니다. 단독으로 사용해도 같은 규칙을 적용합니다. 권한 판단과 메뉴 내용은 페이지에서 결정합니다.
- `TeamCard`, `TeamMemberRow`, `TeamListHeader`는 `className`으로 페이지 배치에 필요한 클래스를 전달할 수 있습니다. 기본 크기와 내부 디자인은 컴포넌트가 담당합니다. 같은 CSS 속성을 여러 클래스로 중복 지정하기보다 바깥 레이아웃에서 간격과 배치를 정합니다.
- 설정 입력값은 `value`, `onChange`로 제어합니다. 저장 성공 후 닫기와 오류 표시는 페이지에서 처리합니다. `saving`과 `saveError`로 저장 상태를 전달할 수 있습니다.
- 팀 이름, 팀 가이드라인은 디자인에 표시된 필수 항목입니다. 유튜브 링크는 선택 항목이며 입력한 경우 URL 형식을 확인합니다. 서버의 추가 검증 규칙은 페이지에서 처리합니다.
- 필수 입력이나 링크 형식에 문제가 있으면 기본 정보 탭의 해당 입력으로 이동하고 오류를 바로 아래에 표시합니다. 저장 실패 안내에도 포커스를 옮겨 화면 안에서 확인할 수 있게 합니다.
- `saving`일 때 입력, 프로필 변경, 멤버 메뉴, 초대, 삭제, 이관, 저장과 닫기 동작을 막습니다. 탭 전환으로 입력 내용은 계속 확인할 수 있습니다.
- `onAvatarChange`는 선택한 `File`을 전달합니다. 이미지 확인, 임시 URL 생성과 해제, 실제 업로드는 페이지가 담당합니다.
- 삭제와 팀장 이관은 요청 콜백만 호출합니다. 확인 화면과 실제 실행은 페이지에서 연결합니다.

## 디자인과 조작

- 원본 SVG 19개는 `src/assets/icons/team/`에 보관합니다. 원본 크기를 유지하며 외부 Figma 주소는 실행 코드에 남기지 않습니다.
- 카드 420x260px, 기본 버튼 높이 50px, 정렬 메뉴 너비 300px, 설정 창 너비 1000px로 구현했습니다. 글씨, 색상, 모서리는 각 Figma 컴포넌트 기준입니다.
- 설정 창은 화면보다 높을 때 내부를 스크롤합니다. 멤버 행은 설정 창의 내부 너비에 맞춰 늘어나고 긴 이름은 줄바꿈합니다. 모바일 전용 디자인은 추가하지 않았습니다.
- 가이드라인 입력칸은 기본 높이 138px이며 세로로 늘리면 주변 내용도 함께 밀려나도록 구현했습니다. 오류 안내가 표시될 때도 필드 높이가 늘어납니다.
- 디자인의 '맴버' 표기는 '멤버'로 바로잡았습니다. 멤버 수는 전달된 배열 길이를 표시합니다.
- 공통 포커스 스타일을 재사용합니다. 정렬은 방향키, Home, End, Enter, Space, Escape, Tab, 바깥 클릭을 지원합니다.
- 모달은 native `dialog`를 사용해 배경을 비활성화하고, Tab 이동을 내부에 가둡니다. Escape, 닫기, 취소, 배경 클릭으로 닫고 열었던 요소로 포커스를 돌려줍니다.
- 프로필의 Hover 이미지는 키보드 포커스에서도 표시합니다. 비활성 생성 버튼에는 Hover 색상을 적용하지 않습니다.

## 개발용 미리보기

`npm run dev` 후 `http://localhost:5173/components-preview.html?preview=team`에서 확인합니다.
00과 01 미리보기에서도 03으로 이동할 수 있습니다. 미리보기는 기본 배포 빌드에 포함되지 않습니다.

예시 팀과 멤버, 정렬, 저장과 취소 확인은 `src/dev/TeamPreviewPage.tsx` 안에서만 처리합니다.
저장은 미리보기 메모리에만 반영하고 페이지를 새로고침하면 초기화합니다. 이미지 파일도 브라우저에서만 사용합니다.

`저장 중, 저장 실패 상태 확인(개발용)`을 선택하고 필수 항목을 채워 저장하면 5초 동안 저장 중 상태를 표시한 뒤 실패 안내를 보여줍니다. 입력값은 유지되며 서버 요청은 보내지 않습니다. 선택을 해제하면 기존 메모리 저장을 확인할 수 있습니다.

작성 방식과 기존 인증/00/01 코드와의 차이는 [컴포넌트 작성 기준](./component-conventions.md)에 정리했습니다.
