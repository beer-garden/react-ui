import { Backdrop, Box, CircularProgress,Stack } from '@mui/material'
import { AxiosError } from 'axios'
import Breadcrumbs from 'components/Breadcrumbs'
import { Divider } from 'components/Divider'
import { ErrorAlert } from 'components/ErrorAlert'
import { JobRequestCreationContext } from 'components/JobRequestCreation'
import { JsonCard } from 'components/JsonCard'
import { PageHeader } from 'components/PageHeader'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import {
  getContext,
  getJobSchema,
  getModel,
  getSchema,
  getUiSchema,
  getValidator,
} from 'formHelpers'
import { useMountedState } from 'hooks/useMountedState'
import { useSystems } from 'hooks/useSystems'
import {
  checkContext,
  commandIsDynamic,
  fixReplayAny,
} from 'pages/CommandView/commandViewHelpers'
import { DynamicForm } from 'pages/CommandView/dynamic-form'
import { CommandViewForm } from 'pages/CommandView/plain-form'
import { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Command, System } from 'types/backend-types'
import { AugmentedCommand, StrippedSystem } from 'types/custom-types'
import { CommandViewModel } from 'types/form-model-types'

const CommandView = () => {
  const { debugEnabled } = ServerConfigContainer.useContainer()
  const { namespace, systemName, version, commandName } = useParams()
  const [ checkedParams, setCheckedParams ] = useMountedState<JSX.Element>()
  const [ paramsHistory, setParamsHistory ] = useMountedState({namespace: namespace, systemName: systemName, version: version, commandName: commandName })
  const [error, setError] = useMountedState<AxiosError | undefined>()
  const { getSystems } = useSystems()
  const {
    system,
    setSystem,
    command,
    setCommand,
    isJob,
    requestModel,
    setRequestModel,
    isReplay,
    setIsReplay,
    job,
    setJob,
  } = useContext(JobRequestCreationContext)

  // handle leaving the page for any reason
  useEffect(() => {
    return () => {
      setSystem && setSystem(undefined)
      setCommand && setCommand(undefined)
      setRequestModel && setRequestModel(undefined)
      setIsReplay && setIsReplay(false)
      setJob && setJob(undefined)
    }
  }, [setCommand, setIsReplay, setRequestModel, setSystem, setJob])

  useEffect(() => {
    if(paramsHistory.namespace !== namespace || paramsHistory.systemName !== systemName || paramsHistory.version !== version || paramsHistory.commandName !== commandName) {
      setSystem && setSystem(undefined)
      setCommand && setCommand(undefined)
      setCheckedParams(undefined)
      setParamsHistory({namespace: namespace, systemName: systemName, version: version, commandName: commandName })
    }
    else if(!system) {
      setError(undefined)
      getSystems()
      .then((response) => {
        const tempSystem = response.data.find((sys: System) => 
          (sys.name === systemName && sys.namespace === namespace && sys.version === version)
        )
        setSystem && setSystem(tempSystem as StrippedSystem)
        let tempCommand: Command | undefined = undefined
        if (tempSystem && !command) {
          tempCommand = tempSystem.commands.find((cmd: Command) => (cmd.name===commandName))
          setCommand && setCommand(tempCommand as AugmentedCommand | undefined)
        }
        setCheckedParams(checkContext(
          namespace,
          systemName,
          version,
          commandName,
          tempSystem as StrippedSystem | undefined,
          tempCommand as AugmentedCommand | undefined,
          isReplay,
          requestModel,
        ))
      })
      .catch((e) => {
        setError(e)
      })
    } else {
      setCheckedParams(checkContext(
        namespace,
        systemName,
        version,
        commandName,
        system,
        command,
        isReplay,
        requestModel,
      ))
    }
  }, [
    getSystems,
    setSystem,
    setCommand,
    setCheckedParams,
    setParamsHistory,
    setError,
    paramsHistory,
    commandName,
    systemName,
    namespace,
    version,
    system,
    command,
    isReplay,
    requestModel,
  ]) 

  if (checkedParams) return checkedParams


  if (!system || !command || error) {
    return (
      error?.response ? (
        <ErrorAlert
          statusCode={error.response.status}
          errorMsg={error.response.statusText}
        />
      ) : (
        <Backdrop open={true}>
          <CircularProgress color="inherit" aria-label="System data loading" />
        </Backdrop>
      )
    )
  }

  const theSystem = system as StrippedSystem
  const theCommand = command as AugmentedCommand

  if (commandIsDynamic(theCommand)) {
    return (
      <DynamicForm
        system={theSystem}
        command={theCommand}
        isJob={isJob}
        debugEnabled={debugEnabled}
      />
    )
  }

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
  const uiSchema = getUiSchema(instances, theCommand)
  const validator = getValidator(parameters)
  const context = getContext(parameters)

  let model: CommandViewModel

  if (isReplay && requestModel) {
    model = fixReplayAny(requestModel, parameters)
  } else {
    model = getModel(parameters, theSystem.instances, isJob)
  }

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
          isReplay={Boolean(isReplay)}
          jobId={job?.id ?? undefined}
          validator={validator}
          context={context}
        />
      </Box>
      {debugEnabled && (
        <Stack direction={'row'} spacing={2}>
          <JsonCard title="Command" data={theCommand} />
          <JsonCard title="Schema" data={schema} />
          <JsonCard title="UI Schema" data={uiSchema} />
        </Stack>
      )}
    </Box>
  )
}

export { CommandView }
