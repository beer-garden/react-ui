import { Backdrop, CircularProgress } from '@mui/material'
import { AxiosError } from 'axios'
import Breadcrumbs from 'components/Breadcrumbs'
import { Divider } from 'components/Divider'
import { ErrorAlert } from 'components/ErrorAlert'
import { JobRequestCreationContext } from 'components/JobRequestCreation'
import { PageHeader } from 'components/PageHeader'
import { useJobs } from 'hooks/useJobs'
import { useMountedState } from 'hooks/useMountedState'
import { useSystems } from 'hooks/useSystems'
import { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Command, System } from 'types/backend-types'
import { AugmentedCommand, StrippedSystem } from 'types/custom-types'

import { CommandJobForm } from './CommandJobForm'

const CommandView = ({isJob} : {isJob?: boolean}) => {
  let { namespace, systemName, version, commandName } = useParams()
  const { jobId } = useParams()
  const [error, setError] = useMountedState<AxiosError | undefined>()
  const { getJob } = useJobs()
  const { getSystems } = useSystems()

  const {
    system,
    setSystem,
    command,
    setCommand,
    setRequestModel,
    job,
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if(jobId && job && jobId === job.id) {
    commandName = job.request_template.command
    systemName = job.request_template.system
    version = job.request_template.system_version
    namespace = job.request_template.namespace
  }

  useEffect(() => {
    if(jobId && (!job || jobId !== job.id)) {
      getJob(jobId)
        .then((response) => {
          setError(undefined)
          setJob && setJob(response.data)
        })
        .catch((e) => {
          setError(e)
        })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, job])

  useEffect(() => {
    if(system && (system.namespace !== namespace || system.name !== systemName || system.version !== version)){
      setSystem && setSystem(undefined)
      setCommand && setCommand(undefined)
    } else if(command && command.name !== commandName) {
      setCommand && setCommand(undefined)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commandName, namespace, systemName, version, system])

  useEffect(() => {
    if(!system && systemName && namespace && version) {
      setError(undefined)
      getSystems()
      .then((response) => {
        const tempSystem = response.data.find((sys: System) => 
          (sys.name === systemName && sys.namespace === namespace && sys.version === version)
        )
        setSystem && setSystem(tempSystem as StrippedSystem)
      })
      .catch((e) => {
        setError(e)
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namespace, systemName, version, system])
  
  useEffect(() => {
    const getCommandFromSystem = (sys: System) => {
      let tempCommand: Command | undefined = undefined
      tempCommand = sys.commands.find((cmd: Command) => (cmd.name===commandName))
      setCommand && setCommand(tempCommand as AugmentedCommand | undefined)
    }
    if(system && Object.hasOwn(system, 'commands') && !command) getCommandFromSystem(system as System)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commandName, system, command])
  

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
