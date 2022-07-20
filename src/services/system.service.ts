import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { useMyAxios } from 'hooks/useMyAxios'
import { Command, SuccessCallback, System } from 'types/custom_types'

const getSystem = (
  systems: System[],
  namespace: string,
  name: string,
  version: string,
) => {
  return systems.find(function (system: System) {
    return (
      system['name'] === name &&
      system['version'] === version &&
      system['namespace'] === namespace
    )
  })
}

const sortSystemsVersion = (systems: System[]) => {
  systems.sort((a, b) => (a.version > b.version ? -1 : 1))
  return systems
}

const filterSystems = (
  systems: System[],
  params: {
    name?: string | undefined
    namespace?: string | undefined
    version?: string | undefined
  },
) => {
  if (params.name) {
    systems = systems.filter(function (system: System) {
      return system['name'] === params.name
    })
  }
  if (params.namespace) {
    systems = systems.filter(function (system: System) {
      return system['namespace'] === params.namespace
    })
  }
  if (params.version) {
    systems = systems.filter(function (system: System) {
      return system['version'] === params.version
    })
  }
  return systems
}

const getSystemAndCommand = (
  systems: System[],
  namespace: string,
  system_name: string,
  command_name: string,
  version: string,
) => {
  const system = getSystem(systems, namespace, system_name, version)
  if (system) {
    const command = getCommand(system.commands, command_name)
    return { system: system, command: command }
  }
  return { system: system, command: undefined }
}

const getCommand = (commands: Command[], name: string) => {
  return commands.find(function (command: Command) {
    return command['name'] === name
  })
}

const SYSTEMS_URL = '/api/v1/systems'

const useSystemServices = () => {
  const { getUseAxios } = useMyAxios()
  const useAxios = getUseAxios()

  const useGetSystems = (successCallback: SuccessCallback) => {
    const url = SYSTEMS_URL
    const [{ data, error, response }] = useAxios(url)

    if (data && !error) {
      successCallback(response as AxiosResponse)
    }
  }

  const useReloadSystem = (system_id: string) => {
    const patchData = { operation: 'reload', path: '', value: '' }
    const config: AxiosRequestConfig = {
      url: SYSTEMS_URL + '/' + system_id,
      method: 'PATCH',
      data: patchData,
    }

    useAxios(config)
  }

  const useDeleteSystem = (system_id: string) => {
    useAxios(SYSTEMS_URL + '/' + system_id)
  }

  return {
    getSystems: useGetSystems,
    reloadSystem: useReloadSystem,
    deleteSystem: useDeleteSystem,
  }
}

// const item = new SystemsService()

// export default item
export {
  filterSystems,
  getSystem,
  getSystemAndCommand,
  sortSystemsVersion,
  useSystemServices,
}
