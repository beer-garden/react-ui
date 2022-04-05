import { Alert, Link } from '@mui/material'
import JobViewForm from '../components/job_create_form'

type MyProps = {
  location: any
}

const JobCreateApp = ({ location }: MyProps) => {
  const { request } = location.state || {}

  let formElement: JSX.Element

  if (request) {
    formElement = <JobViewForm request={request} />
  } else {
    formElement = (
      <Alert severity="error">
        Need to choose a command before creating a job.{' '}
        <Link href="/systems">Systems</Link>
      </Alert>
    )
  }
  return formElement
}

export default JobCreateApp
