import { Alert, Autocomplete, MenuItem } from '@mui/material'
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import useAxios from 'axios-hooks'
import { defaultTextFieldProps, FormAnyOrDict, FormFile, FormFileProps, FormTextField, FormTextFieldProps } from 'components/FormComponents'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { SocketContainer } from 'containers/SocketContainer'
import { useDebounceEmptyFunction } from 'hooks/useDebounce'
import { useMountedState } from 'hooks/useMountedState'
import { useMyAxios } from 'hooks/useMyAxios'
import { useCallback, useEffect, useMemo } from 'react'
import { RegisterOptions, useFormContext } from 'react-hook-form'
import { 
  DynamicChoiceCommandDetails,
  DynamicChoiceDictionaryDetails,
  DynamicChoiceUrlDetails,
  Parameter,
  Request,
  RequestTemplate
} from 'types/backend-types'


interface ParamTextFieldProps {
  parameter: Parameter
  registerKey: string
}

const ParamTextField = ({ parameter, registerKey }: ParamTextFieldProps) => {
  const { getValues, setValue, watch, getFieldState, setError } = useFormContext()
  const registerKeyPrefix = registerKey.split('parameters.')[0]
  let type = 'string'
  switch(parameter.type) { 
    case 'Float':
    case 'Integer': {
      type = 'number'
      break
    }
    case 'Dictionary': {
      type = 'object'
      break
    }
    case 'DateTime':
      type = 'datetime-local'
      break
    case 'Bytes':
    case 'Base64':
      type = 'file'
      break
    default: {
      type = parameter.type.toLowerCase()
      break
    }
  }
  const { authEnabled } = ServerConfigContainer.useContainer()
  const { axiosManualOptions } = useMyAxios()
  const [, execute] = useAxios({}, axiosManualOptions)
  const [choiceValues, setChoiceValues] = useMountedState<(string | number)[]>(
    parameter.choices?.type === 'static' && !Object.hasOwn(parameter.choices?.details, 'key_reference')
    ? parameter.choices.value as (string | number)[] : []
  )
  const registerOptions: RegisterOptions = {
    required: parameter.optional ? false : `${parameter.display_name} is required`,
  }
  const [requestId, setRequestId] = useMountedState<string>()
  const [isLoading, setIsLoading] = useMountedState(false)
  const { addCallback, removeCallback } = SocketContainer.useContainer()
  const {error} = getFieldState(registerKey)
  const formTextFieldProps: FormTextFieldProps = {
    registerKey: registerKey,
    type: type,
  }
  formTextFieldProps.inputProps = {key: parameter.key}

  if(parameter.regex) {
    registerOptions.pattern = new RegExp(parameter.regex)
  }

  const watchKeys = useMemo((): string[] => {
    if(parameter.choices){
      const tempWatchKey: string[] = []
      if(parameter.choices.type === 'command' || parameter.choices?.type === 'url'){
        (parameter.choices.details as DynamicChoiceCommandDetails).args.forEach((arg) => 
          tempWatchKey.push(`${registerKeyPrefix}parameters.${arg[1]}`)
        )
      }
      if(parameter.choices.type === 'static' && Object.hasOwn(parameter.choices.details, 'key_reference')){
        tempWatchKey.push(`${registerKeyPrefix}parameters.${(parameter.choices.details as DynamicChoiceDictionaryDetails).key_reference}`)
      }
      return tempWatchKey
    }
    return []
  }, [parameter, registerKeyPrefix])

  const makeRequest = useCallback(() => {
    if(parameter.choices?.type === 'command'){
      setIsLoading(true)
      const choicesParameters: {[key: string]: unknown} = {}
      const choicesDetails = parameter.choices.details as DynamicChoiceCommandDetails
      choicesDetails.args.forEach((arg) => {
        const name = watchKeys.find((name) => {
          return name.split('.').includes(arg[1])
        })
        let value: string | undefined
        if(name) value = getValues(name)
        choicesParameters[arg[0]] = value
      })
      if(getValues(`${registerKeyPrefix}instance_name`) === '' || Object.values(choicesParameters).includes(undefined)) {
        setChoiceValues([])
        setIsLoading(false)
        return
      }
      const choicesRequest: RequestTemplate = {
        command: choicesDetails.name,
        instance_name: getValues(`${registerKeyPrefix}instance_name`),
        namespace: getValues(`${registerKeyPrefix}namespace`),
        parameters: choicesParameters,
        system: getValues(`${registerKeyPrefix}system`),
        system_version: getValues(`${registerKeyPrefix}system_version`)
      }

      const config: AxiosRequestConfig<RequestTemplate> = {
        url: '/api/v1/requests',
        method: 'post',
        data: choicesRequest,
        withCredentials: authEnabled,
      }

      execute(config)
        .then((response: AxiosResponse<Request>) => {
          setRequestId(response.data.id)
        })
        .catch((error: AxiosError) => {
          // todo add error handling
        })
    }
    if(parameter.choices?.type === 'url'){
      const choicesDetails = parameter.choices.details as DynamicChoiceUrlDetails
      const config: AxiosRequestConfig = {
        url: choicesDetails.address,
        method: 'get',
      }

      execute(config)
        .then((response: AxiosResponse) => {
          setChoiceValues(response.data)
        })
        .catch((error: AxiosError) => {
          // todo add error handling
        })
    }
  }, [
    authEnabled,
    execute,
    getValues,
    parameter,
    registerKeyPrefix,
    setChoiceValues,
    setIsLoading,
    setRequestId,
    watchKeys
  ])

  const makeRequestDebounce = useDebounceEmptyFunction(makeRequest, 500)
  
  useEffect(() => {
    if(parameter.choices){
      if(parameter.choices.type === 'command') {
        if(!isLoading && !requestId) makeRequest()
        addCallback('request_completed', (event: {name: string, payload: Request}) => {
          if ('REQUEST_COMPLETED' === event.name && event.payload.id === requestId) {
            let value:(string | number)[] | undefined
            if(event.payload.output) value = JSON.parse(event.payload.output)
            if(value) {
              setChoiceValues(value)
            }
            setIsLoading(false)
          }
        })
      }
      if(parameter.choices.type === 'url') makeRequest()
      if(parameter.choices && Object.hasOwn(parameter.choices.details, 'key_reference')){
        const keyReference = getValues(watchKeys[0])
        const valueDict = parameter.choices.value as {[key: string|number]: Array<string | number>}
        if(!keyReference) {
          setChoiceValues([])
        }
        setChoiceValues(valueDict[keyReference] as (string | number)[] || [])
      }
      if(parameter.choices.type === 'command' || Object.hasOwn(parameter.choices.details, 'key_reference')){
        const subscription = watch((value, { name, type }) => {
          
          if(name === undefined && type === undefined) setChoiceValues([])
          else if(name && (watchKeys.includes(name) || name === `${registerKeyPrefix}instance_name`)){
            if(parameter.choices?.type === 'command' || parameter.choices?.type === 'url'){
              if(type === 'change') makeRequestDebounce()
              else makeRequest()
            }
            if(parameter.choices && Object.hasOwn(parameter.choices.details, 'key_reference')){
              const keyReference = getValues(name)
              const valueDict = parameter.choices.value as {[key: string|number]: Array<string | number>}
              if(!keyReference) {
                setChoiceValues([])
              }
              setChoiceValues(valueDict[keyReference] as (string | number)[] || [])
            }
          }
        })
        return () => {
          subscription.unsubscribe()
          removeCallback('request_completed')
        }
      }
    }
  }, [
    watch,
    makeRequest,
    setChoiceValues,
    getValues,
    parameter,
    addCallback,
    requestId,
    removeCallback,
    setIsLoading,
    setRequestId,
    isLoading,
    watchKeys,
    makeRequestDebounce,
    registerKey,
    setError,
    registerKeyPrefix
  ])

  if(parameter.type === 'Base64'){
    return(
      <Alert severity="warning" >
        Parameter type Base64 is not supported in the UI
      </Alert>
    )
  }

  if(type==='number'){
    registerOptions.valueAsNumber = true
    if(parameter.type === 'Float') formTextFieldProps.inputProps.step = 'any'
    if(!parameter.multi){
      if(parameter.maximum) {
        registerOptions.max = {value: parameter.maximum, message: `Maximum ${parameter.display_name} number is ${parameter.minimum}`}
      }
      if(parameter.minimum) {
        registerOptions.min = {value: parameter.minimum, message: `Minimum ${parameter.display_name} number is ${parameter.minimum}`}
      }
    }
  } else if(parameter.type === 'Date' || parameter.type === 'DateTime') {
    registerOptions.setValueAs = value => {
      return value === '' ? (parameter.nullable ? null : undefined) : new Date(value).getTime()
    }
  }
  if(parameter.type === 'String' && !parameter.multi){
    if(parameter.maximum) {
      registerOptions.maxLength = {value: parameter.maximum, message: `Maximum ${parameter.display_name} length is ${parameter.minimum} characters`}
    }
    if(parameter.minimum) {
      registerOptions.minLength = {value: parameter.minimum, message: `Minimum ${parameter.display_name} length is ${parameter.minimum} characters`}
    }
  }


  if(!parameter.multi){
    formTextFieldProps.label = parameter.display_name
    if(parameter.description) formTextFieldProps.helperText = parameter.description
  } else formTextFieldProps.label = `Index: ${registerKey.split('.')[registerKey.split('.').length-1]}`

  if(error) formTextFieldProps.helperText = error.message

  if(parameter.type === 'Dictionary') {
    formTextFieldProps.maxRows=3
    formTextFieldProps.multiline=true
  }

  if(parameter.choices) {
    if(parameter.choices.display === 'select') {
      formTextFieldProps.select = true
      formTextFieldProps.defaultValue = getValues(registerKey) || ''
    }
    registerOptions.validate = (value) => {
      return choiceValues.includes(value)
    }
  }

  if(type === 'file'){
    if(!parameter.optional && getValues(registerKey) !== undefined)
      registerOptions.required = false
      formTextFieldProps.registerKey = registerKey.replace('parameters', 'multipart')
    return (
      <FormFile {...formTextFieldProps as FormFileProps} registerOptions={registerOptions} />
    )
  }

  if(!parameter.choices && (parameter.type === 'Any' || parameter.type === 'Dictionary')){
    const currentValue = getValues(registerKey)
    if(!parameter.optional)
      if((currentValue === '' && parameter.type === 'Any') || (parameter.nullable && currentValue === null))
        registerOptions.required = false
    return (
      <FormAnyOrDict {...formTextFieldProps as FormFileProps} registerOptions={registerOptions} />
    )
  } else registerOptions.setValueAs = value => {
    return value === '' && type !== 'any' ? (parameter.nullable ? null : undefined) : value
  }

  if(parameter.choices?.display === 'typeahead') {
    if(formTextFieldProps.inputProps) delete formTextFieldProps.inputProps
    if(getValues(registerKey) === undefined) setValue(registerKey, '')
    return (<Autocomplete
      freeSolo
      selectOnFocus
      handleHomeEndKeys
      autoComplete
      autoHighlight
      fullWidth
      value={getValues(registerKey)}
      renderInput={(params) => (
        <FormTextField
          {...params}
          {...defaultTextFieldProps}
          {...formTextFieldProps}
          registerOptions={registerOptions}
        />
      )}
      options={
        choiceValues
      }
      renderOption={(props, option) =>
        (<MenuItem 
          {...props} onClick={(event)=>{
            if(props.onClick) props.onClick(event)
            setValue(registerKey, option)}
          }
          key={option}>
          {option}
         </MenuItem>)
      }
    />)
  }

  if(parameter.choices?.display === 'select') formTextFieldProps.menuOptions = choiceValues

  return (
    <FormTextField
      {...formTextFieldProps}
      registerOptions={registerOptions}
    />
  )
}

export { ParamTextField }
