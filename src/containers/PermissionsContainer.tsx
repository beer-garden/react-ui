import { AuthContainer } from 'containers/AuthContainer'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { DebugContainer } from 'containers/DebugContainer'
import useUsers from 'hooks/useUsers'
import { useCallback, useEffect, useState } from 'react'
import { User } from 'types/backend-types'
import { createContainer } from 'unstated-next'

const usePermissions = () => {
  const { DEBUG_PERMISSION } = DebugContainer.useContainer()
  const { authEnabled } = ServerConfigContainer.useContainer()
  const { user } = AuthContainer.useContainer()
  const [userObj, setUser] = useState<User | null>(null)

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
    window.addEventListener(
      'storage',
      async (event: WindowEventMap['storage']) => {
        if (event.key === 'LOGOUT') {
          setUser(null)
        } else if (event.key === 'LOGIN') {
          getUserObj()
        }
      },
    )
    getUserObj()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const hasPermission = (permission: string) => {
    if (DEBUG_PERMISSION) {
      console.log('authEnabled', authEnabled)
      console.log('user object', userObj)
    }
    // True if the user has the permission for any objects at all
    if (!authEnabled) return true
    if (!userObj) return false
    return (
      userObj.permissions.global_permissions.includes(permission) ||
      // eslint-disable-next-line no-prototype-builtins
      userObj.permissions.domain_permissions.hasOwnProperty(permission)
    )
  }

  return {
    hasPermission,
  }
}

export const PermissionsContainer = createContainer(usePermissions)
