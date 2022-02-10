import React, { FC } from 'react'
import JobViewForm from '../components/job_create_form'
import { Alert } from '@material-ui/lab'
import { Link } from '@material-ui/core'

type MyProps = {
  location: any
}

const JobCreateApp: FC<MyProps> = ({ location }: MyProps) => {
  const { request } = location.state || {}

  let formElement: JSX.Element

  if (request) {
    formElement = <JobViewForm request={request} />
  } else {
    formElement = (
      <Alert severity="error">
        Need to pick a command before creating a job.{' '}
        <Link href="/systems">Systems</Link>
      </Alert>
    )
  }
  return formElement
}

export default JobCreateApp
