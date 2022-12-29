import { Button, Tooltip } from '@mui/material'
import { JobRequestCreationContext } from 'components/JobRequestCreation'
import { useSystems } from 'hooks/useSystems'
import {
  MouseEventHandler,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { Job } from 'types/backend-types'
import { CommandViewJobModel } from 'types/form-model-types'
import { commandsPairer, systemFilter } from 'utils/commandFormatters'

interface UpdateJobButtonProps {
  job: Job
}

const extractRequestModel = (job: Job): CommandViewJobModel => {
  return {
    comment: { comment: job.request_template.comment || '' },
    instance_names: { instance_name: '' },
    parameters: {},
    job: {
      coalesce: job.coalesce,
      max_instances: job.max_instances,
      misfire_grace_time: job.misfire_grace_time ?? undefined,
      name: job.name,
      timeout: job.timeout ?? undefined,
      trigger: job.trigger_type,
      ...job.trigger,
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
        }

        fetchSystemCommandPair()

        const onClick: MouseEventHandler<HTMLButtonElement> = () => {
          setIsReplay(true)
          setIsJob(true)
          setRequestModel(extractRequestModel(job))
          navigate(
            [
              '/systems',
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
