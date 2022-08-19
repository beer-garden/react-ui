import {
  Alert,
  Card,
  CardContent,
  Collapse,
  Grid,
  Typography,
} from '@mui/material'
import useSystems from 'hooks/useSystems'
import {
  alertStyle,
  sortSystems,
  systemIcon,
  systemsSeverity,
} from 'pages/SystemAdmin'
import SystemCard from 'pages/SystemAdmin/SystemAdminCard'
import { useState } from 'react'
import { System } from 'types/backend-types'

const NamespaceCard = ({ namespace }: { namespace: string }) => {
  const systemClient = useSystems()
  const systems = systemClient.getSystems()
  const [expanded, setExpanded] = useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  if (!systems) {
    return <></>
  }
  const filteredSystem = systems.filter(
    (system: System) => system.namespace === namespace,
  )
  const sortedSystems = sortSystems(filteredSystem)

  return (
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
  )
}

export { NamespaceCard }
