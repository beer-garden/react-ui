import { Button, Tooltip } from '@mui/material'
import { JobRequestCreationContext } from 'components/JobRequestCreation'
import { DisplayTrigger, formatTrigger } from 'formHelpers/get-submit-argument'
import { useSystems } from 'hooks/useSystems'
import { MouseEventHandler, useContext, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Job } from 'types/backend-types'
import { CommandViewJobModel } from 'types/form-model-types'
import { commandsPairer, systemFilter } from 'utils/commandFormatters'

interface UpdateJobButtonProps {
  job: Job
}

/* From a backend Job definition, format it in a way that it displays
 * correctly in the frontend form. */
const extractRequestModel = (job: Job): CommandViewJobModel => {
  const { trigger, triggerData } = formatTrigger(job) as DisplayTrigger
  return {
    comment: { comment: job.request_template.comment || '' },
    instance_names: { instance_name: job.request_template.instance_name },
    parameters: {},
    job: {
      coalesce: job.coalesce,
      max_instances: job.max_instances,
      misfire_grace_time: job.misfire_grace_time ?? undefined,
      name: job.name,
      timeout: job.timeout ?? undefined,
      trigger: trigger,
      ...triggerData,
    },
  }
}

const UpdateJobButton = ({ job }: UpdateJobButtonProps) => {
  const navigate = useNavigate()
  const { getSystems } = useSystems()
  const isErroredRef = useRef(false)
  const onClickRef = useRef<MouseEventHandler<HTMLButtonElement> | undefined>()
  const { setIsJob, setIsReplay, setRequestModel, setSystem, setCommand } =
    useContext(JobRequestCreationContext)

  useEffect(() => {
    let mounted = true

    if (mounted) {
      if (
        setIsReplay &&
        setIsJob &&
        setRequestModel &&
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

        const onClick: MouseEventHandler<HTMLButtonElement> = () => {
          setIsReplay(true)
          setIsJob(true)
          setRequestModel(extractRequestModel(job))
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
    setIsJob,
    setIsReplay,
    setRequestModel,
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
