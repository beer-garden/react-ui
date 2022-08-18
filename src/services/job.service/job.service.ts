import { AxiosRequestConfig, AxiosResponse } from 'axios'
import useAxios from 'axios-hooks'
import { useMyAxios } from 'hooks/useMyAxios'
import { formToServerModel } from 'services/job.service/job-service-helpers'
import { Request } from 'types/backend-types'
import { ObjectWithStringKeys, SuccessCallback } from 'types/custom-types'

const JOBS_URL = '/api/v1/jobs'

const useGetJobs = () => {
  const [{ data, error }] = useAxios({
    url: JOBS_URL,
    method: 'get',
    withCredentials: true,
  })

  if (data && !error) {
    return data
  } else {
    console.log('useGetJobs ERROR: ', error)
  }
}

const useJobServices = () => {
  const { axiosInstance, getUseAxios } = useMyAxios()
  const myAxios = getUseAxios()

  const getJobs = (successCallback: SuccessCallback) => {
    axiosInstance.get(JOBS_URL).then((response) => successCallback(response))
  }

  const useGetJob = (successCallback: SuccessCallback, id: string) => {
    const [{ data, error, response }] = myAxios(JOBS_URL + '/' + id)

    if (data && !error) {
      successCallback(response as AxiosResponse)
    }
  }

  const useCreateJob = (
    request: Request,
    data_: ObjectWithStringKeys,
    successCallback: SuccessCallback,
  ) => {
    const config: AxiosRequestConfig = {
      url: JOBS_URL,
      method: 'POST',
      data: formToServerModel(data_, request),
    }

    const [{ data, error, response }] = myAxios(config)

    if (data && !error) {
      successCallback(response as AxiosResponse)
    }
  }

  const usePauseJob = (successCallback: SuccessCallback, id: string) => {
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
      method: 'PATCH',
      data: patchData,
    }

    const [{ data, error, response }] = myAxios(config)

    if (data && !error) {
      successCallback(response as AxiosResponse)
    }
  }

  const useDeleteJob = (callback: VoidFunction, id: string) => {
    const config: AxiosRequestConfig = {
      url: JOBS_URL + '/' + id,
      method: 'DELETE',
    }

    const [{ data, error }] = myAxios(config)

    if (data && !error) {
      callback()
    }
  }

  const useResumeJob = (successCallback: SuccessCallback, id: string) => {
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
      method: 'PATCH',
      data: patchData,
    }
    const useCallback = () => useGetJob(successCallback, id)
    const callback = () => {
      setTimeout(useCallback, 100)
    }

    const [{ data, error }] = myAxios(config)

    if (data && !error) {
      callback()
    }
  }

  return {
    getJobs,
    getJob: useGetJob,
    createJob: useCreateJob,
    pauseJob: usePauseJob,
    deleteJob: useDeleteJob,
    resumeJob: useResumeJob,
  }
}

export { useGetJobs, useJobServices }
