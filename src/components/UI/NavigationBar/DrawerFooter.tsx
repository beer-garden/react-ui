import SportsBarIcon from '@mui/icons-material/SportsBar'
import TopicIcon from '@mui/icons-material/Topic'
import {
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList as MuiMenuList,
} from '@mui/material'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import useVersion from 'hooks/useVersion'

const DrawerFooter = () => {
  const { config } = ServerConfigContainer.useContainer()
  const versionConfig = useVersion()
  return (
    <MuiMenuList dense style={{ marginTop: 'auto' }}>
      <Divider />
      <MenuItem disabled style={{ opacity: 'unset' }} sx={{ pl: 1 }}>
        <ListItemIcon>
          <SportsBarIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>
          Beer Garden <b>{versionConfig?.beer_garden_version}</b>
        </ListItemText>
      </MenuItem>
      <MenuItem
        sx={{ pl: 1 }}
        component="a"
        data-testid="apiLink"
        href={`${config?.url_prefix}swagger/index.html?config=${config?.url_prefix}config/swagger`}
      >
        <ListItemIcon>
          <TopicIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>OpenAPI Documentation</ListItemText>
      </MenuItem>
    </MuiMenuList>
  )
}

export { DrawerFooter }
