import { Box } from '@mui/material'
import Breadcrumbs from 'components/Breadcrumbs'
import { Divider } from 'components/Divider'
import { PageHeader } from 'components/PageHeader'
import { CommandBasicSchema, getSchema } from 'formHelpers'
import {
  CommandChoiceWithArgsForm,
  hasCommandChoiceWithArgs,
} from 'pages/CommandView/dynamic-form'
import ReactJson from 'react-json-view'
import { useParams } from 'react-router-dom'
import { AugmentedCommand, StrippedSystem } from 'types/custom-types'

interface DynamicFormProps {
  system: StrippedSystem
  command: AugmentedCommand
  isJob: boolean
  debugEnabled?: boolean
}

const DynamicForm = ({
  system,
  command,
  isJob,
  debugEnabled = false,
}: DynamicFormProps) => {
  const { namespace, systemName, version, commandName } = useParams()

  let form = null
  const schema: CommandBasicSchema = getSchema(
    system.instances,
    command.parameters,
  )

  if (hasCommandChoiceWithArgs(command)) {
    form = CommandChoiceWithArgsForm(system, command, isJob)
  }

  const breadcrumbs = [namespace, systemName, version, commandName].filter(
    (x) => !!x,
  ) as string[]
  const description = command.description || ''
  const title = commandName ?? ''

  return (
    <Box>
      <PageHeader title={title} description={description} />
      <Divider />
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      {form}
      {debugEnabled && (
        <Box pt={2} display="flex" alignItems="flex-start">
          <Box width={1 / 2}>
            <h3>Command</h3>
            <ReactJson src={command} />
          </Box>
          {schema ? (
            <Box width={1 / 2}>
              <h3>Schema</h3>
              <ReactJson src={schema} />
            </Box>
          ) : null}
        </Box>
      )}
    </Box>
  )
}

export { DynamicForm }
