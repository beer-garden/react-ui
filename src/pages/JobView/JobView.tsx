import { Box, Button, CircularProgress, Paper, Stack } from '@mui/material'
import { AxiosError, AxiosResponse } from 'axios'
import { Divider } from 'components/Divider'
import { JsonCard } from 'components/JsonCard'
import { LabeledData } from 'components/LabeledData'
import { PageHeader } from 'components/PageHeader'
import { Snackbar } from 'components/Snackbar'
import { PermissionsContainer } from 'containers/PermissionsContainer'
import { useJobs } from 'hooks/useJobs'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Job } from 'types/backend-types'
import { SnackbarState } from 'types/custom-types'

const JobView = () => {
  const [job, setJob] = useState<Job | null>(null)
  const [description, setDescription] = useState('')
  const [showTrigger, setShowTrigger] = useState(true)
  const [showTemplate, setShowTemplate] = useState(true)
  const [permission, setPermission] = useState(false)
  const [alert, setAlert] = useState<SnackbarState | undefined>(undefined)
  const { hasJobPermission } = PermissionsContainer.useContainer()
  const params = useParams()
  const { getJob, deleteJob, pauseJob, resumeJob } = useJobs()
  const navigate = useNavigate()
  const id = params.id as string

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
        .then((response: AxiosResponse) => {
          setJob(response.data)
          if (response.data) {
            setDescription(`${response.data.name} ${id}`)
          } else {
            setDescription(id)
          }
        })
        .catch((e) => {
          console.log(e)
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

  useEffect(() => {
    if (job) {
      const fetchPermission = async () => {
        const permCheck = await hasJobPermission('job:update', job)
        setPermission(permCheck || false)
      }
      fetchPermission()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job])

  return (
    <>
      {job && permission && (
        <Stack direction="row" spacing={1} sx={{ float: 'right' }}>
          <Button variant="contained" color="primary" aria-label="update job">
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
                    setJob(response.data)
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
                    setJob(response.data)
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
            onClick={deleteCallback}
            aria-label="Delete job"
          >
            Delete Job
          </Button>
          <Button variant="contained" color="secondary" aria-label="Run now">
            Run Now
          </Button>
        </Stack>
      )}
      <PageHeader title="Job" description={description} />
      <Divider />
      <Stack direction={'column'} spacing={2}>
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
              <LabeledData label="Name" data={job?.name} />
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
                  data={new Date(job.next_run_time).toUTCString()}
                />
              )}
            </Box>
          ) : (
            <CircularProgress />
          )}
        </Paper>
        <Stack direction={'row'} spacing={2}>
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
      {alert && <Snackbar status={alert} />}
    </>
  )
}

export { JobView }
