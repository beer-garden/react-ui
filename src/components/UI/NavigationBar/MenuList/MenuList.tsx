import AccessTimeIcon from '@mui/icons-material/AccessTime'
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople'
import FactoryIcon from '@mui/icons-material/Factory'
import { Divider, MenuList as MuiMenuList } from '@mui/material'
import { AdminMenu } from 'components/UI/NavigationBar/MenuList/AdminMenu'
import { ListItemLink } from 'components/UI/NavigationBar/MenuList/ListItemLink'
import { OptionsMenu } from 'components/UI/NavigationBar/MenuList/OptionsMenu'
import * as React from 'react'

const MenuList = () => {
  return (
    <MuiMenuList>
      {mainEntries.map((entry: mainEntriesType) => {
        return (
          <ListItemLink
            to={entry.path}
            primary={entry.displayName}
            key={entry.key}
            icon={entry.icon}
            sx={{pl: 1}}
          />
        )
      })}
      <AdminMenu />
      <Divider />
      <OptionsMenu />
    </MuiMenuList>
  )
}

export { MenuList }

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
    icon: <FactoryIcon fontSize="small" />,
  },
  {
    key: 'bgMenuEntry0002',
    path: '/requests',
    displayName: 'Requests',
    icon: <EmojiPeopleIcon fontSize="small" />,
  },
  {
    key: 'bgMenuEntry0003',
    path: '/jobs',
    displayName: 'Scheduler',
    icon: <AccessTimeIcon fontSize="small" />,
  },
]
