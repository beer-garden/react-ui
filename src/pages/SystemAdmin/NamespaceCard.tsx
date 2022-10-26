import {
  Alert,
  Card,
  CardContent,
  Collapse,
  Grid,
  Typography,
} from '@mui/material'
import { Snackbar } from 'components/Snackbar'
import { SocketContainer } from 'containers/SocketContainer'
import { useSystems } from 'hooks/useSystems'
import {
  alertStyle,
  sortSystems,
  systemIcon,
  systemsSeverity,
} from 'pages/SystemAdmin'
import SystemCard from 'pages/SystemAdmin/SystemAdminCard'
import { useEffect, useState } from 'react'
import { System } from 'types/backend-types'
import { SnackbarState } from 'types/custom-types'

const NamespaceCard = ({ namespace }: { namespace: string }) => {
  const [systems, setSystems] = useState<System[]>([])
  const [alert, setAlert] = useState<SnackbarState | undefined>(undefined)
  const [expanded, setExpanded] = useState(true)

  const { getSystems } = useSystems()
  const { addCallback, removeCallback } = SocketContainer.useContainer()

  const updateSystems = () => {
    getSystems()
      .then((response) => {
        setSystems(response.data)
      })
      .catch((e) => {
        setAlert({
          severity: 'error',
          message: e,
          doNotAutoDismiss: true,
        })
      })
  }

  useEffect(() => {
    addCallback('system_updates', (event) => {
      if (
        event.name === 'INSTANCE_UPDATED' ||
        event.name === 'SYSTEM_REMOVED'
      ) {
        updateSystems()
      }
    })
    return () => {
      removeCallback('system_updates')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addCallback, removeCallback])

  useEffect(() => {
    updateSystems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const filteredSystems = systems.filter(
    (system: System) => system.namespace === namespace,
  )
  const sortedSystems = sortSystems(filteredSystems)

  return (
    <>
      <Card>
        <Alert
          variant="outlined"
          sx={{
            ...alertStyle,
            backgroundColor: 'primary.main',
          }}
          icon={systemIcon(filteredSystems) ? undefined : false}
          severity={systemsSeverity(filteredSystems)}
          onClick={handleExpandClick}
          title="Click to collapse"
        >
          <Typography variant="h6" color="common.white" p={0.25}>
            {namespace}
          </Typography>
        </Alert>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Grid
              container
              flexWrap="wrap"
              flexDirection="row"
              key={'systems' + namespace}
            >
              {Object.keys(sortedSystems)
                .sort((a: string, b: string) => (a > b ? 1 : -1))
                .map((key: string, index: number) => (
                  <Grid
                    item
                    key={'systems' + index + namespace}
                    minWidth={0.1}
                    p={0.25}
                    maxWidth={0.3}
                  >
                    <SystemCard systems={sortedSystems[key]} />
                  </Grid>
                ))}
            </Grid>
          </CardContent>
        </Collapse>
      </Card>

      {alert && <Snackbar status={alert} />}
    </>
  )
}

export { NamespaceCard }
