import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { Box, Button, IconButton, Tooltip } from '@mui/material'
import { Divider } from 'components/Divider'
import { ModalWrapper } from 'components/ModalWrapper'
import { PageHeader } from 'components/PageHeader'
import { Snackbar } from 'components/Snackbar'
import { Table } from 'components/Table'
import { useBlockList } from 'hooks/useBlockList'
import { useCommands } from 'hooks/useCommands'
import { useModalColumns, useTableColumns } from 'pages/CommandBlocklistView'
import { useEffect, useMemo, useState } from 'react'
import { BlockedCommand } from 'types/backend-types'
import { CommandIndexTableData, SnackbarState } from 'types/custom-types'

export const CommandBlocklistView = () => {
  const [open, setOpen] = useState(false)
  const [alert, setAlert] = useState<SnackbarState>()
  const [blockList, setBlocklist] = useState<BlockedCommand[]>([])
  const [selection, setSelection] = useState<CommandIndexTableData[]>([])
  const { getBlockList, deleteBlockList, addBlockList } = useBlockList()
  const { commands } = useCommands()

  useEffect(() => {
    // fix for cannot execute on unmounted component error
    let mounted = true
    getBlockList()
      .then((response) => {
        if (mounted) setBlocklist(response.data.command_publishing_blocklist)
      })
      .catch((e) => {
        if (mounted)
          setAlert({
            severity: 'error',
            message: e.response?.data.message || 'Problem fetching blocklist',
            doNotAutoDismiss: true,
          })
      })
    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
  }, [blockList, deleteBlockList, getBlockList])

  return (
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
            columns={useModalColumns()}
            maxrows={10}
            setSelection={setSelection}
          />
        }
      />
      <PageHeader title="Command Publishing Blocklist" description="" />
      <Divider />
      <Table
        tableKey="Blocklist"
        data={blocklistData}
        columns={useTableColumns()}
      />
      {alert ? <Snackbar status={alert} /> : null}
    </Box>
  )
}
