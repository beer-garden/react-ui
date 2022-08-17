import { useMyAxios } from 'hooks/useMyAxios'
import { useCallback, useState } from 'react'
import { BlockedList, CommandBase } from 'types/custom_types'

export const useBlockList = () => {
  const [blockList, setList] = useState<BlockedList>({
    command_publishing_blocklist: [],
  })
  const { axiosInstance } = useMyAxios()

  const getList = useCallback(async () => {
    const { data } = await axiosInstance.get<BlockedList>(
      '/api/v1/commandpublishingblocklist',
    )
    setList(data)
    return data
  }, [setList, axiosInstance])

  const getBlockList = () => {
    if (blockList.command_publishing_blocklist.length > 0) {
      return blockList.command_publishing_blocklist
    } else {
      getList()
      return []
    }
  }

  const deleteBlockList = (id: string) => {
    if (blockList) {
      const indx = (
        blockList.command_publishing_blocklist as CommandBase[]
      ).findIndex((elem) => {
        return elem.id === id
      })
      blockList.command_publishing_blocklist.splice(indx, 1)
    }
    axiosInstance
      .delete<BlockedList>(`/api/v1/commandpublishingblocklist/${id}`)
      .then((resolved) => {
        if (resolved) getList()
      })
    return blockList.command_publishing_blocklist
  }

  const addBlockList = (command: CommandBase[]) => {
    axiosInstance
      .post<BlockedList>(
        '/api/v1/commandpublishingblocklist/',
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
    list: blockList.command_publishing_blocklist,
    getBlockList,
    deleteBlockList,
    addBlockList,
  }
}
