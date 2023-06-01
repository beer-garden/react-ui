import { Button, Tooltip } from '@mui/material'
import { JobRequestCreationContext } from 'components/JobRequestCreation'
import { useSystems } from 'hooks/useSystems'
import { MouseEventHandler, useContext, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Job } from 'types/backend-types'
import { commandsPairer, systemFilter } from 'utils/commandFormatters'

interface UpdateJobButtonProps {
  job: Job
}

const UpdateJobButton = ({ job }: UpdateJobButtonProps) => {
  const navigate = useNavigate()
  const { getSystems } = useSystems()
  const isErroredRef = useRef(false)
  const onClickRef = useRef<MouseEventHandler<HTMLButtonElement> | undefined>()
  const { setJob, setSystem, setCommand } =
    useContext(JobRequestCreationContext)

  useEffect(() => {
    let mounted = true

    if (mounted) {
      if (
        setJob &&
        setSystem &&
        setCommand
      ) {
        const { system, namespace, system_version, command } =
          job.request_template

        const fetchSystemCommandPair = async () => {
          try {
            const response = await getSystems()
            if (mounted) {
              const pair = response.data
                .filter(systemFilter(system, system_version, namespace))
                .map(commandsPairer)
                .flat()
                .filter((p) => p.command.name === command)
                .pop()

              if (pair) {
                setCommand(pair.command)
                setSystem(pair.system)
              } else {
                isErroredRef.current = true
                setCommand(undefined)
                setSystem(undefined)
              }
            }
          } catch {
            if (mounted) {
              isErroredRef.current = true
              setCommand(undefined)
              setSystem(undefined)
            }
          }
        }

        fetchSystemCommandPair()

        const getJobTemplate = (job: Job) => ({
            id: job.id,
            misfire_grace_time: job.misfire_grace_time,
            trigger: job.trigger,
            name: job.name,
            request_template: job.request_template,
            trigger_type: job.trigger_type,
            timeout: job.timeout,
            coalesce: job.coalesce,
            max_instances: job.max_instances,
          })

        const onClick: MouseEventHandler<HTMLButtonElement> = () => {
          setJob(getJobTemplate(job))
          navigate(
            [
              '/jobs/create',
              namespace,
              system,
              system_version,
              'commands',
              command,
            ].join('/'),
          )
        }
        onClickRef.current = onClick
      } else {
        isErroredRef.current = true
      }
    }

    return () => {
      mounted = false
    }
  }, [
    job,
    navigate,
    getSystems,
    setCommand,
    setJob,
    setSystem,
  ])

  if (isErroredRef.current) {
    return (
      <Tooltip title={'Cannot update job'}>
        <Button
          component="div"
          disabled
          variant="contained"
          color="primary"
          style={{ float: 'right', pointerEvents: 'auto' }}
        >
          Update Job
        </Button>
      </Tooltip>
    )
  }

  return (
    <Button variant="contained" color="primary" onClick={onClickRef.current}>
      Update Job
    </Button>
  )
}

export { UpdateJobButton }
