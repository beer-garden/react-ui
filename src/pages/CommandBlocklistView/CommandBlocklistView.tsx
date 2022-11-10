import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { Box, Button, IconButton, Tooltip } from '@mui/material'
import { Divider } from 'components/Divider'
import { ModalWrapper } from 'components/ModalWrapper'
import { PageHeader } from 'components/PageHeader'
import { Table } from 'components/Table'
import { useBlockList } from 'hooks/useBlockList'
import { useCommands } from 'hooks/useCommands'
import { differenceWith } from 'lodash'
import { useModalColumns, useTableColumns } from 'pages/CommandBlocklistView'
import { useMemo, useState } from 'react'
import { BlockedCommand } from 'types/backend-types'
import { CommandIndexTableData } from 'types/custom-types'
import { generateCommandName } from 'utils/generateCommandName'

export const CommandBlocklistView = () => {
  const [open, setOpen] = useState(false)
  const [selection, setSelection] = useState<CommandIndexTableData[]>([])
  const { blockList, deleteBlockList, addBlockList } = useBlockList()
  const { commands } = useCommands()

  // populate data for modal All Commands list table
  const commandListData = useMemo((): CommandIndexTableData[] => {
    // Filter out blocked commands first
    return differenceWith(commands, blockList, (commandItem, blockItem) => {
      return (
        commandItem.namespace === blockItem.namespace &&
        commandItem.system === blockItem.system &&
        commandItem.command === blockItem.command
      )
    }).map((command: CommandIndexTableData): CommandIndexTableData => {
      return {
        namespace: command.namespace,
        system: command.system,
        command: command.command,
        name: command.name,
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
        name: generateCommandName(false, command.command),
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
          setOpen(false)
          setSelection([])
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
    </Box>
  )
}
