import { useJobRequestCreation } from 'components/JobRequestCreation'
import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { Command, System } from 'types/backend-types'

interface JobCreateForwarderProps {
  system: System
  command: Command
}

/**
 * Updates the context with the provided system and command, tells the context
 * that we're scheduling a Job and forwards to the appropriate page.
 *
 * @param param0 - the system and command
 * @returns A Navigate object that takes us to the right page.
 */
const JobCreateForwarder = ({ system, command }: JobCreateForwarderProps) => {
  const { setSystem, setCommand } = useJobRequestCreation()
  const { commands, ...strippedSystem } = system
  const augmentedCommand = {
    ...command,
    namespace: system.namespace,
    systemName: system.name,
    systemVersion: system.version,
    systemId: system.id,
  }

  useEffect(() => {
    /*
       intentionally used with empty dependency array to execute only
       once on mount
    */
    setSystem && setSystem(strippedSystem)
    setCommand && setCommand(augmentedCommand)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Navigate
      to={
        `/jobs/create/${system.namespace}/${system.name}` +
        `/${system.version}/commands/${command.name}`
      }
    />
  )
}

export { JobCreateForwarder }
