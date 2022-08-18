import { Table } from 'components/Table'
import { PropsWithChildren } from 'react'
import { System } from 'types/backend-types'

import { useSystemColumns, useSystemsData } from './data'

interface JobCreateSystemTableProps {
  systemSetter: (system: System) => void
}
const JobCreateSystemsTable = ({
  systemSetter,
  children,
}: PropsWithChildren<JobCreateSystemTableProps>) => {
  return (
    <Table
      tableName="Choose System For Job"
      data={useSystemsData(systemSetter)}
      columns={useSystemColumns()}
      showGlobalFilter
    >
      {children}
    </Table>
  )
}

export { JobCreateSystemsTable }
