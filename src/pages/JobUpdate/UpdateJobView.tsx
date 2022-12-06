import { Box, Stack } from '@mui/material'
import Breadcrumbs from 'components/Breadcrumbs'
import { Divider } from 'components/Divider'
import { useJobRequestCreation } from 'components/JobRequestCreation'
import { JsonCard } from 'components/JsonCard'
import { PageHeader } from 'components/PageHeader'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { getJobSchema, getSchema, getUiSchema } from 'formHelpers'
import { formatTrigger } from 'formHelpers/get-submit-argument'
import { useSystems } from 'hooks/useSystems'
import { UpdateJobForm } from 'pages/JobUpdate/UpdateJobForm'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Job, System } from 'types/backend-types'

const UpdateJobView = () => {
  const [system, setSystem] = useState<System>()
  const { debugEnabled } = ServerConfigContainer.useContainer()
  const { getSystems } = useSystems()
  const { namespace, systemName, version, jobName } = useParams()
  const { isJob, job } = useJobRequestCreation()

  useEffect(() => {
    getSystems().then((response) => {
      const systems = response.data
      const foundSystem = systems.find(
        (systemCheck: System) => systemCheck.name === systemName,
      )
      if (foundSystem) {
        setSystem(foundSystem)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [systemName])

  const breadcrumbs = [namespace, systemName, version, jobName].filter(
    (x) => !!x,
  ) as string[]

  if (!job) return <></>
  const instances = system?.instances || []
  const parameters = job.request_template.parameters || {}
  const formattedTrigger = formatTrigger(job)

  // update trigger to meet RJSF styling
  let updatedJob: Job
  if (formattedTrigger) {
    updatedJob = Object.assign({}, job, {
      trigger: formattedTrigger.trigger,
      ...formattedTrigger.triggerData,
    })
  } else {
    updatedJob = job
  }

  const model = {
    parameters,
    job: updatedJob,
  }
  const schema = isJob
    ? getJobSchema(getSchema(instances, undefined, parameters))
    : getSchema(instances)
  const uiSchema = getUiSchema(instances)
  // const validator = getValidator(parameters)

  return (
    <Box>
      <PageHeader title={jobName ?? ''} description="" />
      <Divider />
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Box>
        <UpdateJobForm
          schema={schema}
          uiSchema={uiSchema}
          initialModel={model}
          job={job}
          isJob={isJob}
          // validator={validator}
        />
      </Box>
      {debugEnabled && (
        <Stack direction="row" spacing={2}>
          <JsonCard title="Job" data={job || {}} />
          <JsonCard title="Schema" data={schema} />
          <JsonCard title="UI Schema" data={uiSchema} />
        </Stack>
      )}
    </Box>
  )
}

export default UpdateJobView
