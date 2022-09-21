import { Box } from '@mui/material'
import { Divider } from 'components/Divider'
import { PageHeader } from 'components/PageHeader'
import { Table } from 'components/Table'
import {
  useSystemIndexTableColumns,
  useSystemIndexTableData,
} from 'pages/SystemIndex'

const SystemsIndex = () => {
  return (
    <Box>
      <PageHeader title="Systems" description="" />
      <Divider />
      <Table
        tableKey="Systems"
        data={useSystemIndexTableData()}
        columns={useSystemIndexTableColumns()}
      />
    </Box>
  )
}

export { SystemsIndex }
