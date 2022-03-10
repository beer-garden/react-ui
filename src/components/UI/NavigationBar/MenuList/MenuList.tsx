import AccessTimeIcon from '@mui/icons-material/AccessTime'
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople'
import FactoryIcon from '@mui/icons-material/Factory'
import InfoIcon from '@mui/icons-material/Info'
import { Divider, MenuList as MuiMenuList } from '@mui/material'
import { FC, KeyboardEvent, MouseEvent } from 'react'
import AdminMenu from './AdminMenu'
import ListItemLink from './ListItemLink'
import OptionsMenu from './OptionsMenu'

interface MenuListProps {
  toggleDrawer: (open: boolean) => (event: KeyboardEvent | MouseEvent) => void
}
const MenuList: FC<MenuListProps> = ({ toggleDrawer }) => {
  return (
    <MuiMenuList>
      {mainEntries.map((entry: mainEntriesType) => {
        return (
          <ListItemLink
            to={entry.path}
            primary={entry.displayName}
            key={entry.key}
            icon={entry.icon}
            toggleDrawer={toggleDrawer}
          />
        )
      })}
      <AdminMenu toggleDrawer={toggleDrawer} />
      <Divider />
      <ListItemLink
        to={'/about'}
        primary={'About'}
        icon={<InfoIcon />}
        toggleDrawer={toggleDrawer}
      />
      <OptionsMenu toggleDrawer={toggleDrawer} />
    </MuiMenuList>
  )
}

export default MenuList

type mainEntriesType = {
  key: string
  path: string
  displayName: string
  icon?: React.ReactElement
}

const mainEntries: mainEntriesType[] = [
  {
    key: 'bgMenuEntry0001',
    path: '/systems',
    displayName: 'Systems',
    icon: <FactoryIcon />,
  },
  {
    key: 'bgMenuEntry0002',
    path: '/requests',
    displayName: 'Requests',
    icon: <EmojiPeopleIcon />,
  },
  {
    key: 'bgMenuEntry0003',
    path: '/jobs',
    displayName: 'Scheduler',
    icon: <AccessTimeIcon />,
  },
]
