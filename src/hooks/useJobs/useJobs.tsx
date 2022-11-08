import { AxiosRequestConfig } from 'axios'
import useAxios from 'axios-hooks'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { formToServerModel } from 'hooks/useJobs/use-jobs-helpers'
import { useMyAxios } from 'hooks/useMyAxios'
import { Job, Request } from 'types/backend-types'
import { ObjectWithStringKeys, SuccessCallback } from 'types/custom-types'

const JOBS_URL = '/api/v1/jobs'

const useJobs = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const { axiosManualOptions } = useMyAxios()
  const [, execute] = useAxios({}, axiosManualOptions)

  const getJobs = () => {
    // TODO: get rid of callbacks for all of these and just return the Promises
    const config: AxiosRequestConfig<Job[]> = {
      url: JOBS_URL,
      method: 'get',
      withCredentials: authEnabled,
    }
    return execute(config)
  }

  const getJob = (successCallback: SuccessCallback, id: string) => {
    const config: AxiosRequestConfig<Job> = {
      url: JOBS_URL + '/' + id,
      method: 'get',
      withCredentials: authEnabled,
    }

    execute(config).then((response) => successCallback(response))
  }

  const createJob = (
    request: Request,
    data: ObjectWithStringKeys,
    successCallback: SuccessCallback,
  ) => {
    const config: AxiosRequestConfig = {
      url: JOBS_URL,
      method: 'POST',
      data: formToServerModel(data, request),
      withCredentials: authEnabled,
    }

    execute(config).then((response) => successCallback(response))
  }

  const importJobs = (fileData: string) => {
    const config: AxiosRequestConfig = {
      url: '/api/v1/import/jobs',
      method: 'POST',
      data: fileData,
      withCredentials: authEnabled,
    }
    return execute(config)
  }

  const exportJobs = () => {
    const config: AxiosRequestConfig = {
      url: '/api/v1/export/jobs',
      method: 'POST',
      withCredentials: authEnabled,
    }
    return execute(config)
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

  return {
    getJobs,
    getJob,
    exportJobs,
    importJobs,
    createJob,
    pauseJob,
    deleteJob,
    resumeJob,
  }
}

export { useJobs }
