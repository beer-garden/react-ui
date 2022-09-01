import {
  Choice,
  Command,
  DynamicChoiceCommandValue,
  Parameter,
} from 'types/backend-types'

type factoryType = (c: (c: Choice) => boolean) => (c: Command) => boolean

/* type predicate for run time */
const isDynamicChoiceCommandValue = (
  arg: unknown,
): arg is DynamicChoiceCommandValue => {
  return (
    typeof arg !== 'string' &&
    !Array.isArray(arg) &&
    (arg as DynamicChoiceCommandValue).command !== undefined &&
    typeof (arg as DynamicChoiceCommandValue).command === 'string' &&
    (arg as DynamicChoiceCommandValue).system !== undefined &&
    typeof (arg as DynamicChoiceCommandValue).system === 'string' &&
    (arg as DynamicChoiceCommandValue).version !== undefined &&
    typeof (arg as DynamicChoiceCommandValue).version === 'string' &&
    (arg as DynamicChoiceCommandValue).instance_name !== undefined &&
    typeof (arg as DynamicChoiceCommandValue).instance_name === 'string'
  )
}

/* choices is populated by running a BG command without parameters; the
   command is determined solely by its name */
const isSimpleCommandChoice = (choice: Choice) => {
  if (choice.type === 'command' && typeof choice.value === 'string') {
    return (
      'args' in choice.details &&
      Array.isArray(choice.details.args) &&
      choice.details.args.length === 0
    )
  }

  return false
}

/* choices is populated by running a BG command without parameters; the
   command is determined by its name, system, version and instance */
const isSimpleCommandFullySpecified = (choice: Choice) => {
  if (choice.type === 'command' && typeof choice.value !== 'string') {
    return (
      isDynamicChoiceCommandValue(choice.value) &&
      'args' in choice.details &&
      Array.isArray(choice.details.args) &&
      choice.details.args.length === 0
    )
  }

  return false
}

const isCommandChoiceWithArgs = (choice: Choice) => {
  if (choice.type === 'command') {
    /*
     * regular expression to match a string that looks like:
     *
     * some_command(arg1=${binky}, bloop=${blanky}, feeling=${comfy})
     *
     * where the second and subsequent arguments are optional (i.e., there's
     * at least one)
     */
    const commandWithArgsRegex =
      /^.+\(.+=\$\{.+\}(?:,\p{White_space}*.+=\$\{.+\})*\)$/

    const commandMatches =
      'name' in choice.details &&
      typeof choice.details.name === 'string' &&
      choice.details.name.length > 0 &&
      typeof choice.value === 'string' &&
      Boolean(choice.value.match(commandWithArgsRegex))
    const argsPopulated =
      'args' in choice.details &&
      Array.isArray(choice.details.args) &&
      choice.details.args.length > 0 &&
      Array.isArray(choice.details.args[0])

    return commandMatches && argsPopulated
  }

  return false
}

/* choices is populated by retrieving a URL without query args */
const isSimpleUrlChoice = (choice: Choice) => {
  return (
    choice.type === 'url' &&
    typeof choice.value === 'string' &&
    'address' in choice.details &&
    'args' in choice.details &&
    Array.isArray(choice.details.args) &&
    choice.details.args.length === 0
  )
}

/* choices is populated by retrieving a URL with query args */
const isUrlChoiceWithArgs = (choice: Choice) => {
  if (choice.type === 'url') {
    /*
     * regular expression to match a string that looks like:
     *
     * http://example.com/api?file=${file}&dessert=${icecream}&drink=${coffee}
     *
     * where the second and subsequent query-args are optional (i.e., there's
     * at least one)
     */
    const urlWithQueryArgsRegex =
      /^https?:\/\/.*\?.+=\$\{.+\}(?:&.+=\$\{.+\})*$/

    const urlMatches =
      'address' in choice.details &&
      typeof choice.details.address === 'string' &&
      choice.details.address.length > 8 && // arbitrary number -> should be a URL
      typeof choice.value === 'string' &&
      Boolean(choice.value.match(urlWithQueryArgsRegex))
    const argsPopulated =
      'args' in choice.details &&
      Array.isArray(choice.details.args) &&
      choice.details.args.length > 0 &&
      Array.isArray(choice.details.args[0])

    return urlMatches && argsPopulated
  }
  return false
}

/* this is the odd man out, as the choice type is 'static' but we must
   process it as a dynamic choice */
const isDictionaryChoice = (choice: Choice) => {
  if (
    typeof choice.value !== 'string' &&
    !Array.isArray(choice.value) &&
    !isDynamicChoiceCommandValue(choice.value)
  ) {
    let propertyValuesAreStringArrays = true

    for (const key in choice.value) {
      propertyValuesAreStringArrays &&=
        Array.isArray(choice.value[key]) &&
        choice.value[key].length > 0 &&
        typeof choice.value[key][0] === 'string'
    }

    return (
      Object.keys(choice.value).length !== 0 && propertyValuesAreStringArrays
    )
  }

  return false
}

const parameterHasDynamicChoiceProperties = (parameter: Parameter) => {
  return (
    typeof parameter.choices !== 'undefined' &&
    (parameter.choices.type !== 'static' ||
      isDictionaryChoice(parameter.choices))
  )
}

/* This is a shortcut function that determines whether a command has
   dynamic choices in the most lightweight way possible. */
const commandIsDynamic = (command: Command) => {
  return command.parameters
    .map(parameterHasDynamicChoiceProperties)
    .some((x) => x)
}

/**
 * Given one of our Choice => boolean predicates, generates a
 * Command => boolean function that checks all parameters and sub-parameters
 *
 * @param func
 * @returns
 */
const discriminatorCreator: factoryType = (func) => {
  return (command: Command) => {
    const decideParameterAndSubParameters = (p: Parameter) => {
      return (
        (p.choices && func(p.choices)) ||
        p.parameters.some(decideParameterAndSubParameters)
      )
    }

    return command.parameters.some(decideParameterAndSubParameters)
  }
}

export const hasSimpleCommandChoice = discriminatorCreator(
  isSimpleCommandChoice,
)
export const hasCommandChoiceWithArgs = discriminatorCreator(
  isCommandChoiceWithArgs,
)
export const hasSimpleCommandFullySpecified = discriminatorCreator(
  isSimpleCommandFullySpecified,
)
export const hasSimpleUrlChoice = discriminatorCreator(isSimpleUrlChoice)
export const hasUrlChoiceWithArgs = discriminatorCreator(isUrlChoiceWithArgs)
export const hasDynamicDictionary = discriminatorCreator(isDictionaryChoice)

export { commandIsDynamic, parameterHasDynamicChoiceProperties }
