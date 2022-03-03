import { FC, Fragment } from 'react'
import ConnectionFormHeading from './ConnectionFormHeading'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import {
  ConnectionTextField,
  ConnectionTextFieldPropsType,
} from './ConnectionTextField'
import ConnectionCheckboxGroup from './ConnectionCheckboxGroup'
import ConnectionStompHeaders from './ConnectionStompHeaders'

const ConnectionStompValues: FC = () => {
  return (
    <Fragment>
      <ConnectionFormHeading labelText={'STOMP Settings'} sx={{ mb: -3 }} />
      <Stack direction="row" spacing={3} sx={{ m: 3 }}>
        {firstRow.map(mapper)}
      </Stack>
      <Stack direction="row" spacing={3} sx={{ m: 3 }}>
        {secondRow.map(mapper)}
      </Stack>
      <Stack direction="row" spacing={3} sx={{ m: 3 }}>
        {thirdRow.map(mapper)}
      </Stack>
      <Stack direction="row" sx={{ ml: 3, mt: -3 }}>
        <ConnectionCheckboxGroup id={'stompSsl'} label={'SSL'} />
      </Stack>
      <Divider sx={{ mt: 2, mb: 1 }} />
      <ConnectionStompHeaders />
    </Fragment>
  )
}

export default ConnectionStompValues

const mapper = (entry: {
  key: string
  value: ConnectionTextFieldPropsType
}) => {
  const { key, value } = entry
  return <ConnectionTextField key={key} props={value} />
}

const firstRow = [
  {
    key: '4',
    value: {
      id: 'stompHost',
      label: 'Host',
      sx: { mt: 0 },
    },
  },
  {
    key: '5',
    value: {
      id: 'stompPort',
      label: 'Port',
      sx: { mt: 0 },
      type: 'number',
    },
  },
]

const secondRow = [
  {
    key: '6',
    value: {
      id: 'stompSendDestination',
      label: 'Send destination',
      sx: { mt: 0 },
    },
  },
  {
    key: '7',
    value: {
      id: 'stompSubscribeDestination',
      label: 'Subscribe destination',
      sx: { mt: 0 },
    },
  },
]

const thirdRow = [
  {
    key: '8',
    value: { id: 'stompUsername', label: 'Username', sx: { mt: 0 } },
  },
  {
    key: '9',
    value: {
      id: 'stompPassword',
      label: 'Password',
      sx: { mt: 0 },
      type: 'password',
    },
  },
]
