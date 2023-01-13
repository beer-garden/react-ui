import { Backdrop, CircularProgress } from '@mui/material'
import { AxiosError } from 'axios'
import { Divider } from 'components/Divider'
import { ErrorAlert } from 'components/ErrorAlert'
import { PageHeader } from 'components/PageHeader'
import { Table } from 'components/Table'
import { useSystems } from 'hooks/useSystems'
import {
  useSystemIndexTableColumns,
  useSystemIndexTableData,
} from 'pages/SystemIndex'
import { useEffect, useState } from 'react'
import { System } from 'types/backend-types'

const SystemsIndex = () => {
  const [systems, setSystems] = useState<System[]>([])
  const [error, setError] = useState<AxiosError>()
  const { getSystems } = useSystems()

  useEffect(() => {
    let isMounted = true
    getSystems()
      .then((response) => {
        if (isMounted) setSystems(response.data)
      })
      .catch((e) => {
        if (isMounted) setError(e)
      })
    return () => {
      isMounted = false
    }
  }, [getSystems])

  const systemIndexTableData = useSystemIndexTableData(systems)
  const systemIndexTableColumns = useSystemIndexTableColumns()

  return !error ? (
    <>
      <PageHeader title="Systems" description="" />
      <Divider />
      <Table
        tableKey="Systems"
        data={systemIndexTableData}
        columns={systemIndexTableColumns}
      />
    </>
  ) : error?.response ? (
    <ErrorAlert
      statusCode={error.response.status}
      errorMsg={error.response.statusText}
    />
  ) : (
    <Backdrop open={true}>
      <CircularProgress color="inherit" aria-label="System data loading" />
    </Backdrop>
  )
}

export { SystemsIndex }
