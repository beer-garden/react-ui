import { createContext, PropsWithChildren } from 'react'

interface AuthContextType {
  isAuthEnabled: boolean
  userName: string
}

const defaultAuthContext: AuthContextType = {
  isAuthEnabled: false,
  userName: 'anonymous',
}

export const AuthContext = createContext<AuthContextType | null>(null)

const AuthProvider = ({
  children,
}: PropsWithChildren<Record<never, never>>) => {
  return (
    <AuthContext.Provider value={defaultAuthContext}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
