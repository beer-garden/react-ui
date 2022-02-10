import axios from 'axios'

import {
  RequestsSearchApi,
  SuccessCallback,
} from '../custom_types/custom_types'

export default class RequestService {
  createRequest(successCallback: SuccessCallback, model: unknown): void {
    axios
      .post('/api/v1/requests', model)
      .then((response) => successCallback(response))
  }

  getRequests(
    successCallback: SuccessCallback,
    searchApi: RequestsSearchApi
  ): void {
    let url = '/api/v1/requests?'
    for (const key in searchApi) {
      if (key === 'columns' || key === 'order') {
        for (const columnsKey in searchApi[key]) {
          url = url
            .concat(key)
            .concat('=')
            .concat(JSON.stringify(searchApi[key][columnsKey]))
            .concat('&')
        }
      } else if (key === 'search') {
        url = url.concat(key).concat('=').concat(JSON.stringify(searchApi[key]))
      } else if (
        key === 'draw' ||
        key === 'include_children' ||
        key === 'length' ||
        key === 'start'
      ) {
        url = url + key + '=' + JSON.stringify(searchApi[key])
      }
      if (key !== 'start' && key !== 'columns' && key !== 'order') {
        url = url.concat('&')
      }
    }
    let pieces = url.split('{')
    url = pieces.join('%7B')
    pieces = url.split('}')
    url = pieces.join('%7D') + '&timestamp=' + new Date().getTime().toString()
    axios.get(url).then((response) => {
      successCallback(response)
    })
  }

  getRequest(successCallback: SuccessCallback, id: string): void {
    const url = '/api/v1/requests/'.concat(id)
    axios.get(url).then((response) => {
      successCallback(response)
    })
  }
}
