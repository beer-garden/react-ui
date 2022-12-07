import {
  Alert,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

interface ErrorAlertProps {
  specific?: string
  statusCode: number
  errorMsg: string
}

type AxiosErrorProblem = {
  problem: string
  description: string
  resolution: JSX.Element | string
}

const errorMap: {
  [key: number]: { [key: string]: AxiosErrorProblem[] }
} = {
  403: {
    common: [
      {
        problem: 'Insufficient Permissions',
        description:
          'You do not have the necessary permission to view this data or perform this action.',
        resolution:
          'Contact your administrator and request to be given permission.',
      },
      {
        problem: 'Signature verification failed',
        description:
          'The signature of the token used in the request could not be validated by the server.',
        resolution:
          'Log out (if currently logged in) and log in again to generate a new token.',
      },
    ],
  },
  404: {
    common: [
      {
        problem: 'Wrong identifier',
        description:
          'The identifiers for the resource may be off. For example, a bookmark may be for an old version' +
          ' that has been removed.',
        resolution: 'Double-check that all identifiers are correct',
      },
    ],
    request: [
      {
        problem: 'Request was removed',
        description:
          'Beer Garden can be set to remove requests after several ' +
          'minutes, so this request may have been removed.',
        resolution: (
          <div>
            Go back to the list of all{' '}
            <RouterLink to="/requests">requests</RouterLink>.
          </div>
        ),
      },
    ],
    job: [
      {
        problem: 'Job was removed',
        description: 'An authorized user could have deleted the job.',
        resolution: (
          <div>
            Go back to the list of <RouterLink to="/jobs">jobs</RouterLink>.
          </div>
        ),
      },
    ],
    garden: [
      {
        problem: 'Garden was removed',
        description: 'An authorized user could have deleted the garden.',
        resolution: (
          <div>
            Go back to the list of{' '}
            <RouterLink to="/admin/gardens">gardens</RouterLink>.
          </div>
        ),
      },
    ],
    user: [
      {
        problem: 'User was removed',
        description: 'An authorized user could have deleted the user.',
        resolution: (
          <div>
            Go back to the list of{' '}
            <RouterLink to="/admin/users">users</RouterLink>.
          </div>
        ),
      },
    ],
  },
  500: {
    common: [
      {
        problem: 'Unable to route request',
        description:
          'The request could not be sent to Beer Garden. Beer Garden may be offline or is unreachable.',
        resolution:
          'Contact your system administrator to resolve the issue, or try again at a later time.',
      },
    ],
  },
}

const ErrorAlert = ({ specific, statusCode, errorMsg }: ErrorAlertProps) => {
  let problemList = errorMap[statusCode]['common']
  if (specific && errorMap[statusCode][specific]) {
    problemList = problemList.concat(errorMap[statusCode][specific])
  }

  return (
    <>
      <Alert severity="error">
        <Typography variant="h5" color="inherit">
          Error: {statusCode} {errorMsg}
        </Typography>
      </Alert>
      {problemList.map((problem, index) => (
        <Card key={`problem${index}`} sx={{ mt: 1 }}>
          <CardHeader title={`Problem: ${problem.problem}`} />
          <Divider />
          <CardContent>{problem.description}</CardContent>
          <Divider />
          <CardActions>{problem.resolution}</CardActions>
        </Card>
      ))}
    </>
  )
}

export { ErrorAlert, errorMap }
