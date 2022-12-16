import { AxiosPromise, AxiosRequestConfig } from 'axios'
import useAxios from 'axios-hooks'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useMyAxios } from 'hooks/useMyAxios'
import { Job, PatchOperation } from 'types/backend-types'
import { EmptyObject } from 'types/custom-types'

const JOBS_URL = '/api/v1/jobs'

const useJobs = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const { axiosManualOptions } = useMyAxios()
  const [, execute] = useAxios({}, axiosManualOptions)

  const getJobs = (): AxiosPromise<Job[]> => {
    const config: AxiosRequestConfig = {
      url: JOBS_URL,
      method: 'get',
      withCredentials: authEnabled,
    }
    return execute(config)
  }

  const getJob = (id: string): AxiosPromise<Job> => {
    const config: AxiosRequestConfig = {
      url: `${JOBS_URL}/${id}`,
      method: 'get',
      withCredentials: authEnabled,
    }
    return execute(config)
  }

  const importJobs = (fileData: string): AxiosPromise<{ ids: string[] }> => {
    const config: AxiosRequestConfig<string> = {
      url: '/api/v1/import/jobs',
      method: 'POST',
      data: fileData,
      withCredentials: authEnabled,
    }
    return execute(config)
  }

  const exportJobs = (): AxiosPromise<Job[]> => {
    const config: AxiosRequestConfig = {
      url: '/api/v1/export/jobs',
      method: 'POST',
      withCredentials: authEnabled,
    }
    return execute(config)
  }

  const pauseJob = (id: string): AxiosPromise<Job> => {
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
  }

  const deleteJob = (id: string): AxiosPromise<EmptyObject> => {
    const config: AxiosRequestConfig = {
      url: `${JOBS_URL}/${id}`,
      method: 'DELETE',
      withCredentials: authEnabled,
    }
    return execute(config)
  }

  const resumeJob = (id: string): AxiosPromise<Job> => {
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
  }

  const runAdHoc = (
    id: string,
    resetInterval: boolean,
  ): AxiosPromise<EmptyObject> => {
    const config: AxiosRequestConfig<boolean> = {
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
    exportJobs,
    importJobs,
    pauseJob,
    deleteJob,
    resumeJob,
    runAdHoc,
  }
}

export { useJobs }
