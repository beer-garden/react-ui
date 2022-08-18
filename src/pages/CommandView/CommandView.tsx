import { Box } from '@mui/material'
import useAxios from 'axios-hooks'
// import { formBuilder } from 'builderForm/form_builder'
import Breadcrumbs from 'components/Breadcrumbs'
import CommandViewForm from 'components/command_view_form'
import Divider from 'components/divider'
import PageHeader from 'components/PageHeader'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useEffect, useState } from 'react'
import ReactJson from 'react-json-view'
import { useParams } from 'react-router-dom'
import { Command, System } from 'types/backend-types'

const CommandView = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const [systems, setSystems] = useState<System[]>([])
  const {
    namespace,
    system_name: systemName,
    version,
    command_name: commandName,
  } = useParams()
  const [{ data, error }] = useAxios({
    url: '/api/v1/systems',
    method: 'get',
    withCredentials: authEnabled,
  })
  useEffect(() => {
    if (data && !error) {
      setSystems(data)
    }
  }, [data, error])

  const breadcrumbs = [namespace, systemName, version, commandName].filter(
    (x) => !!x,
  ) as string[]
  const title = commandName ?? ''

  const system = systems.find(
    (s: System) =>
      s.name === systemName &&
      s.version === version &&
      s.namespace === namespace,
  ) as System

  const command = system?.commands?.find((c: Command) => {
    return c.name === commandName
  }) as Command
  // let build
  // if (system && command) {
  //   build = formBuilder(system, command)
  // }

  return (
    <>
      <PageHeader title={title} description={command?.description} />
      <Divider />
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      {/* {build && (
        <>
          <CommandViewForm
            schema={build.schema}
            uiSchema={build.uiSchema}
            initialModel={build.model}
            command={command}
          />
          <Box pt={2} display="flex" alignItems="flex-start">
            <Box width={1 / 3}>
              <h3>Command</h3>
              <ReactJson src={command} />
            </Box>
            <Box width={1 / 3}>
              <h3>Schema</h3>
              <ReactJson src={build.schema} />
            </Box>
            <Box width={1 / 3}>
              <h3>UI Schema</h3>
              <ReactJson src={build.uiSchema} />
            </Box>
          </Box>
        </>
      )} */}
    </>
  )
}

export { CommandView }
