// import axios from 'axios'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { useMyAxios } from 'hooks/useMyAxios'
import { SuccessCallback } from 'types/custom_types'

// class NamespaceService {
//   getNamespaces (successCallback: SuccessCallback) {
//     axios
//       .get('/api/v1/namespaces?timestamp=' + new Date().getTime().toString())
//       .then((response) => successCallback(response))
//   }
// }

// const item = new NamespaceService()

// export default item

const useNamespaceServices = () => {
  const { getUseAxios } = useMyAxios()
  const useAxios = getUseAxios()

  const useGetNamespaces = (successCallback: SuccessCallback) => {
    const now = new Date().getTime().toString()
    const config: AxiosRequestConfig = {
      url: '/api/v1/namespaces',
      params: { timestamp: now },
    }
    const [{ data, error, response }] = useAxios(config)

    if (data && !error) {
      successCallback(response as AxiosResponse)
    }
  }

  return { getNamespaces: useGetNamespaces }
}

export default useNamespaceServices
