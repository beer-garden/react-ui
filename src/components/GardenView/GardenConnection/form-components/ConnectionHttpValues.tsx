import { Stack } from '@mui/material'
import { FC, Fragment } from 'react'
import ConnectionCheckboxGroup from './ConnectionCheckboxGroup'
import ConnectionFormHeading from './ConnectionFormHeading'
import {
  ConnectionTextField,
  ConnectionTextFieldPropsType,
  getFieldValues,
} from './ConnectionTextField'

const ConnectionHttpValues: FC = () => {
  return (
    <Fragment>
      <ConnectionFormHeading labelText={'HTTP Settings'} sx={{ mb: -3 }} />
      <Stack direction="row" spacing={3} sx={{ m: 3 }}>
        {httpTopRow.map(mapper)}
      </Stack>
      <Stack direction="row" spacing={3} sx={{ ml: 3, mt: -3 }}>
        <ConnectionCheckboxGroup id={'httpCAVerify'} label={'CA verify'} />
        <ConnectionTextField
          props={getFieldValues('httpCACert', 'CA cert', {
            mt: 1,
          })}
        />
      </Stack>
      <Stack direction="row" spacing={3} sx={{ ml: 3 }}>
        <ConnectionCheckboxGroup id={'httpSsl'} label={'SSL'} />
        <ConnectionTextField
          props={getFieldValues('httpClientCert', 'Client cert', {
            mt: 1,
          })}
        />
      </Stack>
    </Fragment>
  )
}

export default ConnectionHttpValues

const mapper = (entry: {
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
      sx: {},
      type: 'number',
    },
  },
  {
    key: '3',
    value: {
      id: 'httpUrlPrefix',
      label: 'URL prefix',
    },
  },
]
