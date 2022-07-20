import { useMyAxios } from 'hooks/useMyAxios'
import { useCallback, useState } from 'react'
import { BlockedCommand, BlockedList } from 'types/custom_types'

export const useBlockList = () => {
  const [blockList, setList] = useState<BlockedList>()
  const { axiosInstance } = useMyAxios()

  const getList = useCallback(async () => {
    const { data } = await axiosInstance.get<BlockedList>(
      '/api/v1/commandpublishingblocklist',
    )
    setList(data)
    return data
  }, [setList, axiosInstance])

  const getBlockList = () => {
    if (blockList) {
      return blockList.command_publishing_blocklist
    } else {
      getList().then((bList) => {
        return bList.command_publishing_blocklist
      })
    }
  }

  const deleteBlockList = (id: string) => {
    if (blockList) {
      const indx = (
        blockList.command_publishing_blocklist as BlockedCommand[]
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
    return blockList?.command_publishing_blocklist
  }

  const addBlockList = (command: BlockedCommand[]) => {
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
    return blockList
  }

  return {
    list: blockList?.command_publishing_blocklist,
    getBlockList,
    deleteBlockList,
    addBlockList,
  }
}
