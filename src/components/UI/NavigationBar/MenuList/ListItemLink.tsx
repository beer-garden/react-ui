import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import * as React from 'react'
import { forwardRef, useMemo } from 'react'
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom'
import { NavigationBarContext } from '../NavigationBarContext'

interface ListItemLinkProps {
  icon?: React.ReactElement
  primary: string
  to: string
  sx?: object
}

const ListItemLink = ({ icon, primary, to, sx }: ListItemLinkProps) => {
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
  const toggleDrawer = React.useContext(NavigationBarContext)

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
