import { Box } from '@mui/material'
import { Divider } from 'components/Divider'
import { PageHeader } from 'components/PageHeader'
import { Snackbar } from 'components/Snackbar'
import { Table } from 'components/Table'
import { useSystems } from 'hooks/useSystems'
import {
  useSystemIndexTableColumns,
  useSystemIndexTableData,
} from 'pages/SystemIndex'
import { useEffect, useState } from 'react'
import { System } from 'types/backend-types'
import { SnackbarState } from 'types/custom-types'

const SystemsIndex = () => {
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
    <Box>
      <PageHeader title="Systems" description="" />
      <Divider />
      <Table
        tableKey="Systems"
        data={useSystemIndexTableData(systems)}
        columns={useSystemIndexTableColumns()}
      />
      {alert && <Snackbar status={alert} />}
    </Box>
  )
}

export { SystemsIndex }
