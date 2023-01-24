import { useMountedState } from 'hooks/useMountedState'
import { createContext, ReactNode, useContext } from 'react'
import { Job } from 'types/backend-types'
import { AugmentedCommand, StrippedSystem } from 'types/custom-types'
import { CommandViewRequestModel } from 'types/form-model-types'

interface JobRequestCreationProviderProps {
  children: ReactNode
}

export interface JobRequestCreationProviderState {
  system: StrippedSystem | undefined
  setSystem: ((arg0: StrippedSystem | undefined) => void) | undefined
  command: AugmentedCommand | undefined
  setCommand: ((arg0: AugmentedCommand | undefined) => void) | undefined
  isJob: boolean
  setIsJob: ((arg0: boolean) => void) | undefined
  isReplay: boolean
  setIsReplay: ((arg0: boolean) => void) | undefined
  job: Job | undefined
  setJob: ((arg0: Job | undefined) => void) | undefined
  requestModel: CommandViewRequestModel | undefined
  setRequestModel:
    | ((arg0: CommandViewRequestModel | undefined) => void)
    | undefined
}

export const emptyJobRequestCreationProviderState: JobRequestCreationProviderState =
  {
    system: undefined,
    setSystem: undefined,
    command: undefined,
    setCommand: undefined,
    isJob: false,
    setIsJob: undefined,
    isReplay: false,
    setIsReplay: undefined,
    job: undefined,
    setJob: undefined,
    requestModel: undefined,
    setRequestModel: undefined,
  }

const JobRequestCreationContext =
  createContext<JobRequestCreationProviderState>(
    emptyJobRequestCreationProviderState,
  )

const JobRequestCreationProvider = ({
  children,
}: JobRequestCreationProviderProps) => {
  const [system, setSystem] = useMountedState<StrippedSystem | undefined>()
  const [job, setJob] = useMountedState<Job | undefined>()
  const [command, setCommand] = useMountedState<AugmentedCommand | undefined>()
  const [isJob, setIsJob] = useMountedState(false)
  const [isReplay, setIsReplay] = useMountedState(false)
  const [requestModel, setRequestModel] = useMountedState<
    CommandViewRequestModel | undefined
  >()

  const value: JobRequestCreationProviderState = {
    system,
    setSystem,
    command,
    setCommand,
    isJob,
    setIsJob,
    isReplay,
    setIsReplay,
    job,
    setJob,
    requestModel,
    setRequestModel,
  }
  return (
    <JobRequestCreationContext.Provider value={value}>
      {children}
    </JobRequestCreationContext.Provider>
  )
}

const useJobRequestCreation = () => {
  const context = useContext(JobRequestCreationContext)
  if (context === undefined) {
    throw new Error(
      'useJobRequestCreation requires a JobRequestCreationProvider',
    )
  }

  return context
}

export {
  JobRequestCreationContext,
  JobRequestCreationProvider,
  useJobRequestCreation,
}
