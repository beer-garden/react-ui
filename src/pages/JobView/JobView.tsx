import { Box, Button, Typography } from '@mui/material'
import { AxiosResponse } from 'axios'
import PageHeader from 'components/PageHeader'
import { JobButton } from 'pages/JobView'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useJobServices } from 'services/job.service/job.service'
import { Job } from 'types/backend-types'

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
    <Box>
      <Typography style={{ flex: 1, float: 'right' }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={deleteButtonCallback}
        >
          Delete Job
        </Button>
        (job &&
        <JobButton job={job as Job} id={id} callback={jobButtonCallback} />)
        <Button variant="contained" color="primary">
          Update Job
        </Button>
      </Typography>
      <PageHeader title="Job" description={description} />
    </Box>
  )
}

export { JobView }
