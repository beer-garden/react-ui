import {
  dictWithDynamicInstanceKeyCommand,
  dictWithDynamicNonInstanceKeyCommand,
  dynamicCommandWithMultipleParameters,
  dynamicCommandWithSingleParameter,
  dynamicUrlWithSingleParameter,
  paramNoChoices,
  paramWithStaticChoice,
  selfReferringCommand,
  simpleDynamicCommand,
  simpleDynamicCommandFullySpecified,
  simpleDynamicCommandWithTypeahead,
  simpleDynamicUrl,
  simpleDynamicUrlNullable,
} from 'test/dynamic-choice-discriminators.test-values'

import {
  commandIsDynamic,
  hasCommandChoiceWithArgs,
  hasDynamicDictionary,
  hasSimpleCommandChoice,
  hasSimpleCommandFullySpecified,
  hasSimpleUrlChoice,
  hasUrlChoiceWithArgs,
  parameterHasDynamicChoiceProperties,
} from './dynamic-choice-discriminators'

const dynamicCommandsList = [
  dictWithDynamicInstanceKeyCommand,
  dictWithDynamicNonInstanceKeyCommand,
  dynamicCommandWithMultipleParameters,
  dynamicCommandWithSingleParameter,
  dynamicUrlWithSingleParameter,
  simpleDynamicCommand,
  simpleDynamicCommandFullySpecified,
  simpleDynamicCommandWithTypeahead,
  simpleDynamicUrl,
  simpleDynamicUrlNullable,
  selfReferringCommand,
]

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

describe('individual command predicates', () => {
  test('hasSimpleCommandChoice', () => {
    const withoutSimpleDynamicCommands = dynamicCommandsList.filter(
      (item) =>
        item !== simpleDynamicCommand &&
        item !== simpleDynamicCommandWithTypeahead,
    )
    expect(hasSimpleCommandChoice(simpleDynamicCommand)).toBe(true)
    expect(hasSimpleCommandChoice(simpleDynamicCommandWithTypeahead)).toBe(true)
    expect(withoutSimpleDynamicCommands.some(hasSimpleCommandChoice)).toBe(
      false,
    )
  })

  test('hasSimpleCommandFullySpecified', () => {
    const withoutFullySpecifiedSimpleDynamicCommand =
      dynamicCommandsList.filter(
        (item) => item !== simpleDynamicCommandFullySpecified,
      )
    expect(
      hasSimpleCommandFullySpecified(simpleDynamicCommandFullySpecified),
    ).toBe(true)
    expect(
      withoutFullySpecifiedSimpleDynamicCommand.some(
        hasSimpleCommandFullySpecified,
      ),
    ).toBe(false)
  })

  test('hasSimpleUrlChoice', () => {
    const withoutSimpleUrlDynamicCommands = dynamicCommandsList.filter(
      (item) => item !== simpleDynamicUrl && item !== simpleDynamicUrlNullable,
    )
    expect(hasSimpleUrlChoice(simpleDynamicUrl)).toBe(true)
    expect(hasSimpleUrlChoice(simpleDynamicUrlNullable)).toBe(true)
    expect(withoutSimpleUrlDynamicCommands.some(hasSimpleUrlChoice)).toBe(false)
  })

  test('hasCommandChoiceWithArgs', () => {
    const withoutCommandWithArgs = dynamicCommandsList.filter(
      (item) =>
        item !== dynamicCommandWithSingleParameter &&
        item !== dynamicCommandWithMultipleParameters &&
        item !== selfReferringCommand,
    )
    expect(hasCommandChoiceWithArgs(dynamicCommandWithSingleParameter)).toBe(
      true,
    )
    expect(hasCommandChoiceWithArgs(dynamicCommandWithMultipleParameters)).toBe(
      true,
    )
    expect(hasCommandChoiceWithArgs(selfReferringCommand)).toBe(true)
    expect(withoutCommandWithArgs.some(hasCommandChoiceWithArgs)).toBe(false)
  })

  test('hasUrlChoiceWithArgs', () => {
    const withoutUrlChoiceWithArgs = dynamicCommandsList.filter(
      (item) => item !== dynamicUrlWithSingleParameter,
    )
    expect(hasUrlChoiceWithArgs(dynamicUrlWithSingleParameter)).toBe(true)
    expect(withoutUrlChoiceWithArgs.some(hasUrlChoiceWithArgs)).toBe(false)
  })

  test('hasDynamicDictionary', () => {
    const withoutDictionaryCommands = dynamicCommandsList.filter(
      (item) =>
        item !== dictWithDynamicInstanceKeyCommand &&
        item !== dictWithDynamicNonInstanceKeyCommand,
    )
    expect(hasDynamicDictionary(dictWithDynamicInstanceKeyCommand)).toBe(true)
    expect(hasDynamicDictionary(dictWithDynamicNonInstanceKeyCommand)).toBe(
      true,
    )
    expect(withoutDictionaryCommands.some(hasDynamicDictionary)).toBe(false)
  })
})
