import { Box, Button, CircularProgress, Paper, Stack } from '@mui/material'
import { AxiosResponse } from 'axios'
import { Divider } from 'components/Divider'
import { JsonCard } from 'components/JsonCard'
import { LabeledData } from 'components/LabeledData'
import { PageHeader } from 'components/PageHeader'
import { PermissionsContainer } from 'containers/PermissionsContainer'
import { useJobs } from 'hooks/useJobs'
import { JobButton } from 'pages/JobView'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Job } from 'types/backend-types'

const JobView = () => {
  const [job, setJob] = useState<Job | null>(null)
  const [description, setDescription] = useState('')
  const [showTrigger, setShowTrigger] = useState(true)
  const [showTemplate, setShowTemplate] = useState(true)
  const { hasJobPermission } = PermissionsContainer.useContainer()
  const params = useParams()
  const { getJob, deleteJob } = useJobs()
  const navigate = useNavigate()

  const id = params.id as string
  const jobButtonCallback = (response: AxiosResponse) => setJob(response.data)
  const deleteButtonCallback = () => deleteJob(() => navigate('/jobs'), id)

  useEffect(() => {
    if (id) {
      getJob((response: AxiosResponse) => {
        setJob(response.data)
        if (response.data) {
          setDescription(`${response.data.name} ${id}`)
        } else {
          setDescription(id)
        }
      }, id)
    }
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
    <Box>
      {job && hasJobPermission('job:update', job) && (
        <Stack direction="row" spacing={1} sx={{ float: 'right' }}>
          <Button variant="contained" color="primary">
            Update Job
          </Button>
          {job && (
            <JobButton job={job as Job} id={id} callback={jobButtonCallback} />
          )}
          <Button
            variant="contained"
            color="error"
            onClick={deleteButtonCallback}
          >
            Delete Job
          </Button>
          <Button variant="contained" color="secondary">
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
    </Box>
  )
}

export { JobView }
