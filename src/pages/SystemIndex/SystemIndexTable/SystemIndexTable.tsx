import { Table } from '../../../components/Table'
import { useSystemIndexTableColumns, useSystems } from './data'

const SystemIndexTable = () => {
  const data = useSystems()
  const columns = useSystemIndexTableColumns()

  return <Table tableName="Systems" data={data} columns={columns} />
}

export default SystemIndexTable
