import { Box, Checkbox, FormControlLabel } from '@mui/material'
import Breadcrumbs from 'components/Breadcrumbs'
import { Divider } from 'components/Divider'
import { PageHeader } from 'components/PageHeader'
import { Snackbar } from 'components/Snackbar'
import { Table } from 'components/Table'
import { PermissionsContainer } from 'containers/PermissionsContainer'
import { useSystems } from 'hooks/useSystems'
import { useCommandIndexTableColumns } from 'pages/CommandIndex'
import { ChangeEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { System } from 'types/backend-types'
import {
  CommandIndexTableData,
  ObjectWithStringKeys,
  SnackbarState,
} from 'types/custom-types'
import { commandsFromSystems } from 'utils/commandFormatters'

interface IParam extends ObjectWithStringKeys {
  namespace: string
  systemName: string
  version: string
}

const CommandIndex = () => {
  const { hasSystemPermission } = PermissionsContainer.useContainer()
  const [permission, setPermission] = useState(false)
  const [commands, setCommands] = useState<CommandIndexTableData[]>([])
  const [includeHidden, setIncludeHidden] = useState(false)
  const [alert, setAlert] = useState<SnackbarState>()
  const { getSystems } = useSystems()
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
      })
      .catch((e) => {
        setAlert({
          severity: 'error',
          message: e.response?.data.message || e,
          doNotAutoDismiss: true,
        })
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [includeHidden, namespace, systemName, version])

  const columns = useCommandIndexTableColumns(permission)
  const breadcrumbs = [namespace, systemName, version]
    .filter((x) => !!x)
    .map((x) => String(x))

  let tableKey = 'Commands'
  if (version) tableKey = version + tableKey
  if (systemName) tableKey = systemName + tableKey
  if (namespace) tableKey = namespace + tableKey

  return (
    <Box>
      <PageHeader title="Commands" description="" />
      <Divider />
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
      {alert ? <Snackbar status={alert} /> : null}
    </Box>
  )
}

export { CommandIndex }
