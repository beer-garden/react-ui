import { Divider } from '@mui/material'
import useAxios from 'axios-hooks'
import { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader'
import { Job } from '../../types/custom_types'
import { useIsAuthEnabled } from '../../hooks/useIsAuthEnabled'
import { getFormattedTable } from './jobIndexHelpers'

const JobIndex = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const { authIsEnabled } = useIsAuthEnabled()
  const [{ data, error }] = useAxios({
    url: '/api/v1/jobs',
    method: 'get',
    withCredentials: authIsEnabled,
  })

  useEffect(() => {
    if (data && !error) {
      setJobs(data)
    }
  }, [data, error])

  return (
    <div>
      <PageHeader title="Request Scheduler" description="" />
      <Divider />
      {getFormattedTable(jobs)}
    </div>
  )
}

export default JobIndex
