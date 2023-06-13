import { Button } from '@mui/material'
import { JobRequestCreationContext } from 'components/JobRequestCreation'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Job } from 'types/backend-types'

interface UpdateJobButtonProps {
  job: Job
}

const UpdateJobButton = ({ job }: UpdateJobButtonProps) => {
  const navigate = useNavigate()
  const { setJob } = useContext(JobRequestCreationContext)

  return (
    <Button variant="contained" color="primary" onClick={() =>
      {
        setJob && setJob(job)
        navigate(
          [
            '/jobs/update',
            job.id,
          ].join('/'),
        )
      }
    }>
      Update Job
    </Button>
  )
}

export { UpdateJobButton }
