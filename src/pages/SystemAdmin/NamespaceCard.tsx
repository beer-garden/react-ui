import {
  Alert,
  Card,
  CardContent,
  Collapse,
  Grid,
  Typography,
} from '@mui/material'
import { PermissionsContainer } from 'containers/PermissionsContainer'
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

const NamespaceCard = ({ namespace }: { namespace: string }) => {
  const { hasSystemPermission } = PermissionsContainer.useContainer()
  const systemClient = useSystems()
  const systems = systemClient.systems
  const [expanded, setExpanded] = useState(true)
  const [permission, setPermission] = useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const filteredSystem = systems.filter(
    (system: System) => system.namespace === namespace,
  )
  useEffect(() => {
    const fetchPermission = async () => {
      if (filteredSystem[0]) {
        const permCheck = await hasSystemPermission(
          'system:update',
          namespace,
          filteredSystem[0].id,
        )
        setPermission(permCheck || false)
      }
    }
    fetchPermission()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namespace, filteredSystem[0]])

  if (!systems) {
    return <></>
  }

  const sortedSystems = sortSystems(filteredSystem)

  return (
    <>
      {permission && (
        <Card>
          <Alert
            variant="outlined"
            sx={{
              ...alertStyle,
              backgroundColor: 'primary.main',
            }}
            icon={systemIcon(filteredSystem) ? undefined : false}
            severity={systemsSeverity(filteredSystem)}
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
      )}
    </>
  )
}

export { NamespaceCard }
