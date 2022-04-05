import * as React from 'react'

interface AuthContextType {
  isAuthEnabled: boolean
  userName: string
}

const defaultAuthContext: AuthContextType = {
  isAuthEnabled: false,
  userName: 'anonymous',
}

export const AuthContext = React.createContext<AuthContextType | null>(null)

const AuthProvider = ({
  children,
}: React.PropsWithChildren<Record<never, never>>) => {
  return (
    <AuthContext.Provider value={defaultAuthContext}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
