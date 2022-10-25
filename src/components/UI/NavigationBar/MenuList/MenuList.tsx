import AccessTimeIcon from '@mui/icons-material/AccessTime'
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople'
import FactoryIcon from '@mui/icons-material/Factory'
import { Divider, MenuList as MuiMenuList } from '@mui/material'
import { AdminMenu } from 'components/UI/NavigationBar/MenuList/AdminMenu'
import { ListItemLink } from 'components/UI/NavigationBar/MenuList/ListItemLink'
import { LogoutButton } from 'components/UI/NavigationBar/MenuList/LogoutButton'
import { OptionsMenu } from 'components/UI/NavigationBar/MenuList/OptionsMenu'
import { AuthContainer } from 'containers/AuthContainer'
import { PermissionsContainer } from 'containers/PermissionsContainer'
import { ReactElement } from 'react'

const MenuList = () => {
  const { user } = AuthContainer.useContainer()
  const { hasPermission } = PermissionsContainer.useContainer()

  return (
    <MuiMenuList>
      {mainEntries.map((entry: mainEntriesType) => (
        <ListItemLink
          to={entry.path}
          primary={entry.displayName}
          key={entry.key}
          icon={entry.icon}
          sx={{ pl: 1 }}
        />
      ))}
      {hasPermission('job:read') && (
        <ListItemLink
          to="/jobs"
          primary="Scheduler"
          key="bgMenuEntry0003"
          icon={<AccessTimeIcon fontSize="small" />}
          sx={{ pl: 1 }}
        />
      )}
      {(hasPermission('system:update') || hasPermission('garden:update')) && (
        <AdminMenu />
      )}
      <Divider />
      <OptionsMenu />
      {user && <LogoutButton />}
    </MuiMenuList>
  )
}

export { MenuList }

type mainEntriesType = {
  key: string
  path: string
  displayName: string
  icon?: ReactElement
  permission?: string
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
]
