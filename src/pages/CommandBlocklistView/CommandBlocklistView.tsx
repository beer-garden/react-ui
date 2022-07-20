import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { Button, Checkbox, IconButton, Tooltip } from '@mui/material'
import Divider from 'components/divider'
import { ModalWrapper } from 'components/ModalWrapper'
import PageHeader from 'components/PageHeader'
import { Table } from 'components/Table'
import { useBlockList } from 'hooks/useBlockList'
import { generateCommandName, useCommands } from 'hooks/useCommands'
import { useMemo, useState } from 'react'
import { Column } from 'react-table'
import { BlockedCommand, CommandRow } from 'types/custom_types'

const ModalColumns = () => {
  return useMemo<Column<CommandRow>[]>(
    () => [
      {
        Header: 'Add',
        accessor: 'action',
        width: 85,
      },
      {
        Header: 'Namespace',
        accessor: 'namespace',
        filter: 'fuzzyText',
      },
      {
        Header: 'System',
        accessor: 'system',
        filter: 'fuzzyText',
      },
      {
        Header: 'Command',
        accessor: 'name',
      },
    ],
    [],
  )
}

const TableColumns = () => {
  return useMemo<Column<CommandRow>[]>(
    () => [
      {
        Header: 'Namespace',
        accessor: 'namespace',
        filter: 'fuzzyText',
      },
      {
        Header: 'System',
        accessor: 'system',
        filter: 'fuzzyText',
      },
      {
        Header: 'Command',
        accessor: 'name',
      },
      {
        Header: 'Status',
        accessor: 'status',
        filter: 'fuzzyText',
      },
      {
        Header: '',
        accessor: 'action',
        width: 85,
      },
    ],
    [],
  )
}

export const CommandBlocklistView = () => {
  const [open, setOpen] = useState(false)
  const [selectedCommands, setSelected] = useState<CommandRow[]>([])
  const listClient = useBlockList()

  const CommandlistData = () => {
    const blocked = useCommands()
    if (!blocked || !blocked.commands) {
      return []
    }
    return blocked.commands.map((command: CommandRow) => {
      return commandlistMapper(command)
    })
  }
  const commandlistMapper = (command: CommandRow): CommandRow => {
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
  }

  const BlocklistData = () => {
    const blocked = listClient.getBlockList()
    if (!blocked) {
      return []
    }
    return blocked.map((command: BlockedCommand) => {
      return blocklistMapper(command)
    })
  }
  const blocklistMapper = (command: BlockedCommand): CommandRow => {
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
  }

  const delCommand = (id: string | undefined) => {
    if (id) {
      listClient.deleteBlockList(id)
    } else {
      console.error('Command had no ID - cannot delete')
    } // TODO: search for command + system + namespace combo?
  }
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

  return (
    <>
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
          listClient.addBlockList(selectedCommands)
          setOpen(false)
          setSelected([])
        }}
        content={
          <Table
            tableName=""
            data={CommandlistData()}
            columns={ModalColumns()}
          />
        }
      />
      <PageHeader title="Command Publishing Blocklist" description="" />
      <Divider />
      <Table tableName="" data={BlocklistData()} columns={TableColumns()} />
    </>
  )
}
