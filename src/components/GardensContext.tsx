import { useMountedState } from 'hooks/useMountedState'
import { createContext, ReactNode, useContext } from 'react'
import { Garden } from 'types/backend-types'

interface GardensProviderProps {
  children: ReactNode
}

export interface GardensProviderState {
  gardens: Garden[] | undefined
  setGardens: ((arg0: Garden[] | undefined) => void) | undefined
}

export const emptyGardensProviderState: GardensProviderState =
  {
    gardens: undefined,
    setGardens: undefined,
  }

const GardensContext =
  createContext<GardensProviderState>(
    emptyGardensProviderState,
  )

const GardensProvider = ({
  children,
}: GardensProviderProps) => {
  const [gardens, setGardens] = useMountedState<Garden[] | undefined>()

  const value: GardensProviderState = {
    gardens,
    setGardens,
  }
  return (
    <GardensContext.Provider value={value}>
      {children}
    </GardensContext.Provider>
  )
}

const useGardensContext = () => {
  const context = useContext(GardensContext)
  if (context === undefined) {
    throw new Error(
      'useGardensContext requires a GardensProvider',
    )
  }

  return context
}

export {
  GardensContext,
  GardensProvider,
  useGardensContext,
}