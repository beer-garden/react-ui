import useAxios, { Options as AxiosHooksOptions } from 'axios-hooks'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useMountedState } from 'hooks/useMountedState'
import {
  getUrlFromSearchApi,
  updateApiOrderBy,
  updateApiSearchBy,
  useRequestsReducer,
} from 'pages/RequestsIndex'
import { useCallback, useEffect, useMemo } from 'react'
import { Filters } from 'react-table'
import { Request } from 'types/backend-types'
import {
  OrderableColumnDirection,
  RequestsIndexTableData,
  RequestsIndexTableHeaders,
  SearchableColumnData,
} from 'types/request-types'
import { formatBeergardenRequests } from 'utils/dataHelpers'

const useRequests = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const [isLoading, setIsLoading] = useMountedState<boolean>(false)
  const [isErrored, setIsErrored] = useMountedState<boolean>(false)
  const [requests, setRequests] = useMountedState<RequestsIndexTableData[]>([])
  const [headers, setHeaders] = useMountedState<RequestsIndexTableHeaders>({
    start: 0,
    length: 0,
    requested: 0,
    recordsFiltered: 0,
    recordsTotal: 0,
    draw: 1,
  })

  const { searchApi, config, updateUrl, updateConfig, updateApi } =
    useRequestsReducer()

  const searchUrl = useMemo(() => {
    return getUrlFromSearchApi(searchApi)
  }, [searchApi])

  useEffect(() => {
    updateUrl(searchUrl)
    updateConfig({
      url: searchUrl,
      method: 'GET',
      withCredentials: authEnabled,
    })
  }, [updateUrl, updateConfig, authEnabled, searchUrl])

  const axiosOptions: AxiosHooksOptions = {
    manual: true,
    useCache: false,
    ssr: false,
    autoCancel: false,
  }

  /**
   * This is where the table data is fetched from the server. The axios
   * library takes care of its own state updates so that we just have to
   * monitor them.
   */
  const [{ data, loading, error, response }, execute] = useAxios<Request[]>(
    config,
    axiosOptions,
  )

  useEffect(() => {
    setIsLoading(loading)
  }, [loading, setIsLoading])
  useEffect(() => {
    setIsErrored(!!error)
  }, [error, setIsErrored])

  /**
   * This function will update whenever the state's config object has updated.
   *
   * This will be called automatically whenever the config changes and will
   * also be used as the onChange handler for a refresh button.
   */
  const handleRefresh = useCallback(() => {
    execute(config, { useCache: false })
      .then((resp) =>
        console.log(
          'data.tsx:handleRefresh() - execute fired with response:',
          resp,
        ),
      )
      .catch((e) =>
        console.error('data.tsx:handleRefresh() - error from execute:', e),
      )
  }, [execute, config])

  /**
   * handleRefresh updates whenever the state's config object has updated. We
   * call the function whenever it changes to automatically refresh the data.
   */
  useEffect(() => {
    handleRefresh()
  }, [handleRefresh])

  /**
   * This is where we pick apart the state returned by useAxios (when it's
   * updated) and update our own state.
   */
  useEffect(() => {
    if (data && !error) {
      if (response?.headers) {
        setRequests(formatBeergardenRequests(data))

        const {
          start,
          length,
          recordsfiltered: recordsFiltered,
          recordstotal: recordsTotal,
          draw,
        } = response.headers

        setHeaders({
          start: parseInt(start),
          length: parseInt(length),
          requested: searchApi.length,
          recordsFiltered: parseInt(recordsFiltered),
          recordsTotal: parseInt(recordsTotal),
          draw: draw?.length > 0 ? parseInt(draw) : undefined,
        })
      } else {
        setIsErrored(true)
      }
    } else if (error) {
      setIsErrored(!!error)
    }
  }, [
    response,
    data,
    error,
    searchApi.length,
    setRequests,
    setHeaders,
    setIsErrored,
  ])

  /* Handlers for when state that affects the config/URL change.  */

  /**
   * Update search API to include children.
   */
  const handleShowHidden = useCallback(
    (showHidden: boolean) => {
      updateApi({
        ...searchApi,
        includeHidden: showHidden,
      })
    },
    [updateApi, searchApi],
  )

  const handleSearchBy = useCallback(
    (filters: Filters<RequestsIndexTableData>) => {
      /* goto page 0 when updating search */
      const startAdjusted = {
        ...searchApi,
        start: 0,
      }
      updateApi(updateApiSearchBy(startAdjusted, filters))
    },
    [updateApi, searchApi],
  )

  const handleOrderBy = useCallback(
    (column: SearchableColumnData, direction: OrderableColumnDirection) => {
      updateApi(updateApiOrderBy(searchApi, column, direction))
    },
    [updateApi, searchApi],
  )

  const handleIncludeChildren = useCallback(
    (includeChildren: boolean) => {
      updateApi({
        ...searchApi,
        includeChildren: includeChildren,
      })
    },
    [updateApi, searchApi],
  )

  const handleResultCount = useCallback(
    (resultCount: number) => {
      updateApi({
        ...searchApi,
        length: resultCount,
      })
    },
    [updateApi, searchApi],
  )

  const handleStartPage = useCallback(
    (page: number) => {
      updateApi({
        ...searchApi,
        start: page * headers.length,
      })
    },
    [updateApi, searchApi, headers.length],
  )

  /**
   * Values that are relevant for table data whose ordering/paging/filtering
   * is handled on the server.
   */
  const ssrValues = useMemo(
    () => ({
      start: headers.requested
        ? Math.floor(headers.start / headers.requested)
        : 0,
      requested: headers.requested,
      recordsFiltered: headers.recordsFiltered,
      recordsTotal: headers.recordsTotal,
    }),
    [
      headers.start,
      headers.requested,
      headers.recordsFiltered,
      headers.recordsTotal,
    ],
  )

  return {
    requestData: {
      isLoading,
      isErrored,
      requests,
      error,
    },
    handlers: {
      handleIncludeChildren,
      handleShowHidden,
      handleSearchBy,
      handleOrderBy,
      handleResultCount,
      handleStartPage,
      handleRefresh,
    },
    ssrValues: ssrValues,
  }
}

export { useRequests }
