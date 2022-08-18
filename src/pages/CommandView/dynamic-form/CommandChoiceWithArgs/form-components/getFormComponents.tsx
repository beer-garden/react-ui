import { Stack } from '@mui/system'
import { InstanceNameSchema, ParameterAsProperty } from 'formHelpers'
import {
  DynamicChoicesStateManager,
  DynamicExecuteFunction,
  OnChangeFunctionMap,
} from 'pages/CommandView/dynamic-form'
import {
  CommentField,
  getParameterComponents,
} from 'pages/CommandView/dynamic-form/CommandChoiceWithArgs/form-components'

import { InstanceField } from './InstanceField'

const getFormComponents = (
  parameterSchema: ParameterAsProperty,
  instanceSchema: InstanceNameSchema,
  onChangeFunctions: OnChangeFunctionMap,
  execute: DynamicExecuteFunction,
  stateManager: DynamicChoicesStateManager,
) => {
  return (
    <Stack spacing={2}>
      <CommentField stateManager={stateManager} />
      <InstanceField
        instanceSchema={instanceSchema}
        onChangeFunctionMap={onChangeFunctions}
        execute={execute}
        stateManager={stateManager}
      />
      {getParameterComponents(
        parameterSchema,
        onChangeFunctions,
        execute,
        stateManager,
      ).map((c) => c)}
    </Stack>
  )
}

export { getFormComponents }
