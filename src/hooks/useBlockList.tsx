import useAxios from 'axios-hooks'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useMyAxios } from 'hooks/useMyAxios'
import { useEffect, useState } from 'react'
import { BlockedCommand, BlockedList } from 'types/backend-types'
import { CommandIndexTableData } from 'types/custom-types'

const useBlockList = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const [blockList, setBlocklist] = useState<BlockedCommand[]>([])
  const [{ data, error }] = useAxios({
    url: '/api/v1/commandpublishingblocklist',
    method: 'get',
    withCredentials: authEnabled,
  })
  const { axiosManualOptions } = useMyAxios()
  const [, execute] = useAxios({}, axiosManualOptions)

  useEffect(() => {
    if (data && !error) setBlocklist(data.command_publishing_blocklist)
  }, [data, error])

  const getBlocklist = () => {
    execute({
      url: '/api/v1/commandpublishingblocklist',
      method: 'get',
      withCredentials: authEnabled,
    })
      .then((resolved) => {
        if (resolved) {
          setBlocklist(resolved.data.command_publishing_blocklist)
        }
      })
      .catch((e) => console.error('Error removing from Blocklist: ', e))
  }

  const deleteBlockList = (id: string) => {
    if (blockList) {
      const indx = blockList.findIndex((elem) => elem.id === id)
      blockList.splice(indx, 1)
    }

    execute({
      url: `/api/v1/commandpublishingblocklist/${id}`,
      method: 'delete',
      withCredentials: authEnabled,
    })
      .then((resolved) => {
        if (resolved) getBlocklist()
      })
      .catch((e) => console.error('Error removing from Blocklist: ', e))

    return blockList
  }

  const addBlockList = (command: CommandIndexTableData[]) => {
    execute({
      url: '/api/v1/commandpublishingblocklist',
      method: 'post',
      withCredentials: authEnabled,
      data: {
        command_publishing_blocklist: command,
      },
    })
      .then((resolved) => {
        if (resolved) getBlocklist()
      })
      .catch((e) => console.error('Error adding to Blocklist: ', e))

    return blockList
  }

  return { blockList, deleteBlockList, addBlockList }
}

export { useBlockList }
