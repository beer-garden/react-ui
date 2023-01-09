import { AuthContainer } from 'containers/AuthContainer'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { DebugContainer } from 'containers/DebugContainer'
import useGardens from 'hooks/useGardens'
import { useSystems } from 'hooks/useSystems'
import useUsers from 'hooks/useUsers'
import { useCallback, useEffect, useState } from 'react'
import { DomainPermission, Garden, Job, System } from 'types/backend-types'
import Cookies from 'universal-cookie'
import { createContainer } from 'unstated-next'

const usePermissions = () => {
  const cookies = new Cookies()
  const { DEBUG_PERMISSION } = DebugContainer.useContainer()
  const { authEnabled } = ServerConfigContainer.useContainer()
  const { user, tokenExpiration } = AuthContainer.useContainer()
  const [globalPerms, setGlobalPerms] = useState<string[] | undefined>(
    cookies.get('globalPerms'),
  )
  const [domainPerms, setDomainPerms] = useState<
    | {
        [key: string]: DomainPermission
      }
    | undefined
  >(cookies.get('domainPerms'))

  const { getGarden } = useGardens()
  const { getSystems } = useSystems()
  const { getUser } = useUsers()

  const resetPerms = useCallback(() => {
    cookies.remove('globalPerms', { path: '/' })
    cookies.remove('domainPerms', { path: '/' })
    setGlobalPerms(undefined)
    setDomainPerms(undefined)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isPermissionsSet = (): boolean => {
    return globalPerms !== undefined && domainPerms !== undefined
  }

  const getUserObj = useCallback(() => {
    if (DEBUG_PERMISSION) {
      console.log('Setting user perms', user)
    }
    if (user) {
      getUser(user).then((response) => {
        cookies.set(
          'globalPerms',
          response.data.permissions.global_permissions,
          { path: '/', expires: tokenExpiration },
        )
        setGlobalPerms(response.data.permissions.global_permissions)
        cookies.set(
          'domainPerms',
          response.data.permissions.domain_permissions,
          { path: '/', expires: tokenExpiration },
        )
        setDomainPerms(response.data.permissions.domain_permissions)
      })
    } else {
      resetPerms()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DEBUG_PERMISSION, getUser, resetPerms, tokenExpiration, user])

  useEffect(() => {
    const storageListener = async (event: WindowEventMap['storage']) => {
      if (event.key === 'LOGOUT') {
        resetPerms()
      } else if (event.key === 'LOGIN') {
        getUserObj()
      }
    }
    window.addEventListener('storage', storageListener)
    getUserObj()
    return () => window.removeEventListener('storage', storageListener)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const basePermissionCheck = (): boolean | undefined => {
    if (DEBUG_PERMISSION) {
      console.log('authEnabled', authEnabled)
      console.log('globalPerms', globalPerms)
      console.log('domainPerms', domainPerms)
    }
    if (!authEnabled) return true
    if (!globalPerms) return false
    if (!domainPerms) return false
    return undefined
  }

  const hasPermission = (permission: string): boolean => {
    const baseCheck = basePermissionCheck()
    if (typeof baseCheck !== 'undefined') {
      return !!baseCheck
    }
    return (
      globalPerms?.includes(permission) ||
      // eslint-disable-next-line no-prototype-builtins
      !!domainPerms?.hasOwnProperty(permission)
    )
  }

  const hasGardenPermission = (permission: string, garden: Garden): boolean => {
    const baseCheck = basePermissionCheck()
    if (typeof baseCheck !== 'undefined') {
      return !!baseCheck
    }
    if (globalPerms?.includes(permission)) {
      return true
    }
    // eslint-disable-next-line no-prototype-builtins
    if (garden.id && domainPerms?.hasOwnProperty(permission)) {
      return domainPerms[permission].garden_ids.includes(garden.id)
    }
    return false
  }

  const hasSystemPermission = async (
    permission: string,
    namespace: string,
    systemId: string,
  ): Promise<boolean> => {
    const baseCheck = basePermissionCheck()
    if (typeof baseCheck !== 'undefined') {
      return !!baseCheck
    }
    if (globalPerms?.includes(permission)) {
      return true
    }
    const response = await getGarden(namespace)
    const garden = response.data
    if (garden && hasGardenPermission(permission, garden)) {
      return true
    }
    // eslint-disable-next-line no-prototype-builtins
    if (domainPerms?.hasOwnProperty(permission)) {
      return domainPerms[permission].system_ids.includes(systemId)
    }
    return false
  }

  const hasJobPermission = async (permission: string, job: Job) => {
    const baseCheck = basePermissionCheck()
    if (typeof baseCheck !== 'undefined') {
      return !!baseCheck
    }
    const response = await getSystems()
    const systems: System[] = response.data
    const foundSystem = systems.find(
      (system) =>
        system.namespace === job.request_template.namespace &&
        system.version === job.request_template.system_version &&
        system.name === job.request_template.system,
    )
    if (foundSystem) {
      const systemPerm = await hasSystemPermission(
        permission,
        job.request_template.namespace,
        foundSystem.id,
      )
      return systemPerm
    }
    return false
  }

  return {
    hasPermission,
    hasGardenPermission,
    hasSystemPermission,
    hasJobPermission,
    isPermissionsSet,
  }
}

export const PermissionsContainer = createContainer(usePermissions)
