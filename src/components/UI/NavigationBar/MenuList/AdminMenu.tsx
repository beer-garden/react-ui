import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  LibraryBooks as LibraryBooksIcon,
} from '@mui/icons-material'
import FactoryIcon from '@mui/icons-material/Factory'
import LocalFloristIcon from '@mui/icons-material/LocalFlorist'
import {
  Collapse,
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuList,
} from '@mui/material'
import { FC, Fragment, KeyboardEvent, MouseEvent, useState } from 'react'
import ListItemLink from './ListItemLink'

interface AdminMenuProps {
  toggleDrawer: (open: boolean) => (event: KeyboardEvent | MouseEvent) => void
}

const AdminMenu: FC<AdminMenuProps> = ({ toggleDrawer }) => {
  const [open, setOpen] = useState(false)

  const handleClick = () => setOpen(!open)

  return (
    <Fragment>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <LibraryBooksIcon />
        </ListItemIcon>
        <ListItemText primary={'Admin'} />
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>
      <Collapse in={open} timeout={'auto'} unmountOnExit>
        <Divider />
        <MenuList>
          <ListItemLink
            icon={<LocalFloristIcon />}
            primary={'Gardens'}
            to={'/admin/gardens'}
            toggleDrawer={toggleDrawer}
            sx={{ pl: 4 }}
          />
          <ListItemLink
            icon={<FactoryIcon />}
            primary={'Systems'}
            to={'/admin/systems'}
            toggleDrawer={toggleDrawer}
            sx={{ pl: 4 }}
          />
        </MenuList>
      </Collapse>
    </Fragment>
  )
}

export default AdminMenu
