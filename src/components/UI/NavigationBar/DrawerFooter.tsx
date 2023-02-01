import SportsBarIcon from '@mui/icons-material/SportsBar'
import TopicIcon from '@mui/icons-material/Topic'
import {
  Box,
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
} from '@mui/material'
import { Snackbar } from 'components/Snackbar'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useMountedState } from 'hooks/useMountedState'
import useVersion from 'hooks/useVersion'
import { useEffect } from 'react'
import { VersionConfig } from 'types/config-types'
import { SnackbarState } from 'types/custom-types'

const DrawerFooter = () => {
  const { config } = ServerConfigContainer.useContainer()
  const [versionConfig, setVersionConfig] = useMountedState<
    VersionConfig | undefined
  >()
  const [alert, setAlert] = useMountedState<SnackbarState | undefined>()
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
  }, [getVersion, setAlert, setVersionConfig])

  return (
    <Box style={{ marginTop: 'auto' }}>
      <Divider />
      <MenuList dense>
        <MenuItem disabled style={{ opacity: 'unset' }} sx={{ pl: 1 }}>
          <ListItemIcon>
            <SportsBarIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            Beer Garden <b>{versionConfig?.beer_garden_version}</b>
          </ListItemText>
        </MenuItem>
        <ListItemButton
          href={`${config?.url_prefix}swagger/index.html?config=${config?.url_prefix}config/swagger`}
          sx={{ pl: 1 }}
          component="a"
          data-testid="apiLink"
        >
          <ListItemIcon>
            <TopicIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText sx={{ ml: -2.5 }}>OpenAPI Documentation</ListItemText>
        </ListItemButton>
        {alert ? <Snackbar status={alert} /> : null}
      </MenuList>
    </Box>
  )
}

export { DrawerFooter }
