import { Table } from 'components/Table'
import {
  JobCreateCommandsTableData,
  useCommandsColumns,
  useCommandsData,
} from 'pages/JobCreate/JobCreateCommandsData'
import { PropsWithChildren } from 'react'
import { Column } from 'react-table'
import { Command, System } from 'types/backend-types'

interface JobCreateCommandsTableProps {
  system: System
  commandSetter: (commands: Command) => void
}

const replaceWidth = (
  tag: string,
  value: number,
  column: Column<JobCreateCommandsTableData>,
) =>
  column.accessor && column.accessor === tag
    ? { ...column, width: value }
    : column

const JobCreateCommandsTable = ({
  system,
  commandSetter,
  children,
}: PropsWithChildren<JobCreateCommandsTableProps>) => {
  const data = useCommandsData(system, commandSetter)
  const columns = useCommandsColumns()

  /* find the proper width for the displayed columns */
  const nameHeader =
    (columns.filter((item) => item.accessor && item.accessor === 'name').pop()
      ?.Header as string) ?? ''
  const descriptionHeader =
    (columns
      .filter((item) => item.accessor && item.accessor === 'description')
      .pop()?.Header as string) ?? ''
  const nameHeaderLength = nameHeader.length + 8 /* pad for the arrow */
  const descriptionHeaderLength = descriptionHeader.length + 8
  const nameLength = Math.max(
    nameHeaderLength,
    ...data.map((item) => item.name.length),
  )
  const descriptionLength = Math.max(
    descriptionHeaderLength,
    Math.min(350, ...data.map((item) => item.description.length)),
  )

  /* add the widths to the columns */
  const fixedColumns = columns
    .map((column) => replaceWidth('name', nameLength * 8, column))
    .map((column) =>
      replaceWidth('description', 50 + descriptionLength * 8, column),
    )

  return (
    <Table
      tableKey="JobCommands"
      data={data}
      columns={fixedColumns}
      showGlobalFilter
    >
      {children}
    </Table>
  )
}

export { JobCreateCommandsTable }
