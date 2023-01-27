import { Backdrop, CircularProgress } from '@mui/material'
import { AxiosError } from 'axios'
import { Divider } from 'components/Divider'
import { ErrorAlert } from 'components/ErrorAlert'
import { PageHeader } from 'components/PageHeader'
import { Table } from 'components/Table'
import { useMountedState } from 'hooks/useMountedState'
import { useSystems } from 'hooks/useSystems'
import {
  useSystemIndexTableColumns,
  useSystemIndexTableData,
} from 'pages/SystemIndex'
import { useEffect } from 'react'
import { System } from 'types/backend-types'

const SystemsIndex = () => {
  const [systems, setSystems] = useMountedState<System[]>([])
  const [error, setError] = useMountedState<AxiosError | undefined>()
  const { getSystems } = useSystems()

  useEffect(() => {
    getSystems()
      .then((response) => {
        setSystems(response.data)
      })
      .catch((e) => {
        setError(e)
      })
  }, [getSystems, setError, setSystems])

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
