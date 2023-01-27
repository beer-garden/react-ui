import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material'
import { Divider } from 'components/Divider'
import { ErrorAlert } from 'components/ErrorAlert'
import { ModalWrapper } from 'components/ModalWrapper'
import { PageHeader } from 'components/PageHeader'
import { Snackbar } from 'components/Snackbar'
import { Table } from 'components/Table'
import { useBlockList } from 'hooks/useBlockList'
import { useMountedState } from 'hooks/useMountedState'
import { useSystems } from 'hooks/useSystems'
import { useModalColumns, useTableColumns } from 'pages/CommandBlocklistView'
import { useEffect, useMemo } from 'react'
import { BlockedCommand } from 'types/backend-types'
import { CommandIndexTableData, SnackbarState } from 'types/custom-types'
import { commandsFromSystems } from 'utils/commandFormatters'

export const CommandBlocklistView = () => {
  const [open, setOpen] = useMountedState<boolean>(false)
  const [alert, setAlert] = useMountedState<SnackbarState | undefined>()
  const [blockList, setBlocklist] = useMountedState<BlockedCommand[]>([])
  const [commands, setCommands] = useMountedState<CommandIndexTableData[]>([])
  const [selection, setSelection] = useMountedState<CommandIndexTableData[]>([])
  const { getBlockList, error, deleteBlockList, addBlockList } = useBlockList()
  const { getSystems } = useSystems()

  useEffect(() => {
    getBlockList()
      .then((response) => {
        setBlocklist(response.data.command_publishing_blocklist)
      })
      .catch((e) => {
        setAlert({
          severity: 'error',
          message: e.response?.data.message || 'Problem fetching blocklist',
          doNotAutoDismiss: true,
        })
      })
    getSystems()
      .then((response) => {
        setCommands(commandsFromSystems(response.data, false))
      })
      .catch((e) => {
        setAlert({
          severity: 'error',
          message: e.response?.data.message || 'Problem fetching command list',
          doNotAutoDismiss: true,
        })
      })
  }, [getBlockList, getSystems, setAlert, setBlocklist, setCommands])

  // populate data for modal All Commands list table
  const commandListData = useMemo((): CommandIndexTableData[] => {
    // Filter out blocked commands first
    return commands
      .filter((commandItem: CommandIndexTableData) => {
        return !blockList.some(
          (blockItem: BlockedCommand) =>
            commandItem.namespace === blockItem.namespace &&
            commandItem.system === blockItem.system &&
            commandItem.command === blockItem.command,
        )
      })
      .map((command: CommandIndexTableData): CommandIndexTableData => {
        return {
          namespace: command.namespace,
          system: command.system,
          command: command.command,
          isHidden: command.hidden,
        }
      })
  }, [blockList, commands])

  // populate data for main Blocked Commands list table
  const blocklistData = useMemo(() => {
    const delCommand = (id: string | undefined) => {
      if (id) {
        deleteBlockList(id)
          .then((resolved) => {
            if (resolved) getBlockList()
          })
          .catch((e) =>
            setAlert({
              severity: 'error',
              message:
                e.response?.data.message ||
                'Problem removing command from blocklist',
              doNotAutoDismiss: true,
            }),
          )
      } else {
        setAlert({
          severity: 'error',
          message: 'Missing command ID - cannot delete',
          doNotAutoDismiss: true,
        })
      } // TODO: search for command + system + namespace combo?
    }

    return blockList.map((command: BlockedCommand): CommandIndexTableData => {
      return {
        namespace: command.namespace,
        system: command.system,
        status: command.status,
        command: command.command,
        executeButton: (
          <IconButton
            size="small"
            color="error"
            onClick={() => delCommand(command.id)}
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton>
        ),
      }
    })
  }, [blockList, deleteBlockList, getBlockList, setAlert])

  const tableColumns = useTableColumns()
  const modalColumns = useModalColumns()

  return !error ? (
    <Box>
      <Tooltip title="Add command">
        <Button
          style={{ float: 'right' }}
          variant="contained"
          color="primary"
          aria-label="Add command"
          onClick={() => setOpen(true)}
        >
          <AddIcon />
        </Button>
      </Tooltip>
      <ModalWrapper
        open={open}
        header="Add Commands to Blocklist"
        onClose={() => {
          setOpen(false)
          setSelection([])
        }}
        onCancel={() => {
          setOpen(false)
          setSelection([])
        }}
        onSubmit={() => {
          addBlockList(selection)
            .then((resolved) => {
              setOpen(false)
              setSelection([])
              if (resolved) getBlockList()
            })
            .catch((e) =>
              setAlert({
                severity: 'error',
                message:
                  e.response?.data.message ||
                  'Problem adding command to blocklist',
                doNotAutoDismiss: true,
              }),
            )
        }}
        content={
          <Table
            tableKey="BlocklistAdd"
            data={commandListData}
            columns={modalColumns}
            maxrows={10}
            setSelection={setSelection}
          />
        }
      />
      <PageHeader title="Command Publishing Blocklist" description="" />
      <Divider />
      <Table tableKey="Blocklist" data={blocklistData} columns={tableColumns} />
      {alert ? <Snackbar status={alert} /> : null}
    </Box>
  ) : error.response ? (
    <ErrorAlert
      errorMsg={error.response.statusText}
      statusCode={error.response.status}
    />
  ) : (
    <Backdrop open={true}>
      <CircularProgress color="inherit" aria-label="Blocklist data loading" />
    </Backdrop>
  )
}
