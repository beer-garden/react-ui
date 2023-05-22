import { Grid, GridProps } from '@mui/material'
import { FormCheckbox, FormTextField } from 'components/FormComponents'
import { ConnectionFieldsProps } from 'types/garden-connection-form-types'

const ConnectionHttpFields = ({connectionType, textFieldProps, ...gridProps}: ConnectionFieldsProps) => {

  const gridItemProps: GridProps = {
    item: true,
    minWidth: '280px',
    xs: 2
  }

  return (
    <Grid container key="HttpInfo" columnSpacing={1} rowSpacing={2} columns={10} px={2} py={1} {...gridProps} >
              <Grid {...gridItemProps} >
                <FormTextField
                  {...textFieldProps}
                  registerKey="connection_params.http.host"
                  registerOptions={{
                    required: {
                      value: connectionType === 'HTTP',
                      message: 'Host is required'
                    }
                  }}
                  label="Host"
                />
              </Grid>
              <Grid item minWidth="125px" maxWidth="125px" xs={1}>
                <FormTextField
                  {...textFieldProps}
                  registerKey="connection_params.http.port"
                  registerOptions={{
                    valueAsNumber: true,
                    min: {value: 0, message: 'Port number must be 0 or greater'},
                    required: {
                      value: connectionType === 'HTTP',
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
                  registerKey="connection_params.http.url_prefix"
                  helperText="URL path that will be used as a prefix"
                  label="URL prefix"
                />
              </Grid>
              <Grid {...gridItemProps} >
                <FormTextField
                  {...textFieldProps}
                  registerKey="connection_params.http.ca_cert"
                  label="CA cert file path"
                />
              </Grid>
              <Grid {...gridItemProps} >
                <FormTextField
                  {...textFieldProps}
                  registerKey="connection_params.http.client_cert"
                  label="Client cert file path"
                />
              </Grid>
              <Grid {...gridItemProps} >
                <FormTextField
                  {...textFieldProps}
                  registerKey="connection_params.http.username"
                  label="Username"
                  helperText="Required if auth is enabled on the remote garden"
                />
              </Grid>
              <Grid {...gridItemProps} >
                <FormTextField
                  {...textFieldProps}
                  registerKey="connection_params.http.password"
                  label="Password"
                  type="password"
                  helperText="Required if auth is enabled on the remote garden"
                />
              </Grid>
              <Grid item minWidth="180px" maxWidth="180px" xs={1}>
                <FormCheckbox
                  registerKey="connection_params.http.ssl"
                  disabled={textFieldProps?.disabled}
                  label="SSL Enabled"
                />
              </Grid>
              <Grid item minWidth="180px" maxWidth="180px" xs={1} >
                <FormCheckbox
                  registerKey="connection_params.http.ca_verify"
                  disabled={textFieldProps?.disabled}
                  label="CA Cert Verify"
                />
              </Grid>
    </Grid>
  )
}

export { ConnectionHttpFields }
