import AddIcon from '@mui/icons-material/Add'
import { Box, Button, Tooltip } from '@mui/material'
import Divider from 'components/divider'
import PageHeader from 'components/PageHeader'
import { Table } from 'components/Table'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useBlockList } from 'hooks/useBlockList'
import { useMemo } from 'react'
import { Column } from 'react-table'
import { BlockedCommand } from 'types/command_types'

type BlocklistTableData = {
  namespace: string
  system: string
  status: string
  command: string
  delete: JSX.Element
}

export const CommandBlocklistView = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const listClient = useBlockList()

  const systemMapper = (system: BlockedCommand): BlocklistTableData => {
    return {
      namespace: system.namespace,
      system: system.system,
      status: system.status,
      command: system.command,
      delete: (
        <Button
          size="small"
          variant="contained"
          color="error"
          onClick={() => delCommand(system.id)}
        >
          Delete
        </Button>
      ),
    }
  }
  const useSystemIndexTableData = () => {
    const blocked = listClient.getBlockList()
    if (!blocked) {
      return []
    }
    return blocked.map((element: BlockedCommand) => {
      return systemMapper(element)
    })
  }
  const delCommand = (id: string) => {
    listClient.deleteBlockList(id)
  }
  const TableColumns = () => {
    return useMemo<Column<BlocklistTableData>[]>(
      () => [
        {
          Header: 'Namespace',
          accessor: 'namespace',
          filter: 'fuzzyText',
          width: 150,
        },
        {
          Header: 'System',
          accessor: 'system',
          filter: 'fuzzyText',
          width: 150,
        },
        {
          Header: 'Command',
          accessor: 'command',
          width: 150,
        },
        {
          Header: 'Status',
          accessor: 'status',
          filter: 'fuzzyText',
          width: 150,
        },
        {
          Header: 'Delete',
          accessor: 'delete',
          width: 150,
        },
      ],
      [],
    )
  }

  return (
    <Box>
      <Tooltip title="Add command">
        <Button
          style={{ float: 'right' }}
          variant="contained"
          color="primary"
          aria-label="Add command"
          onClick={() =>
            listClient.addBlockList([
              {
                namespace: 'default',
                system: 'complex',
                command: 'echo_dates',
              },
              {
                namespace: 'default',
                system: 'complex',
                command: 'echo_integer',
              },
            ])
          }
        >
          <AddIcon />
        </Button>
      </Tooltip>
      <PageHeader title="Command Publishing Blocklist" description="" />
      <Divider />
      <Table
        tableName="Systems"
        data={useSystemIndexTableData()}
        columns={TableColumns()}
      />
    </Box>
  )
}
