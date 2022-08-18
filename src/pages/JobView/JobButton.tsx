import { Button } from '@mui/material'
import { AxiosResponse } from 'axios'
// import { useJobServices } from 'services/job.service/job.service'
import { Job } from 'types/backend-types'

interface JobButtonParams {
  job: Job
  id: string
  callback: (response: AxiosResponse) => void
}

const JobButton = ({ job, id, callback }: JobButtonParams) => {
  // const { pauseJob, resumeJob } = useJobServices()
  if (job.status === 'RUNNING') {
    return (
      <Button
        variant="contained"
        style={{ backgroundColor: '#e38d13', color: 'white' }}
        onClick={() => {
          // pauseJob(callback, id)
          return
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
        // resumeJob(callback, id)
        return
      }}
    >
      Resume job
    </Button>
  )
}

export { JobButton }
