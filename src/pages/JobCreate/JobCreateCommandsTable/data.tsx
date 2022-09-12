import { Button } from '@mui/material'
import { useMemo } from 'react'
import { Column } from 'react-table'
import { Command, System } from 'types/backend-types'

export type JobCreateCommandsTableData = {
  name: string
  description: string
  choose: JSX.Element
}

const ChooseButton = (
  command: Command,
  commandSetter: (command: Command) => void,
) => {
  return (
    <Button
      size="small"
      variant="contained"
      color="primary"
      onClick={() => commandSetter(command)}
    >
      Select
    </Button>
  )
}

const useCommandsData = (
  system: System,
  commandSetter: (command: Command) => void,
) => {
  return system.commands.map((command: Command) => {
    const { name, description } = command
    return {
      name,
      description: description || 'No description provided',
      choose: ChooseButton(command, commandSetter),
    }
  })
}

const useCommandsColumns = () => {
  return useMemo<Column<JobCreateCommandsTableData>[]>(
    () => [
      {
        Header: 'Command name',
        accessor: 'name',
        disableFilters: true,
        canHide: false,
      },
      {
        Header: 'Description',
        accessor: 'description',
        width: 300,
        disableFilters: true,
        canHide: false,
      },
      {
        Header: '',
        accessor: 'choose',
        disableFilters: true,
        canHide: false,
      },
    ],
    [],
  )
}

export { useCommandsColumns, useCommandsData }
