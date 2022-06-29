import { useEffect, useState } from 'react'
import { ServerConfig, ServerConfigContainer } from 'containers/ConfigContainer'

const useConfig = () => {
  const { getConfig } = ServerConfigContainer.useContainer()
  const [appConfig, setAppConfig] = useState<ServerConfig>()

  useEffect(() => {
    const fetchData = async () => {
      const data = await getConfig()
      setAppConfig(data)
    }
    fetchData()
  }, [getConfig])

  return appConfig
}

export default useConfig
