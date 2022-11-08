import { renderHook } from '@testing-library/react-hooks'
import WS from 'jest-websocket-mock'
import { SocketProvider } from 'test/testMocks'

import { SocketContainer } from './SocketContainer'

let consoleSpy: jest.SpyInstance

describe('Socket Container', () => {
  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(jest.fn())
  })

  afterEach(() => {
    consoleSpy.mockClear()
  })

  afterAll(() => {
    consoleSpy.mockRestore()
  })

  test('adds function to listener list', () => {
    const mockFn = jest.fn()
    const { result } = renderHook(() => SocketContainer.useContainer(), {
      wrapper: SocketProvider,
    })
    result.current.addCallback('testCB', mockFn)
    expect(consoleSpy).toHaveBeenCalledWith('Adding testCB socket listener')
  })

  test('does not error adding existing function to listener list', () => {
    const mockFn = jest.fn()
    const { result } = renderHook(() => SocketContainer.useContainer(), {
      wrapper: SocketProvider,
    })
    result.current.addCallback('testCB', mockFn)
    result.current.addCallback('testCB', mockFn)
    expect(consoleSpy).toHaveBeenCalledWith('Adding testCB socket listener')
    expect(consoleSpy).toHaveBeenCalledTimes(2)
  })

  test('does not remove non-existent function from listener list if', () => {
    const { result } = renderHook(() => SocketContainer.useContainer(), {
      wrapper: SocketProvider,
    })
    result.current.removeCallback('testCB')
    expect(consoleSpy).not.toHaveBeenCalledWith(
      'Removing testCB socket listener',
    )
  })

  test('removes function from listener list', () => {
    const mockFn = jest.fn()
    const { result } = renderHook(() => SocketContainer.useContainer(), {
      wrapper: SocketProvider,
    })
    result.current.addCallback('testCB', mockFn)
    consoleSpy.mockClear()
    result.current.removeCallback('testCB')
    expect(consoleSpy).toHaveBeenCalledWith('Removing testCB socket listener')
  })

  describe('Websocket Tests', () => {
    let server: WS

    beforeEach(() => {
      server = new WS('ws://localhost:2337/api/v1/socket/events')
    })

    afterEach(() => {
      WS.clean()
    })

    test('calls listeners on message', async () => {
      const testMsg = JSON.stringify({ test: 'This is a test' })
      const mockFn = jest.fn()
      const { result } = renderHook(() => SocketContainer.useContainer(), {
        wrapper: SocketProvider,
      })
      result.current.addCallback('testAdd', mockFn)
      await server.connected
      server.send(testMsg)
      expect(consoleSpy).toHaveBeenCalledWith(
        'Socket message',
        JSON.parse(testMsg),
      )
      expect(mockFn).toHaveBeenCalledWith(JSON.parse(testMsg))
    })

    test('sends token to authenticate', async () => {
      const msg = { name: 'UPDATE_TOKEN', payload: 'valid_token' }
      const msgStr = JSON.stringify(msg)
      const { result } = renderHook(() => SocketContainer.useContainer(), {
        wrapper: SocketProvider,
      })
      await server.connected
      result.current.updateSocketToken(msg.payload)
      await expect(server).toReceiveMessage(msgStr)
      expect(server).toHaveReceivedMessages([msgStr])
    })
  })
})
