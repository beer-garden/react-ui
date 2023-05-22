import { Button, TextFieldProps, Typography } from '@mui/material'
import { Divider } from 'components/Divider'
import { FormTextField } from 'components/FormComponents'
import {
  ConnectionHttpFields,
  ConnectionStompFields,
} from 'components/GardenConnectionForm'
import { PermissionsContainer } from 'containers/PermissionsContainer'
import { FieldValues, FormProvider, useForm, } from 'react-hook-form'
import { Garden } from 'types/backend-types'

interface GardenConnectionFormProps {
  garden: Garden
  title: string
  formOnSubmit: (garden: Garden) => void
  includeGardenName?: boolean
}

const GardenConnectionForm = ({
  garden,
  title,
  formOnSubmit,
  includeGardenName,
}: GardenConnectionFormProps) => {
  const { hasPermission } = PermissionsContainer.useContainer()

  const methods = useForm({defaultValues: garden as FieldValues})
  const { handleSubmit, formState: { errors }, getValues, watch } = methods
  const textFieldProps: TextFieldProps = {
    disabled: !hasPermission('garden:update')
  }

  const submitForm = (garden: FieldValues) => {
    if(Object.keys(errors).length === 0) formOnSubmit(garden as Garden)
  }

  watch('connection_type')
  const connectionType: 'HTTP' | 'STOMP' = getValues('connection_type')

  return (
      <FormProvider {...methods} >
        <form onSubmit={handleSubmit(submitForm)}>
            <Typography variant="h3">{title}</Typography>
              {includeGardenName ? 
                <>
                  <FormTextField
                    {...textFieldProps}
                    registerKey="name"
                    registerOptions={{
                      required: {
                        value: true,
                        message: 'Garden name is required'
                      }
                    }}
                    label="Garden name"
                    fullWidth={false}
                    sx={{m: 2, mb: 1, minWidth: '150px'}}
                  />
                  <br/>
                </>
                :
                null
              }
              <FormTextField
                {...textFieldProps}
                registerKey="connection_type"
                registerOptions={{
                  required: {
                    value: true,
                    message: 'Connection method is required'
                  }
                }}
                menuOptions={['HTTP', 'STOMP']}
                label="Connection method"
                helperText="Select the connection method"
                fullWidth={false}
                sx={{m: 2, mb: 1, minWidth: '150px'}}
              />
            <Divider />
            <ConnectionHttpFields connectionType={connectionType} textFieldProps={textFieldProps} display={connectionType === 'HTTP' ? '' : 'none'} />
            <ConnectionStompFields connectionType={connectionType} textFieldProps={textFieldProps} display={connectionType === 'STOMP' ? '' : 'none'} />
            <Divider />
            {hasPermission('garden:update') && (
              <Button
                color="primary"
                variant="contained"
                fullWidth
                type="submit"
                disabled={!hasPermission('garden:update')}
              >
                {title}
              </Button>
            )}
        </form>
      </FormProvider>
  )
}

export { GardenConnectionForm }
