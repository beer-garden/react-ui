import { ControlProps } from '@jsonforms/core'
import { Box, TextField } from '@mui/material'
import { BaseSyntheticEvent, FC } from 'react'

interface DictAnyProps {
  controlProps: ControlProps
}

function getTitle(controlProps: ControlProps) {
  const array = controlProps.path.split('.')
  return (
    controlProps.label ||
    controlProps.schema.title ||
    array[array.length - 1].split('__')[0]
  )
}

export const DictionaryAny: FC<DictAnyProps> = ({
  controlProps,
}: DictAnyProps) => {
  const type = controlProps.schema.type || []
  const handleChange = (event: BaseSyntheticEvent) => {
    try {
      if (event.target.value === '') {
        controlProps.handleChange(controlProps.path, null)
      } else {
        const tempDict = JSON.parse(event.target.value)
        if (type.includes(typeof tempDict)) {
          controlProps.handleChange(controlProps.path, tempDict)
        } else {
          throw new Error()
        }
      }
    } catch (err) {
      let value
      if (!type.includes('null')) {
        value = null
      }
      controlProps.handleChange(controlProps.path, value)
    }
  }

  function formatValue(value: unknown) {
    if (value) {
      return JSON.stringify(value)
    } else {
      return ''
    }
  }

  function getHelperText() {
    const msg = 'should be number, boolean, array, object, string'
    if (controlProps.errors !== '') {
      if (typeof type === 'string') {
        return controlProps.errors
      } else if (
        type.includes('object') &&
        type.includes('null') &&
        type.length <= 2
      ) {
        return 'should be object, null'
      } else if (type.includes('null')) {
        return msg + ', null'
      } else {
        return msg
      }
    }
  }

  function getVariant() {
    if (type.includes('object')) {
      return 'outlined'
    }
    return 'standard'
  }

  return (
    <Box pt={2}>
      <TextField
        required={controlProps.required}
        error={controlProps.errors !== ''}
        defaultValue={formatValue(controlProps.data)}
        multiline={
          (type.includes('object') && type.length <= 2) ||
          typeof type === 'string'
        }
        rows={3}
        maxRows={3}
        fullWidth
        label={getTitle(controlProps)}
        helperText={getHelperText()}
        variant={getVariant()}
        onChange={handleChange}
      />
    </Box>
  )
}
