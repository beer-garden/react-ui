import { useCallback, useState, useEffect } from 'react'
import { createContainer } from 'unstated-next'
import { useNavigate } from 'react-router-dom'
import { TokenResponse, useToken } from 'hooks/useToken'
import { useMyAxios } from 'hooks/useMyAxios'

enum AuthEvents {
  LOGOUT = 'LOGOUT',
  LOGIN = 'LOGIN',
}

export interface UserBase {
  username: string
  password: string
}

export interface User extends UserBase {
  _id: string
  // role: 'user' | 'admin'  // TODO
}

const useAuth = () => {
  const { axiosInstance } = useMyAxios()
  const navigate = useNavigate()
  const [user, _setUser] = useState<string | null>(null)
  const onTokenRefreshRequired = useCallback(refresh, [refresh])

  const setUser = (userName: string | null) => {
    _setUser(userName)
  }

  const onTokenInvalid = useCallback(() => { setUser(null) }, [])

  const { clearToken, setToken, isAuthenticated, getRefreshToken } = useToken(
    onTokenInvalid,
    onTokenRefreshRequired,
  )

  async function refresh() {
    const {
      data: { access, refresh },
    } = await axiosInstance.post<TokenResponse>('/api/v1/token/refresh', {
      refresh: getRefreshToken(),
    })

    console.log('NEW ACCESS', access)
    console.log('NEW REFRESH', refresh)

    setToken({ access, refresh })
  }

  useEffect(() => {
    window.addEventListener(
      'storage',
      async (event: WindowEventMap['storage']) => {
        if (event.key === AuthEvents.LOGOUT && isAuthenticated()) {
          clearToken()
          setUser(null)
        } else if (event.key === AuthEvents.LOGIN) {
          onTokenRefreshRequired()
        }
      },
    )
  }, [clearToken, isAuthenticated, onTokenRefreshRequired])

  const logout = useCallback(() => {
    clearToken()
    setUser(null)
    navigate('/')
  }, [navigate, clearToken])

  const login = useCallback(
    async (username: string, password: string) => {
      const {
        data: { access, refresh },
      } = await axiosInstance.post<TokenResponse>('/api/v1/token', {
        username,
        password,
      })
      console.log(
        'login SETTING ACCESS TOKEN: ',
        access ? 'yes' : String(access),
      )
      console.log(
        'login SETTING REFRESH TOKEN: ',
        refresh ? 'yes' : String(refresh),
      )
      console.log(
        'login SETTING USER NAME: ',
        username ? username : 'No user name',
      )
      setUser(username)
      setToken({ access, refresh })

      window.localStorage.setItem(AuthEvents.LOGIN, new Date().toISOString())
      console.log('DONE WITH LOGIN')
    },
    [setToken, axiosInstance],
  )

  return {
    user,
    setUser,
    login,
    logout,
    refreshToken: onTokenRefreshRequired,
    isAuthenticated,
  }
}

export const AuthContainer = createContainer(useAuth)
