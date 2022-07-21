import useAxios from 'axios-hooks'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useEffect, useState } from 'react'

const useNamespace = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const [namespaces, setNamespaces] = useState<string[]>([])
  const [{ data: namespaceData, error: namespaceError }] = useAxios({
    url: '/api/v1/namespaces',
    method: 'GET',
    withCredentials: authEnabled,
  })

  useEffect(() => {
    if (namespaceData && !namespaceError) {
      setNamespaces(namespaceData)
    }
  }, [namespaceData, namespaceError])

  return namespaces
}

export default useNamespace
