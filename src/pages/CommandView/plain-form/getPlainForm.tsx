import { Box } from '@mui/material'
import {
  getJobSchema,
  getModel,
  getSchema,
  getUiSchema,
  getValidator,
} from 'formHelpers'
import { CommandViewForm } from 'pages/CommandView/plain-form/CommandViewForm'
import ReactJson from 'react-json-view'
import { AugmentedCommand, StrippedSystem } from 'types/custom-types'

const getPlainForm = (
  system: StrippedSystem,
  command: AugmentedCommand,
  isJob: boolean,
  debugEnabled = false,
) => {
  const instances = system.instances
  const parameters = command.parameters
  const schema = isJob
    ? getJobSchema(getSchema(instances, parameters))
    : getSchema(instances, parameters)
  const uiSchema = getUiSchema(instances)
  const model = getModel(parameters, instances, isJob)
  const validator = getValidator(parameters)

  return (
    <>
      <CommandViewForm
        schema={schema}
        uiSchema={uiSchema}
        initialModel={model}
        command={command}
        isJob={isJob}
        validator={validator}
      />
      {debugEnabled && (
        <Box pt={2} display="flex" alignItems="flex-start">
          <Box width={1 / 3}>
            <h3>Command</h3>
            <ReactJson src={command} />
          </Box>
          <Box width={1 / 3}>
            <h3>Schema</h3>
            <ReactJson src={schema} />
          </Box>
          <Box width={1 / 3}>
            <h3>UI Schema</h3>
            <ReactJson src={uiSchema} />
          </Box>
        </Box>
      )}
    </>
  )
}

export { getPlainForm }
