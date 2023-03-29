import {
    Cached as CachedIcon,
    Delete as DeleteIcon,
    PlayCircleFilled as PlayCircleFilledIcon,
    Stop as StopIcon,
  } from '@mui/icons-material'
  import {
    Card,
    CardActions,
    CardContent,
    Divider,
    IconButton,
    Stack,
    Toolbar,
    Tooltip,
    Typography,
  } from '@mui/material'
  import { Snackbar } from 'components/Snackbar'
  import { useInstances } from 'hooks/useInstances'
  import { useMountedState } from 'hooks/useMountedState'
  import { useSystems } from 'hooks/useSystems'
  import SystemCardInstances from 'pages/SystemAdmin/SystemCardInstances'
  import { Link as RouterLink } from 'react-router-dom'
  import { System } from 'types/backend-types'
  import { SnackbarState } from 'types/custom-types'
  
  const SystemAdminCard = ( { system }: { system: System } ) => {
    const { startAllInstances, stopAllInstances } = useInstances()
    const { reloadSystem, deleteSystem } = useSystems()
    const [alert, setAlert] = useMountedState<SnackbarState | undefined>()
  
    const handleReloadSystem = (systemId: string) => {
      reloadSystem(systemId).catch((e) => {
        setAlert({
          severity: 'error',
          message: e,
          doNotAutoDismiss: true,
        })
      })
    }
  
    const handleDeleteSystem = (systemId: string) => {
      deleteSystem(systemId).catch((e) => {
        setAlert({
          severity: 'error',
          message: e,
          doNotAutoDismiss: true,
        })
      })
    }
  
    return (
      <>
        <Card sx={{ backgroundColor: 'background.default'}}>
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Tooltip
                arrow
                title="View commands"
                placement="bottom-start"
              >
                <RouterLink
                  to={[
                    '/systems',
                    system.namespace,
                    system.name,
                    system.version,
                  ].join('/')}
                >
                  {`${system.namespace}/${system.version}`}
                </RouterLink>
              </Tooltip>
              <Toolbar variant="dense" >
                <Tooltip
                  arrow
                  title="Start all instances"
                  placement="bottom-start"
                >
                  <IconButton
                    size="small"
                    onClick={() => startAllInstances(system)}
                    aria-label="start"
                  >
                    <PlayCircleFilledIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip
                  arrow
                  title="Stop all instances"
                  placement="bottom-start"
                >
                  <IconButton
                    size="small"
                    onClick={() => stopAllInstances(system)}
                    aria-label="stop"
                  >
                    <StopIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip arrow title="Reload system" placement="bottom-start">
                  <IconButton
                    size="small"
                    onClick={() => handleReloadSystem(system.id)}
                    aria-label="reload"
                  >
                    <CachedIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip arrow title="Delete system" placement="bottom-start">
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteSystem(system.id)}
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Toolbar>
            </Stack>
            <Typography variant="body2">
              {system.description}
            </Typography>
          </CardContent>
          <Divider />
          <CardActions>
            <SystemCardInstances instances={system.instances} fileHeader={`${system.name}[${system.version}]`} />
          </CardActions>
        </Card>
        {alert && <Snackbar status={alert} />}
      </>
    )
  }
  
  export { SystemAdminCard }
  