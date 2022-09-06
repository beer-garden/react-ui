import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react'
import { AugmentedCommand, StrippedSystem } from 'types/custom-types'

interface JobRequestCreationProviderProps {
  children: ReactNode
}

interface JobRequestCreationProviderState {
  system: StrippedSystem | undefined
  setSystem: Dispatch<SetStateAction<StrippedSystem | undefined>> | undefined
  command: AugmentedCommand | undefined
  setCommand: Dispatch<SetStateAction<AugmentedCommand | undefined>> | undefined
  isJob: boolean
  setIsJob: Dispatch<SetStateAction<boolean>> | undefined
}

const JobRequestCreationContext =
  createContext<JobRequestCreationProviderState>({
    system: undefined,
    setSystem: undefined,
    command: undefined,
    setCommand: undefined,
    isJob: false,
    setIsJob: undefined,
  })

const JobRequestCreationProvider = ({
  children,
}: JobRequestCreationProviderProps) => {
  const [system, setSystem] = useState<StrippedSystem | undefined>(undefined)
  const [command, setCommand] = useState<AugmentedCommand | undefined>(
    undefined,
  )
  const [isJob, setIsJob] = useState(false)

  const value = {
    system,
    setSystem,
    command,
    setCommand,
    isJob,
    setIsJob,
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
