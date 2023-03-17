import {
  Card,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import { AxiosError } from 'axios'
import OverflowTooltip from 'components/OverflowTooltip'
import { PermissionsContainer } from 'containers/PermissionsContainer'
import { SocketContainer } from 'containers/SocketContainer'
import { useMountedState } from 'hooks/useMountedState'
import { useSystems } from 'hooks/useSystems'
import { SystemAdminCard } from 'pages/SystemAdmin'
import { useCallback, useEffect } from 'react'
import { System } from 'types/backend-types'

const SystemsCard = ({setError}: {setError: (error: AxiosError) => void}) => {
  const { hasSystemPermission } = PermissionsContainer.useContainer()
  const { getSystems } = useSystems()
  const [groupedSystems, setGroupedSystems] = useMountedState<{[name: string]: System[]}>({})
  const { addCallback, removeCallback } = SocketContainer.useContainer()

  const updateSystems = useCallback(() => {
    getSystems()
      .then((response) => {
        const groupedSystems: {[name: string]: System[]} = {}
        response.data.forEach((system: System) => {
          if(hasSystemPermission('system:update', system.id)){
            if(!groupedSystems[system.name]){
              groupedSystems[system.name] = []
            }
            groupedSystems[system.name].push(system)
          }
        })
        setGroupedSystems(groupedSystems)
      })
      .catch((e) => {
        setError(e)
      })
  }, [
    getSystems,
    hasSystemPermission,
    setError,
    setGroupedSystems
  ])

  useEffect(() => {
    updateSystems()
    addCallback('system_updates', (event) => {
      if (['SYSTEM_UPDATED', 'INSTANCE_UPDATED'].includes(event.name)
      ) {
        updateSystems()
      }
    })
    return () => {
      removeCallback('system_updates')
    }
  }, [addCallback, removeCallback, updateSystems])

  return (
    <Grid
      container
      columns={3}
      columnSpacing={2}
      rowSpacing={2}
    >
      {Object.entries(groupedSystems)
        .sort((a: [string, System[]], b: [string, System[]]) => (a[0] > b[0] ? 1 : -1))
        .map(([name, systems]) => (
          <Grid
            item
            key={'system' + name}
            xs={1}
            sx={{minWidth: '400px'}}
          >
            <Card sx={{ backgroundColor: 'background.default', height: '100%'}}>
              <Typography sx={{
                    backgroundColor: 'primary.main',
                  }} variant="h4" color="common.white" p={1}>
                  <OverflowTooltip
                    color="common.white"
                    variant="h3"
                    tooltip={name}
                    text={name}
                    css={{ py: 0 }}
                  />
              </Typography>
              <Stack sx={{m: 2}} spacing={2}>
                  {systems.sort((a: System, b: System) => (a.namespace > b.namespace ? 1 : -1)).map((system: System) => (
                    <SystemAdminCard key={system.id} system={system} />
                  ))}
              </Stack>
            </Card>
          </Grid>
        ))}
    </Grid>
  )
}

export { SystemsCard }
