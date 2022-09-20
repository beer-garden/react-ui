import RefreshIcon from '@mui/icons-material/Refresh'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Checkbox, FormControlLabel } from '@mui/material'
import { Divider } from 'components/Divider'
import { PageHeader } from 'components/PageHeader'
import { SSRTable } from 'components/Table'
import {
  defaultOrderingColumnIndex,
  OrderableColumnDirection,
  RequestsIndexTableData,
  SearchableColumnData,
  useRequests,
  useRequestsIndexTableColumns,
} from 'pages/RequestsIndex/data'
import {
  ChangeEvent as ReactChangeEvent,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { Filters, SortingRule } from 'react-table'

const RequestsIndex = () => {
  const {
    requestData: { isLoading, isErrored, requests },
    handlers: {
      handleIncludeChildren,
      handleShowHidden,
      handleSearchBy,
      handleOrderBy,
      handleResultCount,
      handleStartPage,
      handleRefresh,
    },
    ssrValues,
  } = useRequests()

  const columns = useRequestsIndexTableColumns()

  /* These are for the children components passed to the table. */
  const [includeChildren, setIncludeChildren] = useState(false)
  const [showHidden, setShowHidden] = useState(false)

  const includeChildrenOnChange = useCallback(
    (event: ReactChangeEvent<HTMLInputElement>) => {
      setIncludeChildren(event.target.checked)
      handleIncludeChildren(event.target.checked)
    },
    [handleIncludeChildren],
  )

  const showHiddenOnChange = useCallback(
    (event: ReactChangeEvent<HTMLInputElement>) => {
      setShowHidden(event.target.checked)
      handleShowHidden(event.target.checked)
    },
    [handleShowHidden],
  )

  /* These will keep the table state synced with what's maintained here. */
  const [searchFilters, setSearchFilters] = useState<
    Filters<RequestsIndexTableData> | undefined
  >(undefined)
  const [ordering, setOrdering] = useState<
    SortingRule<RequestsIndexTableData> | undefined
  >(undefined)

  const searchByOnChange = useCallback(
    (filters: Filters<RequestsIndexTableData>) => {
      setSearchFilters(filters)
      handleSearchBy(filters)
    },
    [handleSearchBy],
  )

  const orderingOnChange = useCallback(
    (column: SearchableColumnData, direction: OrderableColumnDirection) => {
      setOrdering({
        id: column,
        desc: direction === 'desc',
      })
      handleOrderBy(column, direction)
    },
    [handleOrderBy],
  )

  const sortAndOrdering = useMemo(
    () => ({
      filterList: searchFilters,
      ordering,
      defaultOrderingColumnIndex,
    }),
    [searchFilters, ordering],
  )

  const handlers = useMemo(
    () => ({
      handleSearchBy: searchByOnChange,
      handleOrderBy: orderingOnChange,
      handleResultCount,
      handleStartPage,
    }),
    [searchByOnChange, orderingOnChange, handleResultCount, handleStartPage],
  )

  return (
    <Box>
      <PageHeader title="Requests" description="" />
      <Divider />
      <SSRTable<
        RequestsIndexTableData,
        SearchableColumnData,
        OrderableColumnDirection
      >
        tableKey="Requests"
        data={requests}
        columns={columns}
        fetchStatus={{ isLoading, isErrored }}
        ssrValues={ssrValues}
        sortAndOrdering={sortAndOrdering}
        handlers={handlers}
      >
        <FormControlLabel
          label="Include children"
          control={
            <Checkbox
              checked={includeChildren}
              onChange={includeChildrenOnChange}
              color="secondary"
            />
          }
        />
        <FormControlLabel
          label="Show hidden"
          control={
            <Checkbox
              checked={showHidden}
              onChange={showHiddenOnChange}
              color="secondary"
            />
          }
        />
        {isErrored ? (
          <Button size="small" startIcon={<RefreshIcon />} disabled>
            Refresh
          </Button>
        ) : (
          <LoadingButton
            size="small"
            color="secondary"
            loadingIndicator="Loading..."
            loading={isLoading}
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
          >
            Refresh
          </LoadingButton>
        )}
      </SSRTable>
    </Box>
  )
}

export { RequestsIndex }
