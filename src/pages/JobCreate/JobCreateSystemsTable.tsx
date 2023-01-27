import { AxiosError } from 'axios'
import { Table } from 'components/Table'
import { useMountedState } from 'hooks/useMountedState'
import { useSystems } from 'hooks/useSystems'
import {
  useSystemColumns,
  useSystemsData,
} from 'pages/JobCreate/JobCreateSystemsData'
import { PropsWithChildren, useEffect } from 'react'
import { System } from 'types/backend-types'

interface JobCreateSystemTableProps {
  systemSetter: (system: System) => void
  errorSetter: (error: AxiosError) => void
}
const JobCreateSystemsTable = ({
  systemSetter,
  errorSetter,
  children,
}: PropsWithChildren<JobCreateSystemTableProps>) => {
  const [systems, setSystems] = useMountedState<System[]>([])
  const { getSystems } = useSystems()

  useEffect(() => {
    getSystems()
      .then((response) => {
        setSystems(response.data)
      })
      .catch((e) => {
        errorSetter(e)
      })
  }, [errorSetter, getSystems, setSystems])

  return (
    <Table
      tableKey="JobSystems"
      data={useSystemsData(systems, systemSetter)}
      columns={useSystemColumns()}
      showGlobalFilter
    >
      {children}
    </Table>
  )
}

export { JobCreateSystemsTable }
