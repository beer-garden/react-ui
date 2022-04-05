import { Box, Divider } from '@mui/material'
import useAxios from 'axios-hooks'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Breadcrumbs from '../../components/Breadcrumbs'
import PageHeader from '../../components/PageHeader'
import Table from '../../components/table'
import { System } from '../../types/custom_types'
import { useIsAuthEnabled } from '../../hooks/useIsAuthEnabled'
import { formatData, getCommands } from './commandIndexHelpers'

const CommandIndex = () => {
  const [systems, setSystems] = useState<System[]>([])
  const { namespace, system_name: systemName, version } = useParams()
  const { authIsEnabled } = useIsAuthEnabled()
  const [{ data, error }] = useAxios({
    url: '/api/v1/systems',
    method: 'get',
    withCredentials: authIsEnabled,
  })
  useEffect(() => {
    if (data && !error) {
      setSystems(data)
    }
  }, [data, error])

  const breadcrumbs = [namespace, systemName, version]
    .filter((x) => !!x)
    .map((x) => String(x))

  return (
    <Box>
      <PageHeader title="Commands" description="" />
      <Divider />
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Table
        parentState={{
          completeDataSet: getCommands(systems, namespace, systemName, version),
          formatData: formatData,
          cacheKey: 'lastKnownCommandIndex',
          includePageNav: true,
          disableSearch: false,
          tableHeads: [
            'Namespace',
            'System',
            'Version',
            'Command',
            'Description',
            '',
          ],
        }}
      />
    </Box>
  )
}

export default CommandIndex
