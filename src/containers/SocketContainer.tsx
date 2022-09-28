import { useEffect, useRef } from 'react'
import { createContainer } from 'unstated-next'

const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://'
const eventUrl =
  protocol + window.location.hostname + ':2337/api/v1/socket/events/'
const ws = new WebSocket(eventUrl)

type WsCallback = (arg0: MessageEvent['data']) => void
interface CallbackList {
  [key: string]: WsCallback
}

const useSocket = () => {
  const cbList = useRef<CallbackList>({})

  useEffect(() => {
    /**
     * Emit event to each callback in list upon getting WS message
     * @param message WS event
     */
    ws.onmessage = (message) => {
      const event = JSON.parse(message.data)
      Object.values(cbList.current).forEach((callback: WsCallback) => {
        callback(event)
      })
    }
  }, [])

  /**
   * Adds function to list of callbacks, WILL OVERWRITE EXISTING FUNCTION
   * if key already exists in list
   * @param key string Name of cb
   * @param cb function Callback function
   */
  const addCallback = (key: string, cb: WsCallback) => {
    cbList.current[key] = cb
  }

  const removeCallback = (key: string) => {
    if (cbList.current[key]) {
      delete cbList.current[key]
    }
  }

  const updateToken = (token: string) => {
    if (token && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ name: 'UPDATE_TOKEN', payload: token }))
    }
  }

  return {
    addCallback,
    removeCallback,
    updateToken,
  }
}

export const SocketContainer = createContainer(useSocket)
