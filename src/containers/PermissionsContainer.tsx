import { AuthContainer } from 'containers/AuthContainer'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { DebugContainer } from 'containers/DebugContainer'
import useGardens from 'hooks/useGardens'
import { useSystems } from 'hooks/useSystems'
import useUsers from 'hooks/useUsers'
import { useCallback, useEffect, useState } from 'react'
import { Garden, Job, System, User } from 'types/backend-types'
import { createContainer } from 'unstated-next'

const usePermissions = () => {
  const { DEBUG_PERMISSION } = DebugContainer.useContainer()
  const { authEnabled } = ServerConfigContainer.useContainer()
  const { user } = AuthContainer.useContainer()
  const [userObj, setUser] = useState<User | null>(null)

  const { getGarden } = useGardens()
  const { getSystems } = useSystems()
  const { getUser } = useUsers()

  const getUserObj = useCallback(() => {
    if (DEBUG_PERMISSION) {
      console.log('Setting userObj:', user)
    }
    if (user) {
      getUser(user).then((response) => {
        setUser(response.data)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DEBUG_PERMISSION, user])

  useEffect(() => {
    const storageListener = async (event: WindowEventMap['storage']) => {
      if (event.key === 'LOGOUT') {
        setUser(null)
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
      console.log('user object', userObj)
    }
    if (!authEnabled) return true
    if (!userObj) return false
    return undefined
  }

  const hasPermission = (permission: string): boolean => {
    const baseCheck = basePermissionCheck()
    if (typeof baseCheck !== 'undefined') {
      return !!baseCheck
    }
    return (
      userObj?.permissions.global_permissions.includes(permission) ||
      // eslint-disable-next-line no-prototype-builtins
      !!userObj?.permissions.domain_permissions.hasOwnProperty(permission)
    )
  }

  const hasGardenPermission = (permission: string, garden: Garden): boolean => {
    const baseCheck = basePermissionCheck()
    if (!userObj || typeof baseCheck !== 'undefined') {
      return !!baseCheck
    }
    if (userObj.permissions.global_permissions.includes(permission)) {
      return true
    }
    const domainPermissions = userObj.permissions.domain_permissions
    // eslint-disable-next-line no-prototype-builtins
    if (garden.id && domainPermissions.hasOwnProperty(permission)) {
      return domainPermissions[permission].garden_ids.includes(garden.id)
    }
    return false
  }

  const hasSystemPermission = async (
    permission: string,
    namespace: string,
    systemId: string,
  ): Promise<boolean> => {
    const baseCheck = basePermissionCheck()
    if (!userObj || typeof baseCheck !== 'undefined') {
      return !!baseCheck
    }
    if (userObj.permissions.global_permissions.includes(permission)) {
      return true
    }
    const response = await getGarden(namespace)
    const garden = response.data
    if (garden && hasGardenPermission(permission, garden)) {
      return true
    }
    const domainPermissions = userObj.permissions.domain_permissions
    // eslint-disable-next-line no-prototype-builtins
    if (domainPermissions.hasOwnProperty(permission)) {
      return domainPermissions[permission].system_ids.includes(systemId)
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
  }
}

export const PermissionsContainer = createContainer(usePermissions)
