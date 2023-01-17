import { Box, Stack } from '@mui/material'
import Breadcrumbs from 'components/Breadcrumbs'
import { Divider } from 'components/Divider'
import { JsonCard } from 'components/JsonCard'
import { PageHeader } from 'components/PageHeader'
import { CommandBasicSchema, getSchema } from 'formHelpers'
import {
  CommandChoiceWithArgsForm,
  hasCommandChoiceWithArgs,
  hasSimpleCommandChoice,
} from 'pages/CommandView/dynamic-form'
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

  if (hasCommandChoiceWithArgs(command) || hasSimpleCommandChoice(command)) {
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
        <Stack direction={'row'} spacing={2}>
          <JsonCard title="Command" data={command} />
          {schema ? <JsonCard title="Schema" data={schema} /> : null}
        </Stack>
      )}
    </Box>
  )
}

export { DynamicForm }
