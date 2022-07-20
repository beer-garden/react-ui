import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  LibraryBooks as LibraryBooksIcon,
} from '@mui/icons-material'
import BlockIcon from '@mui/icons-material/Block'
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
import { ListItemLink } from 'components/UI/NavigationBar/MenuList/ListItemLink'
import { NavigationBarContext } from 'components/UI/NavigationBar/NavigationBarContext'
import { Fragment, useState } from 'react'
import * as React from 'react'

const AdminMenu = () => {
  const [open, setOpen] = useState(false)

  const handleClick = () => setOpen(!open)

  const drawerIsOpen = React.useContext(NavigationBarContext).drawerIsOpen

  if (!drawerIsOpen && open) {
    setOpen(drawerIsOpen)
  }

  return (
    <Fragment>
      <ListItemButton sx={{ pl: 1 }} onClick={handleClick}>
        <ListItemIcon>
          <LibraryBooksIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary={'Admin'} />
        {open ? (
          <ExpandLessIcon fontSize="small" />
        ) : (
          <ExpandMoreIcon fontSize="small" />
        )}
      </ListItemButton>
      <Collapse in={open && drawerIsOpen} timeout={'auto'} unmountOnExit>
        <Divider />
        <MenuList>
          <ListItemLink
            icon={<LocalFloristIcon fontSize="small" />}
            primary={'Gardens'}
            to={'/admin/gardens'}
            sx={{ pl: 3 }}
          />
          <ListItemLink
            icon={<FactoryIcon fontSize="small" />}
            primary={'Systems'}
            to={'/admin/systems'}
            sx={{ pl: 3 }}
          />
          <ListItemLink
            icon={<BlockIcon fontSize="small" />}
            primary={'Command Publishing Blocklist'}
            to={'/admin/commandblocklist'}
            sx={{ pl: 3 }}
          />
        </MenuList>
      </Collapse>
    </Fragment>
  )
}

export { AdminMenu }
