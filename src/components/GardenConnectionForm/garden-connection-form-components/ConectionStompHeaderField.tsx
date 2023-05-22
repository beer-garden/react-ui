import { Stack, TextFieldProps } from '@mui/material'
import { FormTextField } from 'components/FormComponents'

type ConectionStompHeaderFieldProps = {
    index: number
    registerKey: string
    textFieldProps?: TextFieldProps
}

const ConectionStompHeaderField = ({ index, registerKey, textFieldProps }: ConectionStompHeaderFieldProps) => {
  return (
    <Stack direction="row" spacing={1}>
        <FormTextField
            {...textFieldProps}
            registerKey={`${registerKey}.${index}.key`}
            label="Key"
        />
        <FormTextField
            {...textFieldProps}
            registerKey={`${registerKey}.${index}.value`}
            label="Value"
        />
    </Stack>
  )
}

export { ConectionStompHeaderField }
