import { Backdrop, CircularProgress } from '@mui/material'
import { AxiosError } from 'axios'
import Breadcrumbs from 'components/Breadcrumbs'
import { Divider } from 'components/Divider'
import { ErrorAlert } from 'components/ErrorAlert'
import { JobRequestCreationContext } from 'components/JobRequestCreation'
import { PageHeader } from 'components/PageHeader'
import { useMountedState } from 'hooks/useMountedState'
import { useSystems } from 'hooks/useSystems'
import { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Command, System } from 'types/backend-types'
import { AugmentedCommand, StrippedSystem } from 'types/custom-types'

import { CommandJobForm } from './CommandJobForm'

const CommandView = ({isJob} : {isJob?: boolean}) => {
  const { namespace, systemName, version, commandName } = useParams()
  const [ paramsHistory, setParamsHistory ] = useMountedState({namespace: namespace, systemName: systemName, version: version, commandName: commandName })
  const [error, setError] = useMountedState<AxiosError | undefined>()
  const { getSystems } = useSystems()

  const {
    system,
    setSystem,
    command,
    setCommand,
    setRequestModel,
    setJob
  } = useContext(JobRequestCreationContext)

  // handle leaving the page for any reason
  useEffect(() => {
    return () => {
      setSystem && setSystem(undefined)
      setCommand && setCommand(undefined)
      setRequestModel && setRequestModel(undefined)
      setJob && setJob(undefined)
    }
  }, [setCommand, setRequestModel, setSystem, setJob])

  useEffect(() => {
    if(paramsHistory.namespace !== namespace || paramsHistory.systemName !== systemName || paramsHistory.version !== version || paramsHistory.commandName !== commandName) {
      setSystem && setSystem(undefined)
      setCommand && setCommand(undefined)
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
      })
      .catch((e) => {
        setError(e)
      })
    }
  }, [
    getSystems,
    setSystem,
    setCommand,
    setParamsHistory,
    setError,
    paramsHistory,
    commandName,
    systemName,
    namespace,
    version,
    system,
    command,
  ])

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

  const breadcrumbs = [namespace, systemName, version, commandName].filter(
    (x) => !!x,
  ) as string[]
  const description = command.description || ''
  const title = command.name

  return (
    <>
      <PageHeader title={title} description={description} />
      <Divider />
      { !isJob && <Breadcrumbs breadcrumbs={breadcrumbs} />}
      <CommandJobForm system={system} command={command} isJob={isJob} />
    </>
  )
}

export { CommandView }
