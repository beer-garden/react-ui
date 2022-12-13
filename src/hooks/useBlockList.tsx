import { AxiosPromise, AxiosRequestConfig } from 'axios'
import useAxios from 'axios-hooks'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useMyAxios } from 'hooks/useMyAxios'
import { BlockedCommand, BlockedList } from 'types/backend-types'
import { CommandIndexTableData } from 'types/custom-types'

const useBlockList = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const { axiosManualOptions } = useMyAxios()
  const [, execute] = useAxios({}, axiosManualOptions)

  const getBlockList = (): AxiosPromise<BlockedList> => {
    const config: AxiosRequestConfig = {
      url: '/api/v1/commandpublishingblocklist',
      method: 'get',
      withCredentials: authEnabled,
    }
    return execute(config)
  }

  const deleteBlockList = (id: string): AxiosPromise<BlockedCommand> => {
    const config: AxiosRequestConfig = {
      url: `/api/v1/commandpublishingblocklist/${id}`,
      method: 'delete',
      withCredentials: authEnabled,
    }
    return execute(config)
  }

  const addBlockList = (
    command: CommandIndexTableData[],
  ): AxiosPromise<BlockedList> => {
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
  }

  return { getBlockList, deleteBlockList, addBlockList }
}

export { useBlockList }
