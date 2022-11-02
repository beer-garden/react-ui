import { useSystems } from 'hooks/useSystems'
import { ExploreButton } from 'pages/SystemIndex'
import { useMemo } from 'react'
import { Column } from 'react-table'
import { System } from 'types/backend-types'

type SystemIndexTableData = {
  name: string
  description: string
  version: string
  namespace: string
  commandCount: number
  instanceCount: number
  exploreButton: JSX.Element
}

const systemMapper = (system: System): SystemIndexTableData => {
  return {
    namespace: system.namespace,
    name: system.name,
    version: system.version,
    description: system.description,
    commandCount: system.commands.length,
    instanceCount: system.instances.length,
    exploreButton: ExploreButton(system),
  }
}

const useSystemIndexTableData = (): SystemIndexTableData[] => {
  const systemClient = useSystems()
  const systemList = systemClient.getSystems()
  return systemList.map(systemMapper)
}

const useSystemIndexTableColumns = () => {
  return useMemo<Column<SystemIndexTableData>[]>(
    () => [
      {
        Header: 'Namespace',
        accessor: 'namespace',
        minWidth: 120,
        maxWidth: 180,
        width: 130,
      },
      {
        Header: 'System',
        accessor: 'name',
        filter: 'fuzzyText',
        minWidth: 95,
        maxWidth: 120,
        width: 90,
      },
      {
        Header: 'Version',
        accessor: 'version',
        minWidth: 95,
        maxWidth: 120,
        width: 100,
      },
      {
        Header: 'Description',
        accessor: 'description',
        filter: 'fuzzyText',
        minWidth: 250,
        maxWidth: 500,
        width: 300,
        disableSortBy: true,
      },
      {
        Header: 'Commands',
        accessor: 'commandCount',
        width: 100,
        minWidth: 95,
        maxWidth: 110,
        disableSortBy: true,
        disableFilters: true,
      },
      {
        Header: 'Instances',
        accessor: 'instanceCount',
        width: 90,
        minWidth: 80,
        maxWidth: 95,
        disableSortBy: true,
        disableGroupBy: true,
        disableFilters: true,
      },
      {
        Header: '',
        accessor: 'exploreButton',
        disableSortBy: true,
        disableGroupBy: true,
        disableFilters: true,
        canHide: false,
        width: 95,
        minWidth: 75,
        maxWidth: 110,
      },
    ],
    [],
  )
}

export { systemMapper, useSystemIndexTableColumns, useSystemIndexTableData }
