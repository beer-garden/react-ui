import RefreshIcon from '@mui/icons-material/Refresh'
import { LoadingButton } from '@mui/lab'
import {
  Alert,
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
} from '@mui/material'
import { Divider } from 'components/Divider'
import { ErrorAlert } from 'components/ErrorAlert'
import { PageHeader } from 'components/PageHeader'
import { SSRTable } from 'components/Table'
import { SocketContainer } from 'containers/SocketContainer'
import { useMountedState } from 'hooks/useMountedState'
import {
  defaultOrderingColumnIndex,
  useRequests,
  useRequestsIndexTableColumns,
} from 'pages/RequestsIndex'
import { ChangeEvent as ReactChangeEvent, useCallback, useEffect, useMemo } from 'react'
import { Filters, SortingRule } from 'react-table'
import {
  OrderableColumnDirection,
  RequestsIndexTableData,
  SearchableColumnData,
} from 'types/request-types'

const RequestsIndex = () => {
  const {
    requestData: { isLoading, isErrored, requests, error },
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
  const [includeChildren, setIncludeChildren] = useMountedState<boolean>(false)
  const [showHidden, setShowHidden] = useMountedState<boolean>(false)
  const [updatesDetected, setUpdatesDetected] = useMountedState<boolean>(false)
  const { addCallback, removeCallback } = SocketContainer.useContainer()

  if(isLoading && updatesDetected) setUpdatesDetected(false)

  const includeChildrenOnChange = useCallback(
    (event: ReactChangeEvent<HTMLInputElement>) => {
      setIncludeChildren(event.target.checked)
      handleIncludeChildren(event.target.checked)
    },
    [handleIncludeChildren, setIncludeChildren],
  )

  useEffect(() => {
    addCallback('request_updates', (event) => {
      if (
        ['REQUEST_CREATED',
        'REQUEST_STARTED',
        'REQUEST_UPDATED',
        'REQUEST_COMPLETED',
        'REQUEST_CANCELED'].includes(event.name)
        && !updatesDetected
      ){
        setUpdatesDetected(true)
      }
    })
    return () => {
      removeCallback('request_updates')
    }
  }, [addCallback, removeCallback, setUpdatesDetected, updatesDetected])

  const showHiddenOnChange = useCallback(
    (event: ReactChangeEvent<HTMLInputElement>) => {
      setShowHidden(event.target.checked)
      handleShowHidden(event.target.checked)
    },
    [handleShowHidden, setShowHidden],
  )

  /* These will keep the table state synced with what's maintained here. */
  const [searchFilters, setSearchFilters] = useMountedState<
    Filters<RequestsIndexTableData> | undefined
  >()
  const [ordering, setOrdering] = useMountedState<
    SortingRule<RequestsIndexTableData> | undefined
  >()

  const searchByOnChange = useCallback(
    (filters: Filters<RequestsIndexTableData>) => {
      setSearchFilters(filters)
      handleSearchBy(filters)
    },
    [handleSearchBy, setSearchFilters],
  )

  const orderingOnChange = useCallback(
    (column: SearchableColumnData, direction: OrderableColumnDirection) => {
      setOrdering({
        id: column,
        desc: direction === 'desc',
      })
      handleOrderBy(column, direction)
    },
    [handleOrderBy, setOrdering],
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

  return !error ? (
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
            variant="contained"
            loadingIndicator="Loading..."
            loading={isLoading}
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
          >
            Refresh
          </LoadingButton>
        )}
        { updatesDetected &&
          <Alert
            sx={{border: 'none', fontWeight: 'fontWeightMedium'}}
            severity="info"
            variant="outlined"
          >
            Updates detected
          </Alert>
        }
      </SSRTable>
    </Box>
  ) : error?.response ? (
    <ErrorAlert
      statusCode={error.response.status}
      errorMsg={error.response.statusText}
    />
  ) : (
    <Backdrop open={true}>
      <CircularProgress color="inherit" aria-label="Request data loading" />
    </Backdrop>
  )
}

export { RequestsIndex }
