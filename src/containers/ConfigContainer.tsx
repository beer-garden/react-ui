import { useMyAxios } from 'hooks/useMyAxios'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ServerConfig } from 'types/config-types'
import { createContainer } from 'unstated-next'

const useServerConfig = () => {
  const { axiosInstance } = useMyAxios()
  const [config, setConfig] = useState<ServerConfig | null>(null)

  const getConfig = useCallback(async () => {
    const { data } = await axiosInstance.get<ServerConfig>('/config', {
      timeout: 1000,
      headers: {
        Accept: 'application/json',
      },
    })

    setConfig(data)
    return data
  }, [axiosInstance])

  useEffect(() => {
    getConfig()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const authEnabled = useMemo(() => {
    return config?.auth_enabled ?? false
  }, [config])

  const debugEnabled = useMemo(() => {
    return config?.debug_mode ?? false
  }, [config])

  return {
    config,
    getConfig,
    authEnabled,
    debugEnabled,
  }
}

export const ServerConfigContainer = createContainer(useServerConfig)
