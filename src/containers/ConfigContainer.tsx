import { useCallback, useState } from 'react'
import { createContainer } from 'unstated-next'
import { useMyAxios } from 'hooks/useMyAxios'

export interface ServerConfig {
  application_name: string
  auth_enabled: boolean
  trusted_header_auth_enabled: boolean
  icon_default: string
  debug_mode: boolean
  execute_javascript: boolean
  garden_name: string
  metrics_url: string
  url_prefix: string
}

const useServerConfig = () => {
  const { axiosInstance } = useMyAxios()
  const [config, _setConfig] = useState<ServerConfig | null>(null)

  async function getConfig() {
    console.log('Calling /config!')
    const { data } = await axiosInstance.get<ServerConfig>('/config', {
      timeout: 1000,
      headers: {
        Accept: 'application/json',
      },
    })

    console.log(
      'config AUTH_ENABLED: ',
      data.auth_enabled ? 'yes' : String(data.auth_enabled),
    )
    console.log(
      'config DEBUG_MODE: ',
      data.debug_mode ? 'yes' : String(data.debug_mode),
    )
    _setConfig(data)
    return data
  }

  const authEnabled = useCallback(() => {
    return config?.auth_enabled ?? false
  }, [config])

  const debugEnabled = useCallback(() => {
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
