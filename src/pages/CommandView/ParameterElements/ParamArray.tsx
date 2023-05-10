import { Alert, Box, Button, FormHelperText, Stack, Typography, } from '@mui/material'
import { useFormContext } from 'react-hook-form';
import { Parameter } from 'types/backend-types'

import { ParameterElement } from './ParameterElement';

interface ParamTextFieldProps {
  parameter: Parameter
  registerKey: string
}

const ParamArray = ({ parameter, registerKey }: ParamTextFieldProps) => {
  const { getValues, setValue, watch, setError, clearErrors, getFieldState } = useFormContext()

  const addItem = () => {
    const tempData = getValues(registerKey) || []
    if(!parameter.maximum || tempData.length < parameter.maximum)
    setValue(`${registerKey}.${tempData.length}`, null)
  }

  const removeItem = (index: number) => {
    const tempData = getValues(registerKey) || []
    if(!parameter.minimum || tempData.length > parameter.minimum) tempData.splice(index, 1)
    setValue(registerKey, tempData)
  }

  // triggers rerender when adding or removing
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const watchArray = watch(registerKey)

  const {error} = getFieldState(registerKey)

  const currentValue = getValues(registerKey) || []

  if(parameter.maximum && currentValue.length > parameter.maximum) {
    if(error?.type !== 'arrayLength') setError(registerKey, { type: 'arrayLength', message: `remove items max length is: ${parameter.maximum}` })
  } else if(parameter.minimum && currentValue.length < parameter.minimum) {
    if(error?.type !== 'arrayLength') setError(registerKey, { type: 'arrayLength', message: `add items min length is: ${parameter.minimum}` })
  } else if(error?.type === 'arrayLength') clearErrors(registerKey)

  return (
    <Box p={1} sx={{border: `solid 1px ${error?.type === 'arrayLength'? 'red' : 'gray'}`, borderRadius: 2}}>
      {parameter.display_name && <Typography variant="h3" >{parameter.display_name}</Typography>}
      <Stack pt={1} rowGap={2}>
        {currentValue.map((value: unknown, index: number) => {
          return (
            <Stack
              key={`${registerKey}-${index}`}
              direction="row" spacing={1}
              alignItems="start"
              justifyContent="space-between"
            >
              <ParameterElement parameter={parameter} parentKey={registerKey} ignoreMulti={true} arrayIndex={index} />
              <Button
                variant="contained"
                color="secondary"
                onClick={() => removeItem(index)}
                size="small"
                disabled={!!parameter.minimum && currentValue.length === parameter.minimum}
              >
                Remove
              </Button>
            </Stack>
          )
        })}
      </Stack>
        {parameter.description && 
          <FormHelperText sx={{pt: 2}} id={`${registerKey}-helperText`}>
            { error?.type === 'arrayLength' ?
              <Alert sx={{border: 'solid 0px gray'}} severity="error" variant="outlined" >{error.message}</Alert>
              :
              parameter.description
            }
          </FormHelperText>
        }
        <Button
          sx={{float: 'right', mt: parameter.description? 0 : 1}}
          variant="contained"
          color="secondary"
          onClick={addItem}
          disabled={!!parameter.maximum && currentValue.length === parameter.maximum}
        >
          Add
        </Button>
    </Box>
  )
}

export { ParamArray }
