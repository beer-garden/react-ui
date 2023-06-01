import { useMountedState } from 'hooks/useMountedState'
import { createContext, ReactNode, useContext } from 'react'
import { Job, RequestTemplate } from 'types/backend-types'
import { AugmentedCommand, StrippedSystem } from 'types/custom-types'

interface JobRequestCreationProviderProps {
  children: ReactNode
}

export interface JobRequestCreationProviderState {
  system: StrippedSystem | undefined
  setSystem: ((arg0: StrippedSystem | undefined) => void) | undefined
  command: AugmentedCommand | undefined
  setCommand: ((arg0: AugmentedCommand | undefined) => void) | undefined
  job: Job | undefined
  setJob: ((arg0: Job | undefined) => void) | undefined
  requestModel: RequestTemplate | undefined
  setRequestModel:
    | ((arg0: RequestTemplate | undefined) => void)
    | undefined
}

export const emptyJobRequestCreationProviderState: JobRequestCreationProviderState =
  {
    system: undefined,
    setSystem: undefined,
    command: undefined,
    setCommand: undefined,
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
  const [requestModel, setRequestModel] = useMountedState<
    RequestTemplate | undefined
  >()

  const value: JobRequestCreationProviderState = {
    system,
    setSystem,
    command,
    setCommand,
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
