import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { Box, Button, Checkbox, IconButton, Tooltip } from '@mui/material'
import Divider from 'components/divider'
import { ModalWrapper } from 'components/ModalWrapper'
import PageHeader from 'components/PageHeader'
import { Table } from 'components/Table'
import { useBlockList } from 'hooks/useBlockList'
import { generateCommandName, useCommands } from 'hooks/useCommands'
import { useModalColumns, useTableColumns } from 'pages/CommandBlocklistView'
import { useMemo, useState } from 'react'
import { CommandBase, CommandRow } from 'types/custom_types'

export const CommandBlocklistView = () => {
  const [open, setOpen] = useState(false)
  const [selectedCommands, setSelected] = useState<CommandRow[]>([])
  const { getBlockList, deleteBlockList, addBlockList } = useBlockList()
  const { commands } = useCommands()
  const blocked = getBlockList()

  const commandListData = useMemo(() => {
    const handleClick = (command: CommandRow) => {
      const selectedIndex = selectedCommands.indexOf(command)
      let newSelected: CommandRow[] = []

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selectedCommands, command)
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selectedCommands.slice(1))
      } else if (selectedIndex === selectedCommands.length - 1) {
        newSelected = newSelected.concat(selectedCommands.slice(0, -1))
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selectedCommands.slice(0, selectedIndex),
          selectedCommands.slice(selectedIndex + 1),
        )
      }

      setSelected(newSelected)
    }
    return commands.map((command: CommandRow): CommandRow => {
      return {
        namespace: command.namespace,
        system: command.system,
        command: command.command,
        name: command.name,
        action: (
          <Checkbox
            checked={selectedCommands.indexOf(command) > -1}
            onClick={() => handleClick(command)}
          />
        ),
      }
    })
  }, [commands, selectedCommands])

  const blocklistData = useMemo(() => {
    const delCommand = (id: string | undefined) => {
      if (id) {
        deleteBlockList(id)
      } else {
        console.error('Command had no ID - cannot delete')
      } // TODO: search for command + system + namespace combo?
    }

    return (
      blocked?.map((command: CommandBase): CommandRow => {
        return {
          namespace: command.namespace,
          system: command.system,
          status: command.status,
          command: command.command,
          name: generateCommandName(false, command.command),
          action: (
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
      }) ?? []
    )
  }, [blocked, deleteBlockList])

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
          setSelected([])
        }}
        onCancel={() => {
          setOpen(false)
          setSelected([])
        }}
        onSubmit={() => {
          addBlockList(selectedCommands)
          setOpen(false)
          setSelected([])
        }}
        content={
          <Table
            tableName=""
            data={commandListData}
            columns={useModalColumns()}
          />
        }
      />
      <PageHeader title="Command Publishing Blocklist" description="" />
      <Divider />
      <Table tableName="" data={blocklistData} columns={useTableColumns()} />
    </Box>
  )
}
