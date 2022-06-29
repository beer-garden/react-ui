import { Divider, Stack } from '@mui/material'
import {
  ConnectionCheckboxGroup,
  ConnectionFormHeading,
  ConnectionStompHeaders,
  ConnectionTextField,
  ConnectionTextFieldPropsType,
} from 'pages/GardenAdminView'
import { Fragment } from 'react'

const ConnectionStompValues = () => {
  return (
    <Fragment>
      <ConnectionFormHeading labelText={'STOMP Settings'} sx={{ mb: -3 }} />
      <Stack direction="row" spacing={3} sx={{ m: 3 }}>
        {firstRow.map(mapToTextfieldComponents)}
      </Stack>
      <Stack direction="row" spacing={3} sx={{ m: 3 }}>
        {secondRow.map(mapToTextfieldComponents)}
      </Stack>
      <Stack direction="row" spacing={3} sx={{ m: 3 }}>
        {thirdRow.map(mapToTextfieldComponents)}
      </Stack>
      <Stack direction="row" sx={{ ml: 3, mt: -3 }}>
        <ConnectionCheckboxGroup
          id={'stompSsl'}
          label={'SSL'}
          tooltip="Whether to connect with provided certifications"
        />
      </Stack>
      <Divider sx={{ mt: 2, mb: 1 }} />
      <ConnectionStompHeaders />
    </Fragment>
  )
}

export { ConnectionStompValues }

const mapToTextfieldComponents = (entry: {
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
      tooltip: 'Beer-garden hostname',
      sx: { mt: 0 },
    },
  },
  {
    key: '5',
    value: {
      id: 'stompPort',
      label: 'Port',
      tooltip: 'Beer-garden port',
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
      tooltip: 'Destination queue where Stomp will send messages',
      sx: { mt: 0 },
    },
  },
  {
    key: '7',
    value: {
      id: 'stompSubscribeDestination',
      label: 'Subscribe destination',
      tooltip: 'Destination queue where Stomp will listen for messages',
      sx: { mt: 0 },
    },
  },
]

const thirdRow = [
  {
    key: '8',
    value: {
      id: 'stompUsername',
      label: 'Username',
      tooltip: 'Username for Stomp connection',
      sx: { mt: 0 },
    },
  },
  {
    key: '9',
    value: {
      id: 'stompPassword',
      label: 'Password',
      tooltip: 'Password for Stomp connection',
      sx: { mt: 0 },
      type: 'password',
    },
  },
]
