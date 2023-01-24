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
import { PermissionsContainer } from 'containers/PermissionsContainer'
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
  const { hasSystemPermission } = PermissionsContainer.useContainer()
  const [permission, setPermission] = useMountedState<boolean>(false)
  const [loading, setLoading] = useMountedState<boolean>(true)
  const [commands, setCommands] = useMountedState<CommandIndexTableData[]>([])
  const [includeHidden, setIncludeHidden] = useMountedState<boolean>(false)
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
        if (foundSystem) {
          const fetchPermission = async () => {
            const permCheck = await hasSystemPermission(
              'request:create',
              namespace,
              foundSystem.id,
            )
            setPermission(permCheck || false)
          }
          fetchPermission()
        }
        setLoading(false)
      })
      .catch((e) => {
        setLoading(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    getSystems,
    includeHidden,
    namespace,
    setCommands,
    setLoading,
    setPermission,
    systemName,
    version,
  ])

  const columns = useCommandIndexTableColumns(permission)
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
      {commands.length > 0 ? (
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
