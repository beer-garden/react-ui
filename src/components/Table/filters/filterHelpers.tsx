import { useEffect, useState } from 'react'
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

const useActiveElement = () => {
  const [active, setActive] = useState(document.activeElement)

  const handleFocus = () => {
    setActive(document.activeElement)
  }

  useEffect(() => {
    document.addEventListener('focusin', handleFocus)

    return () => {
      document.removeEventListener('focusin', handleFocus)
    }
  }, [])

  return active
}

export { getMinAndMax, useActiveElement }
