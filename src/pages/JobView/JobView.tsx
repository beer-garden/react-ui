import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { AxiosError } from 'axios'
import { Divider } from 'components/Divider'
import { useJobRequestCreation } from 'components/JobRequestCreation'
import { JsonCard } from 'components/JsonCard'
import { LabeledData } from 'components/LabeledData'
import { ModalWrapper } from 'components/ModalWrapper'
import { PageHeader } from 'components/PageHeader'
import { Snackbar } from 'components/Snackbar'
import { PermissionsContainer } from 'containers/PermissionsContainer'
import { useJobs } from 'hooks/useJobs'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Job } from 'types/backend-types'
import { SnackbarState } from 'types/custom-types'
import { dateFormatted } from 'utils/date-formatter'

const isIntervalTrigger = (triggerType: string) => {
  return triggerType === 'interval'
}

const JobView = () => {
  const [runOpen, setRunOpen] = useState<boolean>(false)
  const [delOpen, setDeleteOpen] = useState<boolean>(false)
  const [job, setLocalJob] = useState<Job>()
  const [alert, setAlert] = useState<SnackbarState | undefined>(undefined)
  const [description, setDescription] = useState('')
  const [showTrigger, setShowTrigger] = useState(true)
  const [showTemplate, setShowTemplate] = useState(true)
  const [permission, setPermission] = useState(false)
  const { setIsJob, setJob } = useJobRequestCreation()
  const { hasJobPermission } = PermissionsContainer.useContainer()
  const params = useParams()
  const { getJob, deleteJob, pauseJob, resumeJob, runAdHoc } = useJobs()
  const navigate = useNavigate()

  const _setJob = (job: Job) => {
    setJob && setJob(job)
    setLocalJob(job)
  }

  const id = params.id as string

  const runNow = (reset: boolean) => {
    runAdHoc(id, reset).then(
      () => {
        setAlert({
          severity: 'success',
          message: 'Job running...',
          showSeverity: false,
        })
        navigate('/jobs')
      },
      (e) => {
        setAlert({
          severity: 'error',
          message: e.response?.data.message || e,
          doNotAutoDismiss: true,
        })
      },
    )
  }

  const errorHandler = (e: AxiosError) => {
    setAlert({
      severity: 'error',
      message: e.response?.data.message,
      doNotAutoDismiss: true,
    })
  }

  const deleteCallback = () => {
    deleteJob(id)
      .then(() => navigate('/jobs'))
      .catch((e) => {
        errorHandler(e)
      })
  }

  const fetchJob = () => {
    if (id) {
      getJob(id)
        .then((response) => {
          _setJob(response.data)
          if (response.data) {
            setDescription(`${response.data.name} ${id}`)
          } else {
            setDescription(id)
          }
          hasJobPermission('job:update', response.data).then((permCheck) => {
            setPermission(permCheck || false)
          })
        })
        .catch((e) => {
          errorHandler(e)
        })
    }
  }

  useEffect(() => {
    fetchJob()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const getUrl = useMemo(() => {
    if (job) {
      const url =
        '/systems/' +
        job.request_template.namespace +
        '/' +
        job.request_template.system
      return url
    }
    return undefined
  }, [job])

  return (
    <>
      {job && permission && (
        <Stack direction="row" spacing={1} sx={{ float: 'right' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setIsJob && setIsJob(true)
              navigate(
                `/jobs/${job.request_template.namespace}/${job.request_template.system}` +
                  `/${job.request_template.system_version}/${job.name}`,
              )
            }}
          >
            Update Job
          </Button>
          {job.status === 'RUNNING' ? (
            <Button
              variant="contained"
              color="warning"
              aria-label="Pause job"
              onClick={() => {
                pauseJob(id)
                  .then((response) => {
                    _setJob(response.data)
                    setTimeout(() => fetchJob(), 100)
                  })
                  .catch((e) => {
                    errorHandler(e)
                  })
              }}
            >
              Pause job
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                resumeJob(id)
                  .then((response) => {
                    _setJob(response.data)
                    setTimeout(() => fetchJob(), 100)
                  })
                  .catch((e) => {
                    errorHandler(e)
                  })
              }}
              aria-label="Resume job"
            >
              Resume job
            </Button>
          )}
          <Button
            variant="contained"
            color="error"
            onClick={() => setDeleteOpen(true)}
            aria-label="Delete job"
          >
            Delete Job
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              if (isIntervalTrigger(job.trigger_type)) {
                setRunOpen(true)
              } else {
                runNow(false)
              }
            }}
          >
            Run Now
          </Button>
        </Stack>
      )}
      <PageHeader title="Job" description={description} />
      <Divider />
      <Stack direction="column" spacing={2}>
        <Paper sx={{ backgroundColor: 'background.default' }} elevation={0}>
          {job ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, 280px)',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <LabeledData label="Name" data={job.name} />
              <LabeledData
                label="Command"
                data={job.request_template.command}
              />
              <LabeledData
                label="System"
                data={job.request_template.system}
                link={getUrl}
              />
              <LabeledData
                label="System Version"
                data={job.request_template.system_version}
                link={`${getUrl}/${job.request_template.system_version}`}
              />
              <LabeledData
                label="Instance Name"
                data={job.request_template.instance_name}
              />
              <LabeledData label="Status" data={job.status} />
              <LabeledData label="Success Count" data={job.success_count} />
              <LabeledData label="Error Count" data={job.error_count} />
              {job.next_run_time && (
                <LabeledData
                  label="Next Run Time"
                  data={dateFormatted(new Date(job.next_run_time))}
                />
              )}
            </Box>
          ) : (
            <CircularProgress data-testid="dataLoading" />
          )}
        </Paper>
        <Stack direction="row" spacing={2}>
          {showTrigger && (
            <JsonCard
              title="Trigger"
              collapseHandler={() => {
                setShowTemplate(!showTemplate)
              }}
              data={job?.trigger}
              iconTrigger={showTrigger && showTemplate}
            />
          )}
          {showTemplate && (
            <JsonCard
              title="Request Template"
              collapseHandler={() => {
                setShowTrigger(!showTrigger)
              }}
              data={job?.request_template}
              iconTrigger={showTrigger && showTemplate}
            />
          )}
        </Stack>
      </Stack>
      <ModalWrapper
        open={runOpen}
        header="Reset the Job Interval"
        onClose={() => {
          setRunOpen(false)
        }}
        onCancel={() => {
          setRunOpen(false)
        }}
        onSubmit={() => {
          runNow(true)
          setRunOpen(false)
        }}
        customButton={{
          label: 'Just Run',
          cb: () => {
            runNow(false)
          },
          color: 'primary',
        }}
        styleOverrides={{ size: 'md', top: '-55%' }}
        content={
          <>
            <Typography>
              This job has an interval trigger. Choose one of the buttons below
              to update when the job should be run again:
            </Typography>
            <Typography>
              {'Selecting "Submit" updates the next run time of the job ' +
                'based on the time right now.'}
            </Typography>
            <Typography>
              {'Selecting "Just Run" will run the job now but keep the job\'s ' +
                'existing next run time.'}
            </Typography>
            <Typography>
              {'Selecting "Cancel" cancels running the job now and no changes' +
                ' will be made to the next run time.'}
            </Typography>
          </>
        }
      />
      <ModalWrapper
        open={delOpen}
        header="Delete Job?"
        onClose={() => {
          setDeleteOpen(false)
        }}
        onCancel={() => {
          setDeleteOpen(false)
        }}
        onSubmit={() => {
          deleteCallback()
          setDeleteOpen(false)
        }}
        styleOverrides={{ size: 'md', top: '-55%' }}
        content={
          <Typography>
            Remove job {job?.name || id} from the system. This action cannot be
            undone.
          </Typography>
        }
      />
      {alert && <Snackbar status={alert} />}
    </>
  )
}

export { JobView }
