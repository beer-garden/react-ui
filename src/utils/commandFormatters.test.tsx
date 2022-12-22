import {
  TSystem,
  TSystem2,
  TSystem3,
  TSystemCommand,
  TSystemCommand2,
  TSystemCommand3,
} from 'test/system-test-values'

import { commandsFromSystems } from './commandFormatters'

describe('commandFormatters', () => {
  describe('commandsFromSystems', () => {
    test('gets all commands from all systems', () => {
      const result = commandsFromSystems([TSystem, TSystem2, TSystem3])
      expect(result).toMatchObject([
        TSystemCommand,
        TSystemCommand2,
        TSystemCommand3,
      ])
    })

    test('gets all commands matching version', () => {
      const result = commandsFromSystems(
        [TSystem, TSystem2, TSystem3],
        false,
        undefined,
        undefined,
        '1.0.0',
      )
      expect(result).toMatchObject([TSystemCommand, TSystemCommand3])
    })

    test('gets all commands matching system name', () => {
      const result = commandsFromSystems(
        [TSystem, TSystem2, TSystem3],
        false,
        undefined,
        'testSystem3',
        undefined,
      )
      expect(result).toMatchObject([TSystemCommand3])
    })

    test('gets all commands matching namespace', () => {
      const result = commandsFromSystems(
        [TSystem, TSystem2, TSystem3],
        false,
        'test',
        undefined,
        undefined,
      )
      expect(result).toMatchObject([TSystemCommand, TSystemCommand2])
    })
  })
})
