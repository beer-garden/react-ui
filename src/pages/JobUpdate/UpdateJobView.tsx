import { Box } from '@mui/material'
import Breadcrumbs from 'components/Breadcrumbs'
import { Divider } from 'components/Divider'
import { useJobRequestCreation } from 'components/JobRequestCreation'
import { PageHeader } from 'components/PageHeader'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { getJobSchema, getSchema, getUiSchema } from 'formHelpers'
import { formatTrigger } from 'formHelpers/get-submit-argument'
import { useSystems } from 'hooks/useSystems'
import { UpdateJobForm } from 'pages/JobUpdate/UpdateJobForm'
import { useEffect, useState } from 'react'
import ReactJson from 'react-json-view'
import { useParams } from 'react-router-dom'
import { Job, System } from 'types/backend-types'

const UpdateJobView = () => {
  const [system, setSystem] = useState<System>()
  const { debugEnabled } = ServerConfigContainer.useContainer()
  const { systems } = useSystems()
  const { namespace, systemName, version, jobName } = useParams()
  const { isJob, job } = useJobRequestCreation()

  useEffect(() => {
    const foundSystem = systems.find(
      (systemCheck) => systemCheck.name === systemName,
    )
    if (foundSystem) {
      setSystem(foundSystem)
    }
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
        <Box pt={2} display="flex" alignItems="flex-start">
          <Box width={1 / 3}>
            <h3>Job</h3>
            <ReactJson src={job || {}} />
          </Box>
          <Box width={1 / 3}>
            <h3>Schema</h3>
            <ReactJson src={schema} />
          </Box>
          <Box width={1 / 3}>
            <h3>UI Schema</h3>
            <ReactJson src={uiSchema} />
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default UpdateJobView
