import { Backdrop, CircularProgress, Typography } from '@mui/material'
import { Alert, Box, Button, Grid, Tooltip } from '@mui/material'
import { AxiosError } from 'axios'
import { Divider } from 'components/Divider'
import { ErrorAlert } from 'components/ErrorAlert'
import { ModalWrapper } from 'components/ModalWrapper'
import { PageHeader } from 'components/PageHeader'
import useAdmin from 'hooks/useAdmin'
import { useLocalStorage } from 'hooks/useLocalStorage'
import { useNamespace } from 'hooks/useNamespace'
import useQueue from 'hooks/useQueue'
import { NamespaceCard } from 'pages/SystemAdmin/NamespaceCard'
import { NamespaceSelect } from 'pages/SystemAdmin/NamespaceSelect'
import { createContext, useEffect, useState } from 'react'

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
  const [namespaces, setNamespaces] = useState<string[]>([])
  const [error, setError] = useState<AxiosError>()
  const { getNamespaces } = useNamespace()
  const { rescanPluginDirectory } = useAdmin()
  const { clearQueues } = useQueue()

  useEffect(() => {
    let mounted = true
    getNamespaces()
      .then((response) => {
        if (mounted) setNamespaces(response.data)
      })
      .catch((error) => {
        if (mounted) setError(error)
      })
    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return !error ? (
    <Box>
      <Grid alignItems="start" justifyContent="space-between" container>
        <Grid key="header" item>
          <PageHeader title="Systems Management" description="" />
        </Grid>
        <Grid key="filter" item>
          <NamespacesSelectedContext.Provider
            value={{
              namespaces: namespaces,
              namespacesSelected: namespacesSelected,
              setNamespacesSelected: setNamespacesSelected,
            }}
          >
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
  ) : error?.response ? (
    <ErrorAlert
      statusCode={error.response.status}
      errorMsg={error.response.statusText}
    />
  ) : (
    <Backdrop open={true}>
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}

export { SystemAdmin }
