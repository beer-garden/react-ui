import { Grid, GridProps } from '@mui/material'
import { FormArray, FormCheckbox, FormTextField } from 'components/FormComponents'
import { ConectionStompHeaderField } from 'components/GardenConnectionForm'
import { ConnectionFieldsProps } from 'types/garden-connection-form-types'

const ConnectionStompFields = ({connectionType, textFieldProps, ...gridProps}: ConnectionFieldsProps) => {
  const gridItemProps: GridProps = {
    item: true,
    minWidth: '280px',
    xs: 2
  }

  const getFieldJsx = (index: number, registerKey: string,): JSX.Element => {
    return (
      <ConectionStompHeaderField index={index} registerKey={registerKey} textFieldProps={textFieldProps} />
    )
  }


  return (
    <Grid container key="StompInfo" columnSpacing={1} rowSpacing={2} columns={10} px={2} py={1} {...gridProps} >
              <Grid {...gridItemProps} >
                <FormTextField
                  {...textFieldProps}
                  registerKey="connection_params.stomp.host"
                  registerOptions={{
                    required: {
                      value: connectionType === 'STOMP',
                      message: 'Host is required'
                    }
                  }}
                  label="Host"
                />
              </Grid>
              <Grid item minWidth="125px" maxWidth="125px" xs={1}>
                <FormTextField
                  {...textFieldProps}
                  registerKey="connection_params.stomp.port"
                  registerOptions={{
                    valueAsNumber: true,
                    min: {value: 0, message: 'Port number must be 0 or greater'},
                    required: {
                      value: connectionType === 'STOMP',
                      message: 'Port is required'
                    },
                  }}
                  type="number"
                  label="Port"
                  inputProps={{min: 0}}
                />
              </Grid>
              <Grid {...gridItemProps} >
                <FormTextField
                  {...textFieldProps}
                  registerKey="connection_params.stomp.send_destination"
                  helperText="URL path that will be used as a prefix"
                  label="Send destination"
                />
              </Grid>
              <Grid {...gridItemProps} >
                <FormTextField
                  {...textFieldProps}
                  registerKey="connection_params.stomp.subscribe_destination"
                  label="Subscribe destination"
                />
              </Grid>
              <Grid {...gridItemProps} >
                <FormTextField
                  {...textFieldProps}
                  registerKey="connection_params.stomp.username"
                  label="Username"
                  helperText="Required if auth is enabled on the remote garden"
                />
              </Grid>
              <Grid {...gridItemProps} >
                <FormTextField
                  {...textFieldProps}
                  registerKey="connection_params.stomp.password"
                  label="Password"
                  type="password"
                  helperText="Required if auth is enabled on the remote garden"
                />
              </Grid>
              <Grid item minWidth="180px" maxWidth="180px" xs={1}>
                <FormCheckbox
                  registerKey="connection_params.stomp.ssl.use_ssl"
                  disabled={textFieldProps?.disabled}
                  label="SSL Enabled"
                />
              </Grid>
              <Grid {...gridItemProps} >
                <FormTextField
                  {...textFieldProps}
                  registerKey="connection_params.stomp.ssl.ca_cert"
                  label="CA cert file path"
                />
              </Grid>
              <Grid {...gridItemProps} >
                <FormTextField
                  {...textFieldProps}
                  registerKey="connection_params.stomp.ssl.client_cert"
                  label="Client cert file path"
                />
              </Grid>
              <Grid {...gridItemProps} >
                <FormTextField
                  {...textFieldProps}
                  registerKey="connection_params.stomp.ssl.client_key"
                  label="Client key file path"
                />
              </Grid>
              <Grid item minWidth="400px" xs={3} >
                <FormArray registerKey="connection_params.stomp.headers" getFieldJsx={getFieldJsx} addValue={{key: '', value: ''}} label="Headers" />
              </Grid>
    </Grid>
  )
}

export { ConnectionStompFields }
