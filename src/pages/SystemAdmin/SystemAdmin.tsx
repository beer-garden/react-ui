import { Backdrop, CircularProgress, Stack, Typography } from '@mui/material'
import { Alert, Box, Button, Grid, Tooltip } from '@mui/material'
import { AxiosError } from 'axios'
import { Divider } from 'components/Divider'
import { ErrorAlert } from 'components/ErrorAlert'
import { ModalWrapper } from 'components/ModalWrapper'
import { PageHeader } from 'components/PageHeader'
import useAdmin from 'hooks/useAdmin'
import { useLocalStorage } from 'hooks/useLocalStorage'
import { useMountedState } from 'hooks/useMountedState'
import { useNamespace } from 'hooks/useNamespace'
import useQueue from 'hooks/useQueue'
import { NamespaceCard } from 'pages/SystemAdmin/NamespaceCard'
import { NamespaceSelect } from 'pages/SystemAdmin/NamespaceSelect'
import { UnassociatedRunnersCard } from 'pages/SystemAdmin/UnassociatedRunners'
import { createContext, useEffect } from 'react'

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
  const [open, setOpen] = useMountedState<boolean>(false)
  const [namespaces, setNamespaces] = useMountedState<string[]>([])
  const [error, setError] = useMountedState<AxiosError | undefined>()
  const { getNamespaces } = useNamespace()
  const { rescanPluginDirectory } = useAdmin()
  const { clearQueues } = useQueue()

  useEffect(() => {
    getNamespaces()
      .then((response) => {
        setNamespaces(response.data)
      })
      .catch((error) => {
        setError(error)
      })
  }, [getNamespaces, setError, setNamespaces])

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
          <Stack direction="row" spacing={2}>
            <Tooltip arrow title="Clear All Queues">
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setOpen(true)}
              >
                Clear All Queues
              </Button>
            </Tooltip>
            <Tooltip arrow title="Rescan Plugin Directory">
              <Button
                onClick={rescanPluginDirectory}
                variant="contained"
                color="primary"
              >
                Rescan Plugin Directory
              </Button>
            </Tooltip>
          </Stack>
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
      <UnassociatedRunnersCard />
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
      <CircularProgress color="inherit" aria-label="System data loading" />
    </Backdrop>
  )
}

export { SystemAdmin }
