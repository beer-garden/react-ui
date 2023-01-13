import { AxiosPromise, AxiosRequestConfig } from 'axios'
import useAxios from 'axios-hooks'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useMyAxios } from 'hooks/useMyAxios'
import { useCallback } from 'react'
import { BlockedCommand, BlockedList } from 'types/backend-types'
import { CommandIndexTableData } from 'types/custom-types'

const useBlockList = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const { axiosManualOptions } = useMyAxios()
  const [{ error }, execute] = useAxios({}, axiosManualOptions)

  const getBlockList = useCallback((): AxiosPromise<BlockedList> => {
    const config: AxiosRequestConfig = {
      url: '/api/v1/commandpublishingblocklist',
      method: 'get',
      withCredentials: authEnabled,
    }
    return execute(config)
  }, [authEnabled, execute])

  const deleteBlockList = useCallback(
    (id: string): AxiosPromise<BlockedCommand> => {
      const config: AxiosRequestConfig = {
        url: `/api/v1/commandpublishingblocklist/${id}`,
        method: 'delete',
        withCredentials: authEnabled,
      }
      return execute(config)
    },
    [authEnabled, execute],
  )

  const addBlockList = useCallback(
    (command: CommandIndexTableData[]): AxiosPromise<BlockedList> => {
      const config: AxiosRequestConfig<{
        command_publishing_blocklist: CommandIndexTableData[]
      }> = {
        url: '/api/v1/commandpublishingblocklist',
        method: 'post',
        withCredentials: authEnabled,
        data: {
          command_publishing_blocklist: command,
        },
      }
      return execute(config)
    },
    [authEnabled, execute],
  )

  return { getBlockList, error, deleteBlockList, addBlockList }
}

export { useBlockList }
