import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material'
import { AxiosResponse } from 'axios'
import { FC, useState } from 'react'
import ReactJson from 'react-json-view'
import { Navigate, useParams } from 'react-router-dom'
import PageHeader from '../components/page_header'
import Table from '../components/table'
import { Job, TableState } from '../custom_types/custom_types'
import JobService from '../services/job_service'
import { systemLink } from '../services/routing_links'

const JobViewApp: FC = () => {
  const [job, setJob] = useState<Job>()
  const [redirect, setRedirect] = useState<JSX.Element>()
  const state: TableState = {
    completeDataSet: [],
    formatData: formatData,
    includePageNav: false,
    disableSearch: true,
    tableHeads: [
      'Job Name',
      'System',
      'System Version',
      'Instance Name',
      'Command',
      'Status',
      'Success Count',
      'Error Count',
      'Next Run Time',
    ],
  }
  const title = 'Job'
  const params = useParams()
  const id = String(params.id)
  let description = id

  if (!job) {
    JobService.getJob(successCallback, id)
  }

  function formatData(jobs: Job[]) {
    const tempData: (string | JSX.Element | number | null)[][] = []
    for (const i in jobs) {
      let date = ''
      if (jobs[i].status === 'RUNNING') {
        date = new Date(jobs[i].next_run_time).toString()
      }
      tempData[i] = [
        jobs[i].name,
        systemLink(jobs[i].request_template.system, [
          jobs[i].request_template.namespace,
          jobs[i].request_template.system,
        ]),
        systemLink(jobs[i].request_template.system_version, [
          jobs[i].request_template.namespace,
          jobs[i].request_template.system,
          jobs[i].request_template.system_version,
        ]),
        jobs[i].request_template.instance_name,
        jobs[i].request_template.command,
        jobs[i].status,
        jobs[i].success_count,
        jobs[i].error_count,
        date,
      ]
    }
    return tempData
  }

  function successCallback(response: AxiosResponse) {
    setJob(response.data)
  }

  if (job) {
    description = [job.name, id].join(' - ')
    state.completeDataSet = [job]
  }

  function renderComponents() {
    if (job) {
      return (
        <div>
          <Table parentState={state} />
          <Box p={2} display="flex" alignItems="flex-start">
            <Box width={1 / 2}>
              <h3>Trigger</h3>
              <Box border={1}>
                <ReactJson src={job.trigger} />
              </Box>
            </Box>
            <Box pl={1} width={1 / 2}>
              <h3>Request Template</h3>
              <Box border={1}>
                <ReactJson src={job.request_template} />
              </Box>
            </Box>
          </Box>
        </div>
      )
    } else {
      return (
        <Backdrop open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )
    }
  }

  function deleteCallback() {
    setRedirect(<Navigate to={'/jobs/'} />)
  }

  function getButton() {
    if (job) {
      if (job.status === 'RUNNING') {
        return (
          <Button
            variant="contained"
            style={{ backgroundColor: '#e38d13', color: 'white' }}
            onClick={() => {
              JobService.pauseJob(successCallback, id)
            }}
          >
            Pause job
          </Button>
        )
      } else if (job.status === 'PAUSED') {
        return (
          <Button
            variant="contained"
            style={{ backgroundColor: 'green', color: 'white' }}
            onClick={() => {
              JobService.resumeJob(successCallback, id)
            }}
          >
            Resume job
          </Button>
        )
      }
    }
  }
  return (
    <Box>
      {redirect}
      <Grid
        justifyContent="space-between" // Add it here :)
        container
      >
        <Grid item>
          <PageHeader title={title} description={description} />
        </Grid>
        <Grid item>
          <Typography style={{ flex: 1 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                JobService.deleteJob(deleteCallback, id)
              }}
            >
              Delete Job
            </Button>
            {getButton()}
            <Button variant="contained" color="primary">
              Update Job
            </Button>
          </Typography>
        </Grid>
      </Grid>
      {renderComponents()}
    </Box>
  )
}

export default JobViewApp