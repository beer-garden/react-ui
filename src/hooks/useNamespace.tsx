import useAxios from 'axios-hooks'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useEffect, useState } from 'react'

const useNamespace = () => {
  // TODO: convert this to return a function that returns a Promise
  const { authEnabled } = ServerConfigContainer.useContainer()
  const [namespaces, setNamespaces] = useState<string[]>([])
  const [{ data: namespaceData, error: namespaceError }] = useAxios({
    url: '/api/v1/namespaces',
    method: 'get',
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
