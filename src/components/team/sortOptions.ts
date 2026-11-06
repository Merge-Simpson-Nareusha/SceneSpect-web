import type { TeamSort } from './types'
import recent from '../../assets/icons/team/sort-recent.svg'
import recentSelected from '../../assets/icons/team/sort-recent-selected.svg'
import name from '../../assets/icons/team/sort-name.svg'
import nameSelected from '../../assets/icons/team/sort-name-selected.svg'
import created from '../../assets/icons/team/sort-created.svg'
import createdSelected from '../../assets/icons/team/sort-created-selected.svg'

export const sortOptions: { value: TeamSort; label: string; icon: string; selectedIcon: string }[] =
  [
    { value: 'recent', label: '최근 활동순', icon: recent, selectedIcon: recentSelected },
    { value: 'name', label: '이름순', icon: name, selectedIcon: nameSelected },
    { value: 'created', label: '생성순', icon: created, selectedIcon: createdSelected },
  ]
