import moment from 'moment'
import {
  ColumnData,
  defaultColumnsData,
  OrderableColumnDirection,
  OrderableColumnIndex,
  RequestsIndexTableData,
  RequestsSearchApi,
  SearchableColumn,
  SearchableColumnData,
} from 'pages/RequestsIndex/RequestsIndexTable/data'
import { Filters } from 'react-table'

const getIndexBySearchTerm = (
  columns: ColumnData[],
  searchColumn: string,
): number => {
  return columns.indexOf(
    columns.find((element) => element.data === searchColumn) as ColumnData,
  )
}

const updateSearchColumn = (
  column: SearchableColumn,
  value: string,
  regex = false,
): SearchableColumn => {
  return {
    ...column,
    search: { value: value, regex: regex },
  }
}

const formatDate = (value: number) =>
  moment.utc(value).format('YYYY-MM-DD HH:mm:ss')

/**
 * Update search API with search values.
 *
 * If an empty list of search filters is passed, update the API to the
 * default, which has no search parameters.
 *
 * @param searchApi
 * @param searchColumns
 * @returns Search api updated to restrict results to those matching the
 * provided search values in the provided search filters. If search filters
 * is empty, zero out all filters.
 */
const updateApiSearchBy = (
  searchApi: RequestsSearchApi,
  searchFilters: Filters<RequestsIndexTableData>,
): RequestsSearchApi => {
  let newColumns = defaultColumnsData

  for (const filter of searchFilters) {
    const { id, value } = filter
    let filterId = id as string
    let filterValue = value as string

    if (id === 'created') {
      /* the outlier */
      filterId = 'created_at'
      const valueArr = value as Array<number>

      if (valueArr && valueArr.length) {
        const start = valueArr[0]
        const end = valueArr[1]

        filterValue = start
          ? end
            ? `${formatDate(start)}~${formatDate(end)}`
            : `${formatDate(start)}~`
          : `~${formatDate(end)}`
        /* they can't both be null */
      }
    }

    const index = getIndexBySearchTerm(
      newColumns,
      filterId as SearchableColumnData,
    )
    const columnToUpdate = newColumns.slice(index, index + 1).pop()
    const unchangedColumns = newColumns.filter((d) => d.data !== id)
    const updatedColumn = updateSearchColumn(
      columnToUpdate as SearchableColumn,
      filterValue,
    )

    newColumns = [...unchangedColumns, updatedColumn]
  }

  return {
    ...searchApi,
    columns: newColumns,
  }
}

/**
 * Update search API with ordering.
 *
 * @param searchApi
 * @param orderColumn
 * @param direction
 * @returns Search api updated to provide results ordered on the provided
 * order column and direction
 */
const updateApiOrderBy = (
  searchApi: RequestsSearchApi,
  orderColumn: string,
  direction: OrderableColumnDirection,
): RequestsSearchApi => {
  const columnOrderIndex = getIndexBySearchTerm(
    searchApi.columns,
    orderColumn !== 'created' ? orderColumn : 'created_at',
  ) as OrderableColumnIndex

  return {
    ...searchApi,
    order: {
      column: columnOrderIndex,
      dir: direction,
    },
  }
}

export { updateApiOrderBy,updateApiSearchBy }
