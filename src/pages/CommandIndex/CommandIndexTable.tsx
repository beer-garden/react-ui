import { Box, Checkbox, FormControlLabel } from '@mui/material'
import Breadcrumbs from 'components/Breadcrumbs'
import { Table } from 'components/Table'
import { useCommands } from 'hooks/useCommands'
import { useMemo } from 'react'
import { Column } from 'react-table'
import { CommandRow } from 'types/custom_types'

const useCommandIndexTableColums = () => {
  return useMemo<Column<CommandRow>[]>(
    () => [
      {
        Header: 'Namespace',
        accessor: 'namespace',
        width: 150,
      },
      {
        Header: 'System',
        accessor: 'system',
        filter: 'fuzzyText',
        width: 150,
      },
      {
        Header: 'Version',
        accessor: 'version',
        width: 120,
      },
      {
        Header: 'Command',
        accessor: 'name',
        width: 300,
      },
      {
        Header: 'Description',
        accessor: 'description',
        width: 300,
      },
      {
        Header: '',
        accessor: 'action',
        disableSortBy: true,
        disableGroupBy: true,
        disableFilters: true,
        canHide: false,
        width: 120,
      },
    ],
    [],
  )
}

const CommandIndexTable = () => {
  const {
    commands,
    namespace,
    systemName,
    version,
    includeHidden,
    hiddenOnChange,
  } = useCommands()
  const columns = useCommandIndexTableColums()
  const breadcrumbs = [namespace, systemName, version]
    .filter((x) => !!x)
    .map((x) => String(x))

  return (
    <Table tableName="Commands" data={commands} columns={columns}>
      <Box mb={2}>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <FormControlLabel
          label="Include hidden"
          control={
            <Checkbox checked={includeHidden} onChange={hiddenOnChange} />
          }
        />
      </Box>
    </Table>
  )
}
export { CommandIndexTable }
