import { Alert, Button, Grid, Tooltip } from '@mui/material'
import Divider from 'components/divider'
import NamespaceSelect from 'components/namespace_select'
import PageHeader from 'components/PageHeader'
import useNamespace from 'hooks/useNamespace'
import { NamespcCard } from 'pages/SystemAdmin/NamespcCard'
import { useState } from 'react'
import AdminService from 'services/admin_service'
import CacheService from 'services/cache_service'

const getSelectMessage = (namespacesSelected: string[]): JSX.Element | void => {
  if (!namespacesSelected.length) {
    return <Alert severity="info">Please select a namespace</Alert>
  }
}

const SystemAdmin = () => {
  const namespaces = useNamespace()
  const [namespacesSelected, setNamespacesSelected] = useState(
    CacheService.getNamespacesSelected(
      `lastKnown_${window.location.href}`,
      namespaces,
    ).namespacesSelected,
  )

  return (
    <>
      <Grid alignItems="flex-end" justifyContent="space-between" container>
        <Grid key="header" item>
          <PageHeader title="Systems Management" description="" />
        </Grid>
        <Grid
          key="filter"
          item
          display="flex"
          alignItems="center"
          flexDirection="row"
        >
          <NamespaceSelect
            namespaces={namespaces}
            namespacesSelected={namespacesSelected}
            setNamespacesSelected={setNamespacesSelected}
          />
        </Grid>
        <Grid
          key="actions"
          item
          display="flex"
          alignItems="center"
          flexDirection="row"
        >
          <Tooltip arrow title="Clear All Queues">
            <Button variant="contained" color="secondary" sx={{ m: 1 }}>
              Clear
            </Button>
          </Tooltip>
          <Tooltip arrow title="Rescan Plugin Directory">
            <Button
              onClick={() => AdminService.rescan()}
              variant="contained"
              color="primary"
              sx={{ m: 1 }}
            >
              Rescan
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
      <Divider />
      {namespacesSelected.map((namespace: string) => (
        <NamespcCard namespace={namespace} key={namespace + 'card'} />
      ))}
      {getSelectMessage(namespacesSelected)}
    </>
  )
}

export { SystemAdmin }
