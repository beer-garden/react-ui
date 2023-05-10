import { Backdrop, CircularProgress, Stack } from '@mui/material'
import { AxiosError } from 'axios'
import Breadcrumbs from 'components/Breadcrumbs'
import { Divider } from 'components/Divider'
import { ErrorAlert } from 'components/ErrorAlert'
import { JobRequestCreationContext } from 'components/JobRequestCreation'
import { JsonCard } from 'components/JsonCard'
import { PageHeader } from 'components/PageHeader'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useMountedState } from 'hooks/useMountedState'
import { useSystems } from 'hooks/useSystems'
import { CommandForm } from 'pages/CommandView/CommandForm'
import {
  checkContext,
} from 'pages/CommandView/commandViewHelpers'
import { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Command, System } from 'types/backend-types'
import { AugmentedCommand, StrippedSystem } from 'types/custom-types'

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
    requestModel,
    setRequestModel,
  } = useContext(JobRequestCreationContext)

  // handle leaving the page for any reason
  useEffect(() => {
    return () => {
      setSystem && setSystem(undefined)
      setCommand && setCommand(undefined)
      setRequestModel && setRequestModel(undefined)
    }
  }, [setCommand, setRequestModel, setSystem])

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
          false,
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
        false,
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
    requestModel
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

  const breadcrumbs = [namespace, systemName, version, commandName].filter(
    (x) => !!x,
  ) as string[]
  const description = command.description || ''
  const title = commandName ?? ''

  return (
    <>
      <PageHeader title={title} description={description} />
      <Divider />
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <CommandForm system={theSystem} command={command} />
      {debugEnabled && (
        <Stack mt={1} direction={'row'} spacing={2}>
          <JsonCard title="Command" data={command} />
        </Stack>
      )}
    </>
  )
}

export { CommandView }