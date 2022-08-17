import { Alert, Box, Button, Divider, Grid, Tooltip } from '@mui/material'
import PageHeader from 'components/PageHeader'
import useAdmin from 'hooks/useAdmin'
import { useLocalStorage } from 'hooks/useLocalStorage'
import useNamespace from 'hooks/useNamespace'
import { NamespaceCard } from 'pages/SystemAdmin/NamespaceCard'
import { NamespaceSelect } from 'pages/SystemAdmin/NamespaceSelect'
import { createContext } from 'react'

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

  const contextValue = {
    namespaces: useNamespace(),
    namespacesSelected: namespacesSelected,
    setNamespacesSelected: setNamespacesSelected,
  }

  const adminClient = useAdmin()

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
            <Button variant="contained" color="secondary" sx={{ m: 1 }}>
              Clear
            </Button>
          </Tooltip>
          <Tooltip arrow title="Rescan Plugin Directory">
            <Button
              onClick={() => adminClient.rescanPluginDirectory()}
              variant="contained"
              color="primary"
              sx={{ m: 1 }}
            >
              Rescan
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      {namespacesSelected.map((namespace: string) => (
        <NamespaceCard namespace={namespace} key={namespace + 'card'} />
      ))}
      {getSelectMessage(namespacesSelected)}
    </Box>
  )
}

export { SystemAdmin }
