import { Box } from '@mui/material'
import useAxios from 'axios-hooks'
import { useEffect, useState } from 'react'
import ReactJson from 'react-json-view'
import { useParams } from 'react-router-dom'
import { formBuilder } from '../../builderForm/form_builder'
import Breadcrumbs from '../../components/Breadcrumbs'
import CommandViewForm from '../../components/command_view_form'
import Divider from '../../components/divider'
import PageHeader from '../../components/PageHeader'
import { Command, System } from '../../types/custom_types'
import { useIsAuthEnabled } from '../../hooks/useIsAuthEnabled'

const CommandView = () => {
  const [systems, setSystems] = useState<System[]>([])
  const {
    namespace,
    system_name: systemName,
    version,
    command_name: commandName,
  } = useParams()
  const { authIsEnabled } = useIsAuthEnabled()
  const [{ data, error }] = useAxios({
    url: '/api/v1/systems',
    method: 'get',
    withCredentials: authIsEnabled,
  })
  useEffect(() => {
    if (data && !error) {
      setSystems(data)
    }
  }, [data, error])

  const breadcrumbs = [namespace, systemName, version, commandName].filter(
    (x) => !!x
  ) as string[]
  const title = commandName ?? ''
  let description = ''
  let formElement: JSX.Element = <div />

  const system = systems.find(
    (s: System) =>
      s.name === systemName &&
      s.version === version &&
      s.namespace === namespace
  ) as System

  const command = system?.commands?.find((c: Command) => {
    return c.name === commandName
  }) as Command

  if (system && command) {
    const build = formBuilder(system, command)
    description = command.description
    formElement = (
      <Box>
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
      </Box>
    )
  }

  return (
    <Box>
      <PageHeader title={title} description={description} />
      <Divider />
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      {formElement}
    </Box>
  )
}

export default CommandView
