import { Box } from '@mui/material'
import Breadcrumbs from 'components/Breadcrumbs'
import { Divider } from 'components/Divider'
import { JobRequestCreationContext } from 'components/JobRequestCreation'
import PageHeader from 'components/PageHeader'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { CommandViewForm } from 'pages/CommandView/CommandViewForm'
import { checkContext } from 'pages/CommandView/commandViewHelpers'
import {
  getJobSchema,
  getModel,
  getSchema,
  getUiSchema,
  getValidator,
} from 'pages/CommandView/form-data'
import { useContext } from 'react'
import ReactJson from 'react-json-view'
import { useParams } from 'react-router-dom'
import { AugmentedCommand, StrippedSystem } from 'types/custom-types'

const CommandView = () => {
  const { debugEnabled } = ServerConfigContainer.useContainer()
  const { namespace, systemName, version, commandName } = useParams()
  const context = useContext(JobRequestCreationContext)
  const { system, command, isJob } = context

  const checkedParams = checkContext(
    namespace,
    systemName,
    version,
    commandName,
    system,
    command,
  )

  if (checkedParams) return checkedParams

  // we know that neither of these are undefined because of the call to
  // 'checkedParams'
  const theSystem = system as StrippedSystem
  const theCommand = command as AugmentedCommand

  const breadcrumbs = [namespace, systemName, version, commandName].filter(
    (x) => !!x,
  ) as string[]
  const description = theCommand.description || ''
  const title = commandName ?? ''
  const instances = theSystem.instances
  const parameters = theCommand.parameters
  const schema = isJob
    ? getJobSchema(getSchema(instances, parameters))
    : getSchema(instances, parameters)
  const uiSchema = getUiSchema(instances, parameters)
  const model = getModel(parameters)
  const validator = getValidator(parameters)

  return (
    <Box>
      <PageHeader title={title} description={description} />
      <Divider />
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Box>
        <CommandViewForm
          schema={schema}
          uiSchema={uiSchema}
          initialModel={model}
          command={theCommand}
          isJob={isJob}
          validator={validator}
        />
      </Box>
      {debugEnabled && (
        <Box pt={2} display="flex" alignItems="flex-start">
          <Box width={1 / 3}>
            <h3>Command</h3>
            <ReactJson src={theCommand} />
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
    </Box>
  )
}

export { CommandView }
