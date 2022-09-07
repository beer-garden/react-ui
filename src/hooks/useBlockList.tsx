import useAxios from 'axios-hooks'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useMyAxios } from 'hooks/useMyAxios'
import { useEffect, useState } from 'react'
import { BlockedCommand, BlockedList } from 'types/backend-types'
import { CommandIndexTableData } from 'types/custom-types'

export const useBlockList = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const [blockList, setList] = useState<BlockedCommand[]>([])
  const { axiosInstance } = useMyAxios()

  const getList = () => {
    axiosInstance
      .get<BlockedList>('/api/v1/commandpublishingblocklist')
      .then((resolved) => {
        if (resolved) setList(resolved.data.command_publishing_blocklist)
      })
  }

  const [{ data, error }] = useAxios({
    url: '/api/v1/commandpublishingblocklist',
    method: 'get',
    withCredentials: authEnabled,
  })

  useEffect(() => {
    if (data && !error) setList(data.command_publishing_blocklist)
  }, [data, error, setList])

  const deleteBlockList = (id: string) => {
    if (blockList) {
      const indx = blockList.findIndex((elem) => elem.id === id)
      blockList.splice(indx, 1)
    }
    axiosInstance
      .delete<BlockedList>(`/api/v1/commandpublishingblocklist/${id}`)
      .then((resolved) => {
        if (resolved) getList()
      })
      .catch((e) => console.error('Error removing from Blocklist: ', e))
    return blockList
  }

  const addBlockList = (command: CommandIndexTableData[]) => {
    axiosInstance
      .post<BlockedList>(
        '/api/v1/commandpublishingblocklist',
        {
          command_publishing_blocklist: command,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then((resolved) => {
        if (resolved) getList()
      })
      .catch((e) => console.error('Error adding to Blocklist: ', e))
    return blockList
  }

  return {
    blockList,
    deleteBlockList,
    addBlockList,
  }
}
