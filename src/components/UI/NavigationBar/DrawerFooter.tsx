import SportsBarIcon from '@mui/icons-material/SportsBar'
import TopicIcon from '@mui/icons-material/Topic'
import {
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
} from '@mui/material'
import { Snackbar } from 'components/Snackbar'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import useVersion from 'hooks/useVersion'
import { useEffect, useState } from 'react'
import { VersionConfig } from 'types/config-types'
import { SnackbarState } from 'types/custom-types'

const DrawerFooter = () => {
  const { config } = ServerConfigContainer.useContainer()
  const [versionConfig, setVersionConfig] = useState<VersionConfig>()
  const [alert, setAlert] = useState<SnackbarState>()
  const { getVersion } = useVersion()

  useEffect(() => {
    getVersion()
      .then((response) => {
        setVersionConfig(response.data)
      })
      .catch((e) => {
        setAlert({
          severity: 'error',
          message: e.response?.data.message || e,
          doNotAutoDismiss: true,
        })
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <MenuList dense style={{ marginTop: 'auto' }}>
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
      {alert ? <Snackbar status={alert} /> : null}
    </MenuList>
  )
}

export { DrawerFooter }
