import { Box, Checkbox, FormControlLabel } from '@mui/material'
import Breadcrumbs from 'components/Breadcrumbs'
import { Table } from 'components/Table'
import {
  useCommandIndexTableColumns,
  useCommands,
} from 'pages/CommandIndex/CommandIndexTable'

const CommandIndexTable = () => {
  const {
    commands,
    namespace,
    systemName,
    version,
    includeHidden,
    hiddenOnChange,
  } = useCommands()
  const columns = useCommandIndexTableColumns()
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
            <Checkbox
              checked={includeHidden}
              onChange={hiddenOnChange}
              color="secondary"
            />
          }
        />
      </Box>
    </Table>
  )
}
export { CommandIndexTable }
