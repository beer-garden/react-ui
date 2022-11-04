import { AxiosRequestConfig } from 'axios'
import useAxios from 'axios-hooks'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useMyAxios } from 'hooks/useMyAxios'
import { Job } from 'types/backend-types'
import { SuccessCallback } from 'types/custom-types'

const JOBS_URL = '/api/v1/jobs'

const useJobs = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const { axiosManualOptions } = useMyAxios()
  const [, execute] = useAxios({}, axiosManualOptions)

  const getJobs = (successCallback: SuccessCallback) => {
    // TODO: get rid of callbacks for all of these and just return the Promises
    const config: AxiosRequestConfig<Job[]> = {
      url: JOBS_URL,
      method: 'get',
      withCredentials: authEnabled,
    }
    execute(config).then((response) => successCallback(response))
  }

  const getJob = (successCallback: SuccessCallback, id: string) => {
    const config: AxiosRequestConfig<Job> = {
      url: JOBS_URL + '/' + id,
      method: 'get',
      withCredentials: authEnabled,
    }

    execute(config).then((response) => successCallback(response))
  }

  const pauseJob = (successCallback: SuccessCallback, id: string) => {
    const patchData = {
      operations: [
        {
          operation: 'update',
          path: '/status',
          value: 'PAUSED',
        },
      ],
    }
    const config: AxiosRequestConfig = {
      url: JOBS_URL + '/' + id,
      method: 'patch',
      data: patchData,
      withCredentials: authEnabled,
    }

    execute(config).then((response) => successCallback(response))
  }

  const deleteJob = (callback: VoidFunction, id: string) => {
    const config: AxiosRequestConfig = {
      url: JOBS_URL + '/' + id,
      method: 'DELETE',
      withCredentials: authEnabled,
    }

    execute(config).then(() => callback())
  }

  const resumeJob = (successCallback: SuccessCallback, id: string) => {
    const patchData = {
      operations: [
        {
          operation: 'update',
          path: '/status',
          value: 'RUNNING',
        },
      ],
    }
    const config: AxiosRequestConfig = {
      url: JOBS_URL + '/' + id,
      method: 'patch',
      data: patchData,
      withCredentials: authEnabled,
    }

    execute(config).then(() => {
      const callback = () => {
        setTimeout(() => getJob(successCallback, id), 100)
      }
      callback()
    })
  }

  const runAdHoc = (id: string, resetInterval: boolean) => {
    const config: AxiosRequestConfig = {
      url: `${JOBS_URL}/${id}/execute`,
      method: 'POST',
      data: resetInterval,
      withCredentials: authEnabled,
    }

    return execute(config)
  }

  return {
    getJobs,
    getJob,
    pauseJob,
    deleteJob,
    resumeJob,
    runAdHoc,
  }
}

export { useJobs }
