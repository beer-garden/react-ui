import { FormArray } from 'components/FormComponents'
import { ParameterElement } from 'pages/CommandView/ParameterElements'
import { useFormContext } from 'react-hook-form'
import { Parameter } from 'types/backend-types'

interface ParamTextFieldProps {
  parameter: Parameter
  registerKey: string
}

const ParamArray = ({ parameter, registerKey }: ParamTextFieldProps) => {
  const { watch, setError, clearErrors, getFieldState } = useFormContext()

  // triggers rerender when adding or removing
  const currentValue = watch(registerKey)

  const {error} = getFieldState(registerKey)

  if(parameter.maximum && currentValue.length > parameter.maximum) {
    if(error?.type !== 'arrayLength') setError(registerKey, { type: 'arrayLength', message: `remove items max length is: ${parameter.maximum}` })
  } else if(parameter.minimum && currentValue.length < parameter.minimum) {
    if(error?.type !== 'arrayLength') setError(registerKey, { type: 'arrayLength', message: `add items min length is: ${parameter.minimum}` })
  } else if(error?.type === 'arrayLength') clearErrors(registerKey)

  const getFieldJsx = (index: number, registerKey: string,): JSX.Element => {
    return (
      <ParameterElement parameter={parameter} parentKey={registerKey} ignoreMulti={true} arrayIndex={index} />
    )
  }

  return (
    <FormArray
      registerKey={registerKey}
      getFieldJsx={getFieldJsx}
      maximum={parameter.maximum}
      minimum={parameter.minimum}
      label={parameter.display_name}
      helperText={parameter.description}
      addValue={parameter.nullable ? null : undefined}
    />
  )
}

export { ParamArray }
