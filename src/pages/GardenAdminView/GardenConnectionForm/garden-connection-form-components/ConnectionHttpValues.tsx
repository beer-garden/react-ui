import { Stack } from '@mui/material'
import {
  ConnectionCheckboxGroup,
  ConnectionFormHeading,
  ConnectionTextField,
  ConnectionTextFieldPropsType,
  getFieldValues,
} from 'pages/GardenAdminView'
import { Fragment } from 'react'

const ConnectionHttpValues = () => {
  return (
    <Fragment>
      <ConnectionFormHeading labelText={'HTTP Settings'} sx={{ mb: -3 }} />
      <Stack direction="row" spacing={3} sx={{ m: 3 }}>
        {httpTopRow.map(mapToTextfieldComponents)}
      </Stack>
      <Stack direction="row" spacing={3} sx={{ ml: 3, mt: -3 }}>
        <ConnectionCheckboxGroup
          id={'httpCAVerify'}
          label={'CA verify'}
          tooltip="Whether to verify Beer-garden server certificate"
        />
        <ConnectionTextField
          props={{
            ...getFieldValues('httpCACert', 'CA cert', {
              mt: 1,
            }),
            tooltip:
              'Path to certificate file containing the certificate of the ' +
              'authority that issued the Beer-garden server certificate',
          }}
        />
      </Stack>
      <Stack direction="row" spacing={3} sx={{ ml: 3 }}>
        <ConnectionCheckboxGroup
          id={'httpSsl'}
          label={'SSL'}
          tooltip="Whether to connect with provided certifications"
        />
        <ConnectionTextField
          props={{
            ...getFieldValues('httpClientCert', 'Client cert', {
              mt: 0,
            }),
            tooltip:
              'Path to client certificate to use when communicating ' +
              'with Beer-garden',
          }}
        />
      </Stack>
      <Stack direction="row" spacing={3} sx={{ m: 3 }}>
        <ConnectionTextField
          props={{
            ...getFieldValues('httpUsername', 'Client username', {
              mt: 0,
            }),
            tooltip: 'Required if auth is enabled on the remote garden',
          }}
        />
        <ConnectionTextField
          props={{
            ...getFieldValues('httpPassword', 'Client password', {
              mt: 1,
            }),
            tooltip: 'Required if auth is enabled on the remote garden',
          }}
        />
      </Stack>
    </Fragment>
  )
}

export { ConnectionHttpValues }

const mapToTextfieldComponents = (entry: {
  key: string
  value: ConnectionTextFieldPropsType
}) => {
  const { key, value } = entry
  return <ConnectionTextField key={key} props={value} />
}

const httpTopRow = [
  {
    key: '1',
    value: {
      id: 'httpHost',
      label: 'Host',
      tooltip: 'Beer-garden hostname',
      sx: {
        mt: 0,
      },
    },
  },
  {
    key: '2',
    value: {
      id: 'httpPort',
      label: 'Port',
      tooltip: 'Beer-garden port',
      sx: {},
      type: 'number',
    },
  },
  {
    key: '3',
    value: {
      id: 'httpUrlPrefix',
      label: 'URL prefix',
      tooltip:
        'URL path that will be used as a prefix when communicating with ' +
        "Beer-garden. Useful if Beer-garden is running on a URL other than '/'",
    },
  },
]
