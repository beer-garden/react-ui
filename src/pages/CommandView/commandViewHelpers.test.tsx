import {
  commandIsDynamic,
  parameterHasDynamicChoiceProperties,
} from 'pages/CommandView/commandViewHelpers'
import { dynamicCommandsList } from 'test/dynamic-choice-discriminators.test-values'
import {
  paramNoChoices,
  paramWithStaticChoice,
} from 'test/dynamic-choice-discriminators.test-values'

describe('hasDynamicChoiceProperties', () => {
  describe('rejects non-dynamic parameters', () => {
    test('no choices', () => {
      expect(parameterHasDynamicChoiceProperties(paramNoChoices)).toBe(false)
    })

    test('parameter with only static choices', () => {
      expect(parameterHasDynamicChoiceProperties(paramWithStaticChoice)).toBe(
        false,
      )
    })
  })
})

describe('commandIsDynamic', () => {
  describe('accepts known dynamic commands from example plugins repo', () => {
    expect(dynamicCommandsList.every(commandIsDynamic)).toBe(true)
  })
})
