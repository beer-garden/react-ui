import useAxios, { Options as AxiosHooksOptions } from 'axios-hooks'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import {
  formatBeergardenRequests,
  getUrlFromSearchApi,
  OrderableColumnDirection,
  RequestsIndexTableData,
  RequestsIndexTableHeaders,
  SearchableColumnData,
  updateApiOrderBy,
  updateApiSearchBy,
  useRequestsReducer,
} from 'pages/RequestsIndex/RequestsIndexTable/data'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Filters } from 'react-table'
import { Request } from 'types/backend-types'

const useRequests = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const [isLoading, setIsLoading] = useState(false)
  const [isErrored, setIsErrored] = useState(false)
  const [requests, setRequests] = useState<RequestsIndexTableData[]>([])
  const [headers, setHeaders] = useState<RequestsIndexTableHeaders>({
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
  }, [loading])
  useEffect(() => {
    setIsErrored(!!error)
  }, [error])

  /**
   * This function will update whenever the state's config object has updated.
   *
   * This will be called automatically whenever the config changes and will
   * also be used as the onChange handler for a refresh button.
   */
  const handleRefresh = useCallback(() => {
    execute(config, { useCache: false })
      .then((resp) =>
        console.log('data.tsx - execute fired with response:', resp),
      )
      .catch((e) => console.log('data.tsx - error from execute:', e))
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
    if (response && !error) {
      if (data) {
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
          draw: draw.length > 0 ? parseInt(draw) : undefined,
        })
      }
    } else if (error) {
      setIsErrored(!!error)
    }
  }, [response, data, error, searchApi.length])

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
