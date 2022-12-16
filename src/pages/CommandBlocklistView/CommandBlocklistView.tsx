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
import { Table } from 'components/Table'
import { useBlockList } from 'hooks/useBlockList'
import { useCommands } from 'hooks/useCommands'
import { useModalColumns, useTableColumns } from 'pages/CommandBlocklistView'
import { useMemo, useState } from 'react'
import { BlockedCommand } from 'types/backend-types'
import { CommandIndexTableData } from 'types/custom-types'

export const CommandBlocklistView = () => {
  const [open, setOpen] = useState(false)
  const [selection, setSelection] = useState<CommandIndexTableData[]>([])
  const { blockList, error, deleteBlockList, addBlockList } = useBlockList()
  const { commands } = useCommands()

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
      } else {
        console.error('Command had no ID - cannot delete')
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
  }, [blockList, deleteBlockList])

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
          setOpen(false)
          setSelection([])
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
    </Box>
  ) : error.response ? (
    <ErrorAlert
      errorMsg={error.response.statusText}
      statusCode={error.response.status}
    />
  ) : (
    <Backdrop open={true}>
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}
