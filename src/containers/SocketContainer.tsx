import { DebugContainer } from 'containers/DebugContainer'
import { useEffect, useMemo, useRef } from 'react'
import { createContainer } from 'unstated-next'

type WsCallback = (arg0: MessageEvent['data']) => void
interface CallbackList {
  [key: string]: WsCallback
}

const useSocket = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://'
  const eventUrl =
    protocol + window.location.hostname + ':2337/api/v1/socket/events'
  const ws = useMemo(() => new WebSocket(eventUrl), [eventUrl])

  const cbList = useRef<CallbackList>({})
  const { DEBUG_SOCKET } = DebugContainer.useContainer()

  useEffect(() => {
    /**
     * Emit event to each callback in list upon getting WS message
     * @param message WS event
     */
    ws.onmessage = (message) => {
      const event = JSON.parse(message.data)
      if (DEBUG_SOCKET) console.log('Socket message', event)
      Object.values(cbList.current).forEach((callback: WsCallback) => {
        callback(event)
      })
    }
  }, [DEBUG_SOCKET, ws])

  /**
   * Adds function to list of callbacks, WILL OVERWRITE EXISTING FUNCTION
   * if key already exists in list
   * @param key string Name of cb
   * @param cb function Callback function
   */
  const addCallback = (key: string, cb: WsCallback) => {
    if (DEBUG_SOCKET) console.log(`Adding ${key} socket listener`)
    cbList.current[key] = cb
  }

  const removeCallback = (key: string) => {
    if (cbList.current[key]) {
      if (DEBUG_SOCKET) console.log(`Removing ${key} socket listener`)
      delete cbList.current[key]
    }
  }

  const updateSocketToken = (token: string) => {
    if (token && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ name: 'UPDATE_TOKEN', payload: token }))
    }
  }

  return {
    addCallback,
    removeCallback,
    updateSocketToken,
  }
}

export const SocketContainer = createContainer(useSocket)
