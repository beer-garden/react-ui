import { Typography } from '@mui/material'
import { Alert, Box, Button, Divider, Grid, Tooltip } from '@mui/material'
import { ModalWrapper } from 'components/ModalWrapper'
import PageHeader from 'components/PageHeader'
import useAdmin from 'hooks/useAdmin'
import { useLocalStorage } from 'hooks/useLocalStorage'
import useNamespace from 'hooks/useNamespace'
import useQueue from 'hooks/useQueue'
import { NamespaceCard } from 'pages/SystemAdmin/NamespaceCard'
import { NamespaceSelect } from 'pages/SystemAdmin/NamespaceSelect'
import { createContext, useState } from 'react'

const getSelectMessage = (namespacesSelected: string[]): JSX.Element | void => {
  if (!namespacesSelected.length) {
    return <Alert severity="info">Please select a namespace</Alert>
  }
}

interface NamespacesSelectedContextType {
  namespaces: string[]
  namespacesSelected: string[]
  setNamespacesSelected: (value: string[]) => void
}

export const NamespacesSelectedContext =
  createContext<NamespacesSelectedContextType>({
    namespaces: [],
    namespacesSelected: [],
    setNamespacesSelected: () => {
      return
    },
  })

const SystemAdmin = () => {
  const [namespacesSelected, setNamespacesSelected] = useLocalStorage<string[]>(
    'namespacesSelected',
    [],
  )
  const [open, setOpen] = useState(false)

  const contextValue = {
    namespaces: useNamespace(),
    namespacesSelected: namespacesSelected,
    setNamespacesSelected: setNamespacesSelected,
  }

  const adminClient = useAdmin()
  const queueClient = useQueue()

  return (
    <Box>
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
          <NamespacesSelectedContext.Provider value={contextValue}>
            <NamespaceSelect />
          </NamespacesSelectedContext.Provider>
        </Grid>
        <Grid
          key="actions"
          item
          display="flex"
          alignItems="center"
          flexDirection="row"
        >
          <Tooltip arrow title="Clear All Queues">
            <Button
              variant="contained"
              color="secondary"
              sx={{ m: 1 }}
              onClick={() => setOpen(true)}
            >
              Clear
            </Button>
          </Tooltip>
          <Tooltip arrow title="Rescan Plugin Directory">
            <Button
              onClick={adminClient.rescanPluginDirectory}
              variant="contained"
              color="primary"
              sx={{ m: 1 }}
            >
              Rescan
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
      <ModalWrapper
        open={open}
        header="Clear All Local Queues?"
        onClose={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        onSubmit={() => {
          queueClient.clearQueues()
          setOpen(false)
        }}
        content={
          <Typography my={2}>
            All outstanding request messages will be deleted for all systems of
            the local garden. Remote gardens will not be affected. This action
            cannot be undone.
          </Typography>
        }
        styleOverrides={{ width: '35%' }}
      />
      <Divider sx={{ my: 2 }} />
      {namespacesSelected.map((namespace: string) => (
        <NamespaceCard namespace={namespace} key={namespace + 'card'} />
      ))}
      {getSelectMessage(namespacesSelected)}
    </Box>
  )
}

export { SystemAdmin }
