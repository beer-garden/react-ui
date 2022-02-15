import { Backdrop, CircularProgress } from '@mui/material'
import { AxiosResponse } from 'axios'
import { useState } from 'react'
import Divider from '../components/divider'
import PageHeader from '../components/page_header'
import RequestsTable from '../components/table'
import { Job, TableState } from '../custom_types/custom_types'
import JobsService from '../services/job_service'
import { jobLink, systemLink } from '../services/routing_links'

const JobsApp = (): JSX.Element => {
  const [jobs, setJobs] = useState<Job[]>()
  const state: TableState = {
    completeDataSet: [],
    formatData: formatData,
    cacheKey: `lastKnown_${window.location.href}`,
    includePageNav: true,
    disableSearch: true,
    tableHeads: [
      'Job Name',
      'Status',
      'System',
      'Instance',
      'Command',
      'Next Run Time',
      'Success Count',
      'Error Count',
    ],
  }
  const title = 'Request Scheduler'

  if (!jobs) {
    JobsService.getJobs(successCallback)
  }

  function formatData(jobs: Job[]) {
    const tempData: (string | JSX.Element | number | null)[][] = []
    for (const i in jobs) {
      tempData[i] = [
        jobLink(jobs[i].name, jobs[i].id),
        jobs[i].status,
        systemLink(jobs[i].request_template.system, [
          jobs[i].request_template.namespace,
          jobs[i].request_template.system,
        ]),
        jobs[i].request_template.instance_name,
        jobs[i].request_template.command,
        new Date(jobs[i].next_run_time).toString(),
        jobs[i].success_count,
        jobs[i].error_count,
      ]
    }
    return tempData
  }

  function successCallback(response: AxiosResponse) {
    setJobs(response.data)
  }

  function getTable() {
    if (jobs) {
      state.completeDataSet = jobs
      return <RequestsTable parentState={state} />
    } else {
      return (
        <Backdrop open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )
    }
  }
  return (
    <div>
      <PageHeader title={title} description={''} />
      <Divider />
      {getTable()}
    </div>
  )
}

export default JobsApp
