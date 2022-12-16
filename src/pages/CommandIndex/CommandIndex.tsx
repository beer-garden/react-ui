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
import { commandsFromSystems } from 'hooks/useCommands'
import { useCommandsParameterized } from 'hooks/useCommandsParameterized'
import { useCommandIndexTableColumns } from 'pages/CommandIndex'
import { useEffect, useState } from 'react'
import { CommandIndexTableData } from 'types/custom-types'

const CommandIndex = () => {
  const { hasSystemPermission } = PermissionsContainer.useContainer()
  const {
    commands,
    namespace,
    systemName,
    systemId,
    version,
    includeHidden,
    hiddenOnChange,
    error,
  } = useCommandsParameterized<CommandIndexTableData>(commandsFromSystems)
  const [permission, setPermission] = useState(false)

  useEffect(() => {
    const fetchPermission = async () => {
      const permCheck = await hasSystemPermission(
        'request:create',
        namespace,
        systemId,
      )
      setPermission(permCheck || false)
    }
    fetchPermission()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namespace, systemId])

  const columns = useCommandIndexTableColumns(permission)
  const breadcrumbs = [namespace, systemName, version]
    .filter((x) => !!x)
    .map((x) => String(x))

  let tableKey = 'Commands'
  if (version) tableKey = version + tableKey
  if (systemName) tableKey = systemName + tableKey
  if (namespace) tableKey = namespace + tableKey

  return !error ? (
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
                onChange={hiddenOnChange}
                color="secondary"
              />
            }
          />
        </Box>
      </Table>
    </Box>
  ) : error.response ? (
    <ErrorAlert
      statusCode={error.response.status}
      errorMsg={error.response.statusText}
    />
  ) : (
    <Backdrop open={true}>
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}

export { CommandIndex }
