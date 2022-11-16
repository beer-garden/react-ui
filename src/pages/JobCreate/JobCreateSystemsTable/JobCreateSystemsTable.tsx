import { Snackbar } from 'components/Snackbar'
import { Table } from 'components/Table'
import { useSystems } from 'hooks/useSystems'
import { PropsWithChildren, useEffect, useState } from 'react'
import { System } from 'types/backend-types'
import { SnackbarState } from 'types/custom-types'

import { useSystemColumns, useSystemsData } from './data'

interface JobCreateSystemTableProps {
  systemSetter: (system: System) => void
}
const JobCreateSystemsTable = ({
  systemSetter,
  children,
}: PropsWithChildren<JobCreateSystemTableProps>) => {
  const [systems, setSystems] = useState<System[]>([])
  const [alert, setAlert] = useState<SnackbarState | undefined>(undefined)
  const { getSystems } = useSystems()

  useEffect(() => {
    getSystems()
      .then((response) => {
        setSystems(response.data)
      })
      .catch((e) => {
        setAlert({
          severity: 'error',
          message: e,
          doNotAutoDismiss: true,
        })
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Table
        tableKey="JobSystems"
        data={useSystemsData(systems, systemSetter)}
        columns={useSystemColumns()}
        showGlobalFilter
      >
        {children}
      </Table>
      {alert && <Snackbar status={alert} />}
    </>
  )
}

export { JobCreateSystemsTable }
