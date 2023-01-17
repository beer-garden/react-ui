import { MenuItem, TextField } from '@mui/material'
import { AxiosError } from 'axios'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { InstanceNameSchema } from 'formHelpers'
import { useFormikContext } from 'formik'
import {
  DynamicChoicesStateManager,
  DynamicExecuteFunction,
  OnChangeFunctionMap,
} from 'pages/CommandView/dynamic-form'
import { ChangeEvent, useMemo } from 'react'

interface InstanceFieldProps {
  instanceSchema: InstanceNameSchema
  onChangeFunctionMap: OnChangeFunctionMap
  execute: DynamicExecuteFunction
  stateManager: DynamicChoicesStateManager
}

const InstanceField = ({
  instanceSchema,
  onChangeFunctionMap,
  execute,
  stateManager,
}: InstanceFieldProps) => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const context = useFormikContext<Record<string, unknown>>()
  let onChange: (e: ChangeEvent<HTMLInputElement>) => void
  let instanceNames: string[]
  let disabled = false

  const theValue = useMemo(
    () => stateManager.model.get().instance_name || '',
    [stateManager.model],
  )

  if ('default' in instanceSchema) {
    instanceNames = [instanceSchema.default]
    disabled = true
  } else {
    instanceNames = instanceSchema.enum
  }

  if ('instance_name' in onChangeFunctionMap) {
    const onError = (e: AxiosError<Record<string, unknown>>) =>
      console.error(e.toJSON())
    onChange = onChangeFunctionMap.instance_name(
      context,
      execute,
      onError,
      authEnabled,
    )
  } else {
    onChange = context.handleChange
  }

  return (
    <TextField
      variant="outlined"
      select
      disabled={disabled}
      name="instance_name"
      label="Instance Name"
      value={theValue}
      error={Boolean(context.errors.instance_name)}
      onChange={onChange}
    >
      {instanceNames.map((i) => {
        return (
          <MenuItem key={`instance-name-value-${i}`} value={i}>
            {i}
          </MenuItem>
        )
      })}
    </TextField>
  )
}

export { InstanceField }
