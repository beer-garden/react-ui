import { Button } from '@mui/material'
import { AxiosResponse } from 'axios'
import { useJobs } from 'hooks/useJobs'
import { Job } from 'types/backend-types'

interface JobButtonParams {
  job: Job
  id: string
  callback: (response: AxiosResponse) => void
}

const JobButton = ({ job, id, callback }: JobButtonParams) => {
  const { pauseJob, resumeJob } = useJobs()
  if (job && job.status === 'RUNNING') {
    return (
      <Button
        variant="contained"
        style={{ backgroundColor: '#e38d13', color: 'white' }}
        onClick={() => {
          pauseJob(callback, id)
        }}
      >
        Pause job
      </Button>
    )
  }

  return (
    <Button
      variant="contained"
      style={{ backgroundColor: 'green', color: 'white' }}
      onClick={() => {
        resumeJob(callback, id)
      }}
    >
      Resume job
    </Button>
  )
}

export { JobButton }
