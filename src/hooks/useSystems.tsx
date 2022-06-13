import useAxios from 'axios-hooks'
import { useEffect, useState } from 'react'
import { System } from 'types/custom_types'
import { ServerConfigContainer } from 'containers/ConfigContainer'

const useSystems = <T,>(mapper: (system: System) => T) => {
  const [systems, setSystems] = useState<T[]>([])
  const { authEnabled } = ServerConfigContainer.useContainer()
  const [{ data, error }] = useAxios({
    url: '/api/v1/systems',
    method: 'GET',
    withCredentials: authEnabled(),
  })

  useEffect(() => {
    if (data && !error) {
      setSystems(data.map(mapper))
    }
  }, [data, error, mapper])

  return systems
}

export default useSystems
