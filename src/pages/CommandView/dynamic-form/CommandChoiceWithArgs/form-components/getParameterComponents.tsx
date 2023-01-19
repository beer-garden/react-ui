import {
  Autocomplete,
  AutocompleteChangeReason,
  AutocompleteInputChangeReason,
  MenuItem,
  TextField,
} from '@mui/material'
import { AxiosError } from 'axios'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { ParameterAsProperty } from 'formHelpers'
import { useFormikContext } from 'formik'
import {
  DynamicChoicesStateManager,
  DynamicExecuteFunction,
  OnChangeFunctionMap,
} from 'pages/CommandView/dynamic-form'
import { ChangeEvent, SyntheticEvent, useMemo } from 'react'
import { ObjectWithStringKeys } from 'types/custom-types'

interface ParameterBasics {
  name: string
  type: string
  title: string
  description: string
  default: string
}

type DropDownParameterFieldProps = Omit<ParameterBasics, 'type'> & {
  values: string[]
  onChangeFunctions: OnChangeFunctionMap
  execute: DynamicExecuteFunction
  stateManager: DynamicChoicesStateManager
}

type DynamicChoiceParameterFieldProps = Omit<
  ParameterBasics,
  'type' | 'default'
> & {
  onChangeFunctions: OnChangeFunctionMap
  execute: DynamicExecuteFunction
  stateManager: DynamicChoicesStateManager
  isTypeAhead?: boolean
  selfRefers?: boolean
}

type ParameterEntry = ParameterBasics & {
  enum?: string[]
  isTypeAhead?: boolean
  selfRefers?: boolean
}

type ParameterMapper = (
  parameter: ParameterEntry,
  index: number,
) => JSX.Element | null

const getParameterComponents = (
  parameterSchema: ParameterAsProperty,
  onChangeFunctions: OnChangeFunctionMap,
  execute: DynamicExecuteFunction,
  stateManager: DynamicChoicesStateManager,
) => {
  const parameterEntries = Object.entries(parameterSchema).map(
    ([key, value]) => {
      return {
        name: key,
        ...value,
      }
    },
  ) as ParameterEntry[]

  const mapper = getParameterMapper(onChangeFunctions, execute, stateManager)
  const parameterComponents = parameterEntries.map(mapper)

  return parameterComponents
}

const getParameterMapper = (
  onChangeFunctions: OnChangeFunctionMap,
  execute: DynamicExecuteFunction,
  stateManager: DynamicChoicesStateManager,
): ParameterMapper => {
  // the following is necessary due to a limitation of eslint
  // eslint-disable-next-line react/display-name
  return (parameter: ParameterEntry, index: number) => {
    if ('enum' in parameter || parameter.isTypeAhead) {
      const {
        name,
        title,
        description,
        default: theDefault,
        enum: theEnum,
        isTypeAhead,
        selfRefers,
      } = parameter
      return !theEnum || theEnum.length <= 1 ? (
        <DynamicChoiceParameterField
          key={name + '-' + index}
          name={name}
          title={title}
          description={description}
          onChangeFunctions={onChangeFunctions}
          execute={execute}
          stateManager={stateManager}
          isTypeAhead={Boolean(isTypeAhead)}
          selfRefers={Boolean(selfRefers)}
        />
      ) : (
        <DropDownParameterField
          key={name + '-' + index}
          name={name}
          title={title}
          description={description}
          default={theDefault}
          values={theEnum as string[]}
          onChangeFunctions={onChangeFunctions}
          execute={execute}
          stateManager={stateManager}
        />
      )
    }

    return null
  }
}

const DropDownParameterField = ({
  name,
  title,
  description,
  default: theDefault,
  values,
  onChangeFunctions,
  execute,
  stateManager,
}: DropDownParameterFieldProps) => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const context = useFormikContext<Record<string, unknown>>()
  let onChange: (e: ChangeEvent<HTMLInputElement>) => void

  if (name in onChangeFunctions) {
    const onError = (e: AxiosError<Record<string, unknown>>) =>
      console.error(e.toJSON())
    const onChangeFromMap = onChangeFunctions[name](
      context,
      execute,
      onError,
      authEnabled,
    )
    onChange = onChangeFromMap
  } else {
    onChange = context.handleChange
  }

  return (
    <TextField
      variant="outlined"
      key={`${name}--${title}`}
      select
      name={name}
      label={title}
      value={stateManager.model.get().parameters[name]}
      error={Boolean(context.errors[name])}
      onChange={onChange}
      helperText={description}
      defaultValue={theDefault}
    >
      {values.map((v) => {
        return (
          <MenuItem key={`${name}-value-${v}`} value={v}>
            {v}
          </MenuItem>
        )
      })}
    </TextField>
  )
}

const DynamicChoiceParameterField = ({
  name,
  title,
  description,
  onChangeFunctions,
  execute,
  stateManager,
  isTypeAhead,
  selfRefers,
}: DynamicChoiceParameterFieldProps) => {
  const context = useFormikContext<Record<string, unknown>>()
  const { authEnabled } = ServerConfigContainer.useContainer()

  const onChange: (e: ChangeEvent<HTMLInputElement>) => void = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    if ('target' in event) {
      const target = event.target

      if ('value' in target && 'name' in target) {
        const { value, name } = target as EventTarget & {
          value: string
          name: string
        }

        context.setFieldValue('parameters', {
          ...(context.values.parameters as ObjectWithStringKeys),
          [name]: value,
        })

        stateManager.model.set((prev) => {
          return {
            ...prev,
            parameters: {
              ...prev.parameters,
              [name]: value,
            },
          }
        })
      }
    }
  }

  const isDisabled = useMemo(() => {
    const dynamicChoices = stateManager.choices.get()

    if (name in dynamicChoices) {
      return (
        dynamicChoices[name].enum.length === 1 &&
        dynamicChoices[name].enum[0] === ''
      )
    }

    return true
  }, [name, stateManager.choices])

  const values: string[] = useMemo(() => {
    const dynamicChoices = stateManager.choices.get()

    if (dynamicChoices && name in dynamicChoices) {
      return dynamicChoices[name].enum
    }
    return ['']
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, stateManager.choices])

  if (isTypeAhead) {
    const update = (newValue: string) => {
      stateManager.model.set((prev) => {
        return {
          ...prev,
          parameters: {
            ...prev.parameters,
            [name]: newValue,
          },
        }
      })
    }

    let handleSelection = null

    if (!selfRefers) {
      handleSelection = (
        event: SyntheticEvent<Element, Event>,
        value: string | null,
        reason: AutocompleteChangeReason,
      ) => {
        if (reason === 'selectOption') {
          update(value ?? '')
        } else {
          update('')
        }
      }
    } else {
      handleSelection = (
        event: SyntheticEvent<Element, Event>,
        value: unknown,
        reason: AutocompleteChangeReason,
      ) => {
        let theValue = ''
        if (value !== null) theValue = value as string

        if (name in onChangeFunctions) {
          const onChangeFromMap = onChangeFunctions[name](
            context,
            execute,
            (e: AxiosError<Record<string, unknown>>) =>
              console.error(e.toJSON()),
            authEnabled,
          )
          if (reason === 'selectOption') {
            onChangeFromMap({
              target: { value: theValue, name: name, selfRefers: true },
            } as unknown as ChangeEvent)
            update(theValue)
          } else {
            onChangeFromMap({
              target: { value: '', name: name },
            } as unknown as ChangeEvent)
            update('')
          }
        }
      }
    }

    let onInputChange = null

    if (!selfRefers) {
      onInputChange = (
        event: SyntheticEvent<Element, Event>,
        value: string,
        reason: AutocompleteInputChangeReason,
      ) => {
        if (reason === 'clear') {
          update('')
        } else {
          update(value)
        }
      }
    } else {
      onInputChange = (
        event: SyntheticEvent<Element, Event>,
        value: string,
        reason: AutocompleteInputChangeReason,
      ) => {
        if (name in onChangeFunctions) {
          let theValue = ''
          if (value !== null) theValue = value as string
          const onChangeFromMap = onChangeFunctions[name](
            context,
            execute,
            (e: AxiosError<Record<string, unknown>>) =>
              console.error(e.toJSON()),
            authEnabled,
          )

          onChangeFromMap({
            target: { value: theValue, name: name, selfRefers: true },
          } as unknown as ChangeEvent)
        }
      }
    }

    return (
      <Autocomplete
        id={name + '-autocomplete'}
        freeSolo
        selectOnFocus
        handleHomeEndKeys
        autoComplete
        autoHighlight
        disabled={isDisabled}
        renderInput={(params) => <TextField {...params} label={title} />}
        renderOption={(props, option) => (
          <li {...props} key={option}>
            {option}
          </li>
        )}
        options={values}
        onChange={handleSelection}
        onInputChange={onInputChange}
        filterOptions={(x) => x}
      />
    )
  }

  return (
    <TextField
      variant="outlined"
      key={`${name}--${title}`}
      select
      disabled={isDisabled}
      name={name}
      label={title}
      value={stateManager.model.get().parameters[name]}
      error={Boolean(context.errors[name])}
      onChange={onChange}
      helperText={description}
    >
      {values &&
        values.map((v) => {
          return (
            <MenuItem key={`${name}-value-${v || 'dummy'}`} value={v}>
              {v}
            </MenuItem>
          )
        })}
    </TextField>
  )
}

export { getParameterComponents }
