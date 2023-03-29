import {
  Card,
  CardContent,
  Grid,
  Stack
} from '@mui/material'
import { AxiosError } from 'axios'
import OverflowTooltip from 'components/OverflowTooltip'
import { PermissionsContainer } from 'containers/PermissionsContainer'
import { SocketContainer } from 'containers/SocketContainer'
import useGardens from 'hooks/useGardens'
import { useMountedState } from 'hooks/useMountedState'
import { SystemAdminCard } from 'pages/SystemAdmin'
import { useCallback, useEffect } from 'react'
import { Garden, System } from 'types/backend-types'

const SystemsCard = ({setError}: {setError: (error: AxiosError) => void}) => {
  const { hasSystemPermission, hasGardenPermission } = PermissionsContainer.useContainer()
  const { getGardens } = useGardens()
  const [groupedSystems, setGroupedSystems] = useMountedState<{[name: string]: System[]}>({})
  const { addCallback, removeCallback } = SocketContainer.useContainer()

  const updateSystems = useCallback(() => {
    getGardens().then((response) => {
      const groupedSystems: {[name: string]: System[]} = {}
      const localGarden: Garden | undefined = response.data.find((garden: Garden) => (garden.connection_type === 'LOCAL'))
      if(localGarden && hasGardenPermission('system:update', localGarden)) {
        localGarden.systems.forEach((system: System) => {
          if(hasGardenPermission('system:update', localGarden) || hasSystemPermission('system:update', system.id)){
            if(!groupedSystems[system.name]){
              groupedSystems[system.name] = []
            }
            groupedSystems[system.name].push(system)
          }
        })
      }
      else { 
        response.data.forEach((garden: Garden) => {
          garden.systems.forEach((system: System) => {
            if(hasSystemPermission('system:update', system.id)){
              if(!groupedSystems[system.name]){
                groupedSystems[system.name] = []
              }
              groupedSystems[system.name].push(system)
            }
          })
        })
      }
      setGroupedSystems(groupedSystems)
    })
    .catch((e) => {
      setError(e)
    })
  }, [
    hasSystemPermission,
    hasGardenPermission,
    setError,
    setGroupedSystems,
    getGardens,
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
            <Card sx={{ height: '100%' }}>
                  <OverflowTooltip
                    color="common.white"
                    variant="h3"
                    tooltip={name}
                    text={name}
                    css={{ p: 1, backgroundColor: 'primary.main' }}
                  />
              <CardContent>
                <Stack spacing={2}>
                    {systems.sort((a: System, b: System) => (a.namespace > b.namespace ? 1 : -1)).map((system: System) => (
                      <SystemAdminCard key={system.id} system={system} />
                    ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
    </Grid>
  )
}

export { SystemsCard }
