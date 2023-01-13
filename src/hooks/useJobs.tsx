import { AxiosPromise, AxiosRequestConfig } from 'axios'
import useAxios from 'axios-hooks'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useMyAxios } from 'hooks/useMyAxios'
import { useCallback } from 'react'
import { Job, PatchOperation } from 'types/backend-types'
import { EmptyObject } from 'types/custom-types'

const JOBS_URL = '/api/v1/jobs'

const useJobs = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const { axiosManualOptions } = useMyAxios()
  const [, execute] = useAxios({}, axiosManualOptions)

  const getJobs = useCallback((): AxiosPromise<Job[]> => {
    const config: AxiosRequestConfig = {
      url: JOBS_URL,
      method: 'get',
      withCredentials: authEnabled,
    }
    return execute(config)
  }, [authEnabled, execute])

  const getJob = useCallback(
    (id: string): AxiosPromise<Job> => {
      const config: AxiosRequestConfig = {
        url: `${JOBS_URL}/${id}`,
        method: 'get',
        withCredentials: authEnabled,
      }
      return execute(config)
    },
    [authEnabled, execute],
  )

  const importJobs = useCallback(
    (fileData: string): AxiosPromise<{ ids: string[] }> => {
      const config: AxiosRequestConfig<string> = {
        url: '/api/v1/import/jobs',
        method: 'POST',
        data: fileData,
        withCredentials: authEnabled,
      }
      return execute(config)
    },
    [authEnabled, execute],
  )

  const exportJobs = useCallback((): AxiosPromise<Job[]> => {
    const config: AxiosRequestConfig = {
      url: '/api/v1/export/jobs',
      method: 'POST',
      withCredentials: authEnabled,
    }
    return execute(config)
  }, [authEnabled, execute])

  const pauseJob = useCallback(
    (id: string): AxiosPromise<Job> => {
      const patchData = {
        operations: [
          {
            operation: 'update',
            path: '/status',
            value: 'PAUSED',
          },
        ],
      }
      const config: AxiosRequestConfig<PatchOperation> = {
        url: `${JOBS_URL}/${id}`,
        method: 'patch',
        data: patchData,
        withCredentials: authEnabled,
      }
      return execute(config)
    },
    [authEnabled, execute],
  )

  const deleteJob = useCallback(
    (id: string): AxiosPromise<EmptyObject> => {
      const config: AxiosRequestConfig = {
        url: `${JOBS_URL}/${id}`,
        method: 'DELETE',
        withCredentials: authEnabled,
      }
      return execute(config)
    },
    [authEnabled, execute],
  )

  const resumeJob = useCallback(
    (id: string): AxiosPromise<Job> => {
      const patchData = {
        operations: [
          {
            operation: 'update',
            path: '/status',
            value: 'RUNNING',
          },
        ],
      }
      const config: AxiosRequestConfig<PatchOperation> = {
        url: `${JOBS_URL}/${id}`,
        method: 'patch',
        data: patchData,
        withCredentials: authEnabled,
      }
      return execute(config)
    },
    [authEnabled, execute],
  )

  const runAdHoc = useCallback(
    (id: string, resetInterval: boolean): AxiosPromise<EmptyObject> => {
      const config: AxiosRequestConfig<boolean> = {
        url: `${JOBS_URL}/${id}/execute`,
        method: 'POST',
        data: resetInterval,
        withCredentials: authEnabled,
      }

      return execute(config)
    },
    [authEnabled, execute],
  )

  return {
    getJobs,
    getJob,
    exportJobs,
    importJobs,
    pauseJob,
    deleteJob,
    resumeJob,
    runAdHoc,
  }
}

export { useJobs }
