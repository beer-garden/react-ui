import { AxiosError } from 'axios'
import { Table } from 'components/Table'
import { useSystems } from 'hooks/useSystems'
import {
  useSystemColumns,
  useSystemsData,
} from 'pages/JobCreate/JobCreateSystemsData'
import { PropsWithChildren, useEffect, useState } from 'react'
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
  const [systems, setSystems] = useState<System[]>([])
  const { getSystems } = useSystems()

  useEffect(() => {
    getSystems()
      .then((response) => {
        setSystems(response.data)
      })
      .catch((e) => {
        errorSetter(e)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
