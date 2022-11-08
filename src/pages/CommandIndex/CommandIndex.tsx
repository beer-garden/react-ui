import { Box, Checkbox, FormControlLabel } from '@mui/material'
import Breadcrumbs from 'components/Breadcrumbs'
import { Divider } from 'components/Divider'
import { PageHeader } from 'components/PageHeader'
import { Table } from 'components/Table'
import { PermissionsContainer } from 'containers/PermissionsContainer'
import { useCommands } from 'hooks/useCommands'
import { useCommandIndexTableColumns } from 'pages/CommandIndex'
import { useEffect, useState } from 'react'

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
  } = useCommands()
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

  return (
    <Box>
      <PageHeader title="Commands" description="" />
      <Divider />
      <Table tableKey="Commands" data={commands} columns={columns}>
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
  )
}

export { CommandIndex }
