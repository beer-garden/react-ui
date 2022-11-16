import { IdType, Row } from 'react-table'
import { ObjectWithStringKeys } from 'types/custom-types'
const getMinAndMax = (
  rows: Row<ObjectWithStringKeys>[],
  id: IdType<ObjectWithStringKeys>,
) => {
  let min = rows.length ? rows[0].values[id] : 0
  let max = rows.length ? rows[0].values[id] : 0

  rows.forEach((row) => {
    min = Math.min(row.values[id], min)
    max = Math.max(row.values[id], max)
  })

  return [min, max]
}

export { getMinAndMax }
