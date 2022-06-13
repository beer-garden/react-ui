import { Link as RouterLink, useLocation } from 'react-router-dom'
import { Alert } from '@mui/material'
import JobViewForm from 'components/job_create_form'

const JobCreateApp = () => {
  const location = useLocation()
  const request: any = location?.state

  let formElement: JSX.Element

  if (request) {
    formElement = <JobViewForm request={request} />
  } else {
    formElement = (
      <Alert severity="error">
        Need to choose a command before creating a job.{' '}
        <RouterLink to="/systems">Systems</RouterLink>
      </Alert>
    )
  }
  return formElement
}

export default JobCreateApp
