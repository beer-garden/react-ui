import { Typography } from '@mui/material'
import { Alert, Box, Button, Grid, Tooltip } from '@mui/material'
import { Divider } from 'components/Divider'
import { ModalWrapper } from 'components/ModalWrapper'
import { PageHeader } from 'components/PageHeader'
import useAdmin from 'hooks/useAdmin'
import { useLocalStorage } from 'hooks/useLocalStorage'
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
  namespacesSelected: string[]
  setNamespacesSelected: (value: string[]) => void
}

export const NamespacesSelectedContext =
  createContext<NamespacesSelectedContextType>({
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
    namespacesSelected: namespacesSelected,
    setNamespacesSelected: setNamespacesSelected,
  }

  const { rescanPluginDirectory } = useAdmin()
  const { clearQueues } = useQueue()

  return (
    <Box>
      <Grid alignItems="start" justifyContent="space-between" container>
        <Grid key="header" item>
          <PageHeader title="Systems Management" description="" />
        </Grid>
        <Grid key="filter" item>
          <NamespacesSelectedContext.Provider value={contextValue}>
            <NamespaceSelect />
          </NamespacesSelectedContext.Provider>
        </Grid>
        <Grid key="actions" item>
          <Tooltip arrow title="Clear All Queues">
            <Button
              variant="contained"
              color="secondary"
              sx={{ mx: 1 }}
              onClick={() => setOpen(true)}
            >
              Clear
            </Button>
          </Tooltip>
          <Tooltip arrow title="Rescan Plugin Directory">
            <Button
              onClick={rescanPluginDirectory}
              variant="contained"
              color="primary"
              sx={{ mx: 1 }}
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
          clearQueues()
          setOpen(false)
        }}
        content={
          <Typography my={2}>
            All outstanding request messages will be deleted for all systems of
            the local garden. Remote gardens will not be affected. This action
            cannot be undone.
          </Typography>
        }
        styleOverrides={{ size: 'sm', top: '-55%' }}
      />
      <Divider />
      {namespacesSelected.map((namespace: string) => (
        <NamespaceCard namespace={namespace} key={namespace + 'card'} />
      ))}
      {getSelectMessage(namespacesSelected)}
    </Box>
  )
}

export { SystemAdmin }
