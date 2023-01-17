import {
  Autocomplete,
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  AutocompleteInputChangeReason,
  TextField,
} from '@mui/material'
import { WidgetProps } from '@rjsf/core'
import { SyntheticEvent, useRef } from 'react'
import { ObjectWithStringKeys } from 'types/custom-types'

const TypeAheadChoicesWidget = (props: WidgetProps) => {
  const inputRef = useRef()
  const id = (props.schema as ObjectWithStringKeys)['id'] as string | undefined
  const values = id ? props.formContext[id]['choices'] : []

  const handleSelection = (
    event: SyntheticEvent<Element, Event>,
    value: string | null,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<string>,
  ) => {
    props.onChange(value)
  }

  const onInputChange = (
    event: SyntheticEvent<Element, Event>,
    value: string,
    reason: AutocompleteInputChangeReason,
  ) => {
    if (reason === 'clear') {
      props.onChange('')
    } else {
      props.onChange(value)
    }
  }

  return (
    <Autocomplete
      ref={inputRef}
      freeSolo
      selectOnFocus
      handleHomeEndKeys
      autoComplete
      autoHighlight
      renderInput={(params) => <TextField {...params} label={props.label} />}
      options={values}
      onChange={handleSelection}
      onInputChange={onInputChange}
      value={props.value}
    />
  )
}

export { TypeAheadChoicesWidget }
