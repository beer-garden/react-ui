import {
  Alert,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

export type SpecificErrorType = 'request' | 'job' | 'garden' | 'user'
export type ErrorStatusCode = 403 | 404 | 500
type ErrorType = { common: AxiosErrorProblem[] } & {
  [S in SpecificErrorType]?: AxiosErrorProblem[]
}

interface ErrorAlertProps {
  specific?: SpecificErrorType
  statusCode: number
  errorMsg: string
}

type AxiosErrorProblem = {
  problem: string
  description: string
  resolution: JSX.Element | string
}

const errorMap: { [E in ErrorStatusCode]: ErrorType } = {
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
          <Box>
            Go back to the list of all{' '}
            <RouterLink to="/requests">requests</RouterLink>.
          </Box>
        ),
      },
    ],
    job: [
      {
        problem: 'Job was removed',
        description: 'An authorized user could have deleted the job.',
        resolution: (
          <Box>
            Go back to the list of <RouterLink to="/jobs">jobs</RouterLink>.
          </Box>
        ),
      },
    ],
    garden: [
      {
        problem: 'Garden was removed',
        description: 'An authorized user could have deleted the garden.',
        resolution: (
          <Box>
            Go back to the list of{' '}
            <RouterLink to="/admin/gardens">gardens</RouterLink>.
          </Box>
        ),
      },
    ],
    user: [
      {
        problem: 'User was removed',
        description: 'An authorized user could have deleted the user.',
        resolution: (
          <Box>
            Go back to the list of{' '}
            <RouterLink to="/admin/users">users</RouterLink>.
          </Box>
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
  const problems = errorMap[statusCode as ErrorStatusCode]
  let problemList: AxiosErrorProblem[] = []
  if (problems) {
    problemList = problems['common'].concat(
      (specific && problems[specific]) || [],
    )
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
          <CardContent>{problem.resolution}</CardContent>
        </Card>
      ))}
    </>
  )
}

export { ErrorAlert, errorMap }
