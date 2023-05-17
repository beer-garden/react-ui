import { Alert, Box, Button, FormHelperText, Stack, Typography } from '@mui/material'
import { useFormContext } from 'react-hook-form'

type ConnectionTextFieldProps = {
  registerKey: string
  disabled?: boolean
  helperText?: string
  label?: string
  minimum?: number
  maximum?: number
  addValue?: unknown
  getFieldJsx: (index: number, registerKey: string) => JSX.Element
}

const FormArray = ({ registerKey, disabled, helperText, label, minimum, maximum, addValue, getFieldJsx, }: ConnectionTextFieldProps) => {
  const { getFieldState, getValues, setError, clearErrors, setValue, watch } = useFormContext()

  const removeItem = (index: number) => {
    const tempData = getValues(registerKey) || []
    if(!minimum || tempData.length > minimum) {
        tempData.splice(index, 1)
        setValue(registerKey, tempData)
    }
  }

  const addItem = () => {
    const tempData = getValues(registerKey) || []
    if(!maximum || tempData.length < maximum)
    setValue(`${registerKey}.${tempData.length}`, addValue ? addValue : null)
  }

  watch(registerKey)

  const currentValue = getValues(registerKey) || []

  const error = getFieldState(registerKey).error

  if(maximum && currentValue.length > maximum) {
    if(error?.type !== 'arrayLength') setError(registerKey, { type: 'arrayLength', message: `remove items max length is: ${maximum}` })
  } else if(minimum && currentValue.length < minimum) {
    if(error?.type !== 'arrayLength') setError(registerKey, { type: 'arrayLength', message: `add items min length is: ${minimum}` })
  } else if(error?.type === 'arrayLength') clearErrors(registerKey)

  return (
    <Box p={1} sx={{border: `solid 1px ${error?.type === 'arrayLength'? 'red' : 'gray'}`, borderRadius: 2}} >
        {label && <Typography variant="h3" >{label}</Typography>}
        <Stack pt={1} rowGap={2}>
        {currentValue.map((value: unknown, index: number) => {
            return (
            <Stack
                key={`${registerKey}-${index}`}
                direction="row" 
                spacing={1}
                alignItems="start"
                justifyContent="space-between"
            >
                {getFieldJsx(index, registerKey)}
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => removeItem(index)}
                    size="small"
                    disabled={(!!minimum && currentValue.length === minimum) || disabled}
                >
                    Remove
                </Button>
            </Stack>
            )
        })}
        </Stack>
        <Stack sx={{pt: 2}} direction="row" justifyContent="space-between" spacing={2} alignItems="start">
            { 
            <FormHelperText id={`${registerKey}-helperText`}>
                { error?.type === 'arrayLength' ?
                <Alert sx={{border: 'solid 0px gray'}} severity="error" variant="outlined" >{error.message}</Alert>
                :
                helperText
                }
            </FormHelperText>
            }
            <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={addItem}
                disabled={!!maximum && currentValue.length === maximum}
            >
                Add
            </Button>
        </Stack>
    </Box>
  )
}

export { FormArray }
