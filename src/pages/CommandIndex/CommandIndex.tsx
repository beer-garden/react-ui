import {
  Backdrop,
  Box,
  Checkbox,
  CircularProgress,
  FormControlLabel,
} from '@mui/material'
import Breadcrumbs from 'components/Breadcrumbs'
import { Divider } from 'components/Divider'
import { ErrorAlert } from 'components/ErrorAlert'
import { PageHeader } from 'components/PageHeader'
import { Table } from 'components/Table'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useMountedState } from 'hooks/useMountedState'
import { useSystems } from 'hooks/useSystems'
import { useCommandIndexTableColumns } from 'pages/CommandIndex'
import { ChangeEvent, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { System } from 'types/backend-types'
import { CommandIndexTableData, ObjectWithStringKeys } from 'types/custom-types'
import { commandsFromSystems } from 'utils/commandFormatters'

interface IParam extends ObjectWithStringKeys {
  namespace: string
  systemName: string
  version: string
}

const CommandIndex = () => {
  const { config } = ServerConfigContainer.useContainer()
  const [loading, setLoading] = useMountedState<boolean>(true)
  const [commands, setCommands] = useMountedState<CommandIndexTableData[]>([])
  const [includeHidden, setIncludeHidden] = useMountedState<boolean>(false)
  const [template, setTemplate] = useMountedState<JSX.Element | undefined>()
  const { error, getSystems } = useSystems()
  const { namespace, systemName, version } = useParams() as IParam

  useEffect(() => {
    getSystems()
      .then((response) => {
        setCommands(
          commandsFromSystems(
            response.data,
            includeHidden,
            namespace,
            systemName,
            version,
          ),
        )
        const foundSystem = response.data.find(
          (system: System) => system.name === systemName,
        )
        if (foundSystem && foundSystem.template.length > 0) {
          if (config?.execute_javascript) {
            // Trigger page loading and hide table
            setTemplate(<></>)
            setLoading(false)
            // Dangerously set HTML with <script> etc intact and executed
            const scriptEl = document
              .createRange()
              .createContextualFragment(foundSystem.template)
            const mydiv = document.getElementById('dangerousPlaceholder')
            mydiv?.append(scriptEl)
          } else {
            setTemplate(
              <div
                dangerouslySetInnerHTML={{ __html: foundSystem.template }}
              />,
            )
          }
        }
        setLoading(false)
      })
      .catch((e) => {
        // e handled in ErrorAlert in return element
        setLoading(false)
      })
  }, [
    config?.execute_javascript,
    getSystems,
    includeHidden,
    namespace,
    setCommands,
    setLoading,
    setTemplate,
    systemName,
    version,
  ])

  const columns = useCommandIndexTableColumns()
  const breadcrumbs = [namespace, systemName, version]
    .filter((x) => !!x)
    .map((x) => String(x))

  let tableKey = 'Commands'
  if (version) tableKey = version + tableKey
  if (systemName) tableKey = systemName + tableKey
  if (namespace) tableKey = namespace + tableKey

  return !loading && !error ? (
    <Box>
      <PageHeader title="Commands" description="" />
      <Divider />
      <div id="dangerousPlaceholder" data-testid="dangerous" />
      {template ? (
        template
      ) : commands.length > 0 ? (
        <Table tableKey={tableKey} data={commands} columns={columns}>
          <Box mb={2}>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <FormControlLabel
              label="Include hidden"
              control={
                <Checkbox
                  checked={includeHidden}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setIncludeHidden(event.target.checked)
                  }}
                  color="secondary"
                />
              }
            />
          </Box>
        </Table>
      ) : (
        <ErrorAlert
          statusCode={204}
          errorMsg={
            `No commands found for ${systemName} system in ${namespace} namespace` +
            (version ? ` for version ${version}.` : '.')
          }
        />
      )}
    </Box>
  ) : error && error.response ? (
    <ErrorAlert
      statusCode={error.response.status}
      errorMsg={error.response.statusText}
    />
  ) : (
    <Backdrop open={true}>
      <CircularProgress color="inherit" aria-label="Command data loading" />
    </Backdrop>
  )
}

export { CommandIndex }
