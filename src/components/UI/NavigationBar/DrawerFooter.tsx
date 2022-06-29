import useVersion from 'hooks/useVersion'
import useConfig from 'hooks/useConfig'
import {
  Divider,
  MenuItem,
  ListItemText,
  MenuList as MuiMenuList,
} from '@mui/material'

const DrawerFooter = () => {
  const config = useConfig()
  const versionConfig = useVersion()
  return (
    <MuiMenuList dense style={{ marginTop: `auto` }}>
      <Divider />
      <MenuItem disabled style={{ opacity: 'unset' }}>
        <ListItemText>
          Beer Garden <b>{versionConfig?.beer_garden_version}</b>
        </ListItemText>
      </MenuItem>
      <MenuItem
        component="a"
        href={`${config?.url_prefix}swagger/index.html?config=${config?.url_prefix}config/swagger`}
      >
        <ListItemText>Open API Documentation</ListItemText>
      </MenuItem>
    </MuiMenuList>
  )
}

export { DrawerFooter }
