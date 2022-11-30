import { useMyAxios } from 'hooks/useMyAxios'
import { useEffect, useMemo, useRef } from 'react'
import { ServerConfig } from 'types/config-types'
import { createContainer } from 'unstated-next'

const useServerConfig = () => {
  const { axiosInstance } = useMyAxios()
  const storedConfig = window.localStorage.getItem('config')
  const configDefault = storedConfig
    ? (JSON.parse(storedConfig) as ServerConfig)
    : null
  const config = useRef<ServerConfig | null>(configDefault)

  useEffect(() => {
    axiosInstance
      .get<ServerConfig>('/config', {
        timeout: 1000,
        headers: {
          Accept: 'application/json',
        },
      })
      .then((response) => {
        // window.localStorage.setItem('config', JSON.stringify(response.data))
        config.current = response.data
      })
  }, [axiosInstance])

  const authEnabled = useMemo(() => {
    return config.current?.auth_enabled ?? false
  }, [])

  const debugEnabled = useMemo(() => {
    return config.current?.debug_mode ?? false
  }, [])

  return {
    config: config.current,
    authEnabled,
    debugEnabled,
  }
}

export const ServerConfigContainer = createContainer(useServerConfig)
