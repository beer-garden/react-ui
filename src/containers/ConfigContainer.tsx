import { useMyAxios } from 'hooks/useMyAxios'
import { useEffect, useMemo, useState } from 'react'
import { ServerConfig } from 'types/config-types'
import { createContainer } from 'unstated-next'

const useServerConfig = () => {
  const { axiosInstance } = useMyAxios()
  const [config, setConfig] = useState<ServerConfig | null>(null)

  useEffect(() => {
    axiosInstance
      .get<ServerConfig>('/config', {
        timeout: 1000,
        headers: {
          Accept: 'application/json',
        },
      })
      .then((response) => {
        setConfig(response.data)
      })
  }, [axiosInstance])

  const authEnabled = useMemo(() => {
    return config?.auth_enabled ?? false
  }, [config])

  const debugEnabled = useMemo(() => {
    return config?.debug_mode ?? false
  }, [config])

  return {
    config,
    authEnabled,
    debugEnabled,
  }
}

export const ServerConfigContainer = createContainer(useServerConfig)
