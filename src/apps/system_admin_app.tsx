import React, { FC, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import AppBar from '@material-ui/core/AppBar'
import CardContent from '@material-ui/core/CardContent'
import Card from '@material-ui/core/Card'
import Button from '@material-ui/core/Button'

import SystemsService from '../services/system_service'
import AdminService from '../services/admin_service'
import PageHeader from '../components/page_header'
import SystemCard from '../components/system_admin_card'
import Divider from '../components/divider'
import { System } from '../custom_types/custom_types'
import NamespaceSelect from '../components/namespace_select'
import CacheService from '../services/cache_service'
import { Alert } from '@material-ui/lab'

type MyProps = {
  namespaces: string[]
  systems: System[]
}

function formatSystems(
  namespaces: string[],
  allSystems: System[]
): { [key: string]: System[][] } {
  const sortedSystems: { [key: string]: System[][] } = {}
  for (const m in namespaces) {
    const namespace = namespaces[m]
    const system_names: string[] = []

    const systems: System[] = SystemsService.filterSystems(allSystems, {
      namespace: namespace,
    })
    sortedSystems[namespace] = []
    for (const i in systems) {
      if (!system_names.includes(systems[i].name)) {
        system_names.push(systems[i].name)
        sortedSystems[namespace].push(
          SystemsService.filterSystems(systems, {
            name: systems[i].name,
          })
        )
        sortedSystems[namespace][sortedSystems[namespace].length - 1] =
          SystemsService.sortSystemsVersion(
            sortedSystems[namespace][sortedSystems[namespace].length - 1]
          )
      }
    }
    sortedSystems[namespace].sort((a: System[], b: System[]) =>
      a[0].name > b[0].name ? 1 : -1
    )
  }
  return sortedSystems
}

function getSelectMessage(namespacesSelected: string[]): JSX.Element | void {
  if (!namespacesSelected.length) {
    return <Alert severity="info">Please select a namespace</Alert>
  }
}

const SystemsAdminApp: FC<MyProps> = ({ namespaces, systems }: MyProps) => {
  namespaces = namespaces.sort()
  const [namespacesSelected, setNamespacesSelected] = useState(
    CacheService.getNamespacesSelected(
      `lastKnown_${window.location.href}`,
      namespaces
    ).namespacesSelected
  )
  const sortedSystems = formatSystems(namespacesSelected, systems)
  const title = 'Systems Management'
  return (
    <Box>
      <Grid alignItems="flex-end" justify="space-between" container>
        <Grid key={'header'} item>
          <PageHeader title={title} description={''} />
        </Grid>
        <Grid key={'actions'} item>
          <Box display="flex" alignItems="center" flexDirection="row">
            <Box>
              <NamespaceSelect
                namespaces={namespaces}
                namespacesSelected={namespacesSelected}
                setNamespacesSelected={setNamespacesSelected}
              />
            </Box>
            <Box>
              <Button variant="contained" color="secondary">
                Clear All Queues
              </Button>
              <Button
                onClick={() => AdminService.rescan()}
                variant="contained"
                color="primary"
              >
                Rescan Plugin Directory
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Divider />
      <Box>
        {namespacesSelected.map((namespace: string) => (
          <Box py={1} key={namespace + 'box'}>
            <Card>
              <AppBar
                color="inherit"
                style={{ background: 'lightgray' }}
                position="static"
              >
                <Box p={0.5}>
                  <Typography variant="h5" color="inherit">
                    {namespace}
                  </Typography>
                </Box>
              </AppBar>
              <CardContent>
                <Grid container spacing={2}>
                  <Box
                    display="flex"
                    flexWrap="wrap"
                    flexDirection="row"
                    key={'systems' + namespace}
                  >
                    {sortedSystems[namespace].map(
                      (systems: System[], index: number) => (
                        <Box
                          key={'systems' + index + namespace}
                          minWidth={0.24}
                          p={1}
                          maxWidth={1 / 2}
                        >
                          <SystemCard systems={systems} namespace={namespace} />
                        </Box>
                      )
                    )}
                  </Box>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        ))}
        {getSelectMessage(namespacesSelected)}
      </Box>
    </Box>
  )
}

export default SystemsAdminApp
