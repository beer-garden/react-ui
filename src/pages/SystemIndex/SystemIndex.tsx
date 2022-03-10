import { Box, Divider } from '@mui/material'
import useAxios from 'axios-hooks'
import { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader'
import Table from '../../components/table'
import { System } from '../../types/custom_types'
import { useIsAuthEnabled } from '../../hooks/useIsAuthEnabled'
import { formatSystems } from './systemIndexHelpers'

const SystemsIndex = () => {
  const [systems, setSystems] = useState<System[]>([])
  const { authIsEnabled } = useIsAuthEnabled()
  const [{ data, error }] = useAxios({
    url: '/api/v1/systems',
    method: 'GET',
    withCredentials: authIsEnabled,
  })
  useEffect(() => {
    if (data && !error) {
      setSystems(data)
    }
  }, [data, error])

  return (
    <div>
      <PageHeader title="Systems" description="" />
      <Divider />
      <Box pt={1}>
        <Table
          parentState={{
            completeDataSet: systems,
            formatData: formatSystems,
            cacheKey: `lastKnown_${window.location.href}`,
            includePageNav: true,
            disableSearch: false,
            tableHeads: [
              'Namespace',
              'System',
              'Version',
              'Description',
              'Commands',
              'Instances',
              '',
            ],
          }}
        />
      </Box>
    </div>
  )
}

export default SystemsIndex
