import { Button, Grid, Typography } from '@mui/material'
import { AxiosResponse } from 'axios'
import PageHeader from 'components/PageHeader'
import { JobButton } from 'pages/JobView'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useJobServices } from 'services/job.service/job.service'
import { Job } from 'types/custom_types'

const JobView = () => {
  const [job, setJob] = useState<Job | null>(null)
  const [description, setDescription] = useState('')
  const params = useParams()
  const { getJob, deleteJob } = useJobServices()
  const navigate = useNavigate()

  const id = params.id as string
  const jobButtonCallback = (response: AxiosResponse) => setJob(response.data)
  const deleteButtonCallback = () => deleteJob(() => navigate('/jobs'), id)
  useEffect(() => {
    if (id) {
      getJob((response: AxiosResponse) => setJob(response.data), id)
      if (job) {
        setDescription(job.name + id)
      } else {
        setDescription(id)
      }
    }
  }, [getJob, params.id, id, job])

  return (
    <Grid justifyContent="space-between" container>
      <Grid item>
        <PageHeader title="Job" description={description} />
      </Grid>
      <Grid item>
        <Typography style={{ flex: 1 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={deleteButtonCallback}
          >
            Delete Job
          </Button>
          <JobButton job={job as Job} id={id} callback={jobButtonCallback} />
          <Button variant="contained" color="primary">
            Update Job
          </Button>
        </Typography>
      </Grid>
    </Grid>
  )
}

export { JobView }
