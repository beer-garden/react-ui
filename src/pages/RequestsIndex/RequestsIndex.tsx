import { Box, Checkbox, Divider } from '@mui/material'
import { AxiosRequestConfig } from 'axios'
import useAxios from 'axios-hooks'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader'
import Table from '../../components/table'
import { RequestsSearchApi, SuccessCallback } from '../../types/custom_types'
import { useIsAuthEnabled } from '../../hooks/useIsAuthEnabled'
import {
  baseSearchApi,
  formatRequests,
  getBaseSearchApi,
  getUrlFromSearchApi,
  tableHeads,
} from './requestsIndexHelpers'

const RequestsIndex = () => {
  const { authIsEnabled } = useIsAuthEnabled()

  const [includeChildren, setIncludeChildren] = useState<boolean>(true)
  const [searchApi, setTheSearchApi] = useState<RequestsSearchApi>(
    baseSearchApi
  )
  const [url, setUrl] = useState<string>('')
  const [config, setConfig] = useState<AxiosRequestConfig>({})

  useEffect(() => {
    setUrl(getUrlFromSearchApi(searchApi))
  }, [searchApi])

  useEffect(() => {
    setTheSearchApi(getBaseSearchApi(includeChildren))
  }, [includeChildren])

  useEffect(() => {
    setConfig({
      url: url,
      method: 'GET',
      withCredentials: authIsEnabled,
    })
  }, [url, authIsEnabled])

  const [{ response }] = useAxios(config, { autoCancel: false })

  const makeFunctionFromCallback = useCallback(
    (successCallback: SuccessCallback) => {
      return () => {
        if (response) {
          successCallback(response)
        }
      }
    },
    [response]
  )

  const apiRequestCall = (
    page: number,
    rowsPerPage: number,
    successCallback: SuccessCallback
  ) => {
    const onSuccess = makeFunctionFromCallback(successCallback)
    onSuccess()
  }

  const setSearchApi = (value: string, id: string, setDateEnd = false) => {
    const intId = parseInt(id)

    if (intId) {
      let newValue = value

      if (intId === 6) {
        // TODO magic number
        const replacedValue = value.replace('T', '+')
        newValue = setDateEnd ? replacedValue + '~' : '~' + replacedValue
      }

      const column = searchApi.columns[intId]

      if (column.search) {
        column.search.value = newValue
        searchApi.columns[intId] = column
      }
    } else if (id === 'draw' || id === 'length' || id === 'start') {
      searchApi[id] = parseInt(value)
    } else if (id === 'include_children') {
      searchApi[id] = 'true' === value
    }
  }

  return (
    <Box>
      <PageHeader title="Requests" description="" />
      <Divider />
      <Box display="flex" alignItems="flex-end">
        <Box>
          <Checkbox
            checked={includeChildren}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setIncludeChildren(event.target.checked)
            }}
          />
          Include Children
        </Box>
      </Box>
      <Table
        parentState={{
          apiDataCall: apiRequestCall,
          setSearchApi: setSearchApi,
          formatData: formatRequests,
          includeChildren: includeChildren,
          includePageNav: true,
          cacheKey: `lastKnown_${window.location.href}`,
          disableSearch: false,
          tableHeads: tableHeads,
        }}
      />
    </Box>
  )
}

export default RequestsIndex
