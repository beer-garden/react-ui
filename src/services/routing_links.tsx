import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight'
import Box from '@mui/material/Box'
import { Link as RouterLink } from 'react-router-dom'
import { Request } from 'types/backend-types'

export function systemLink(text: string, params: string[]): JSX.Element {
  return <RouterLink to={'/systems/' + params.join('/')}>{text}</RouterLink>
}

export function jobLink(name: string, id: string): JSX.Element {
  return <RouterLink to={'/jobs/' + id}>{name}</RouterLink>
}

export function requestLink(request: Request): JSX.Element {
  if (request.parent) {
    return (
      <Box>
        <RouterLink to={'/requests/' + request.parent.id}>
          <SubdirectoryArrowRightIcon />
        </RouterLink>
        <RouterLink to={'/requests/' + request.id}>
          {request.command}
        </RouterLink>
      </Box>
    )
  } else {
    return (
      <RouterLink to={'/requests/' + request.id}>{request.command}</RouterLink>
    )
  }
}
