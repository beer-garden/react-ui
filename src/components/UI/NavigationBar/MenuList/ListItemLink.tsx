import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useMemo, forwardRef } from 'react'
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom'
import { FC, KeyboardEvent, MouseEvent } from 'react'

interface ListItemLinkProps {
  icon?: React.ReactElement
  primary: string
  to: string
  toggleDrawer: (open: boolean) => (event: KeyboardEvent | MouseEvent) => void
  sx?: object
}

const ListItemLink: FC<ListItemLinkProps> = ({
  icon,
  primary,
  to,
  toggleDrawer,
  sx,
}) => {
  const renderLink = useMemo(
    () =>
      forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, 'to'>>(function Link (
        itemProps,
        ref
      ) {
        return <RouterLink to={to} ref={ref} {...itemProps} role={undefined} />
      }),
    [to]
  )

  return (
    <ListItemButton
      component={renderLink}
      onClick={toggleDrawer(false)}
      sx={sx}
    >
      {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
      <ListItemText primary={primary} />
    </ListItemButton>
  )
}

export default ListItemLink
