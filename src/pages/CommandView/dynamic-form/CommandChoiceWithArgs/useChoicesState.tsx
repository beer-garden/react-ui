import { CommandBasicSchema, getSchema, ParameterAsProperty } from 'formHelpers'
import {
  DynamicChoice,
  DynamicChoices,
  DynamicModel,
  extractDynamicChoices,
  extractReady,
  ReadyStatus,
} from 'pages/CommandView/dynamic-form'
import { extractModel } from 'pages/CommandView/dynamic-form'
import { MutableRefObject, SetStateAction, useRef, useState } from 'react'
import { AugmentedCommand, StrippedSystem } from 'types/custom-types'

type UseStateWithRefType = <S>(
  initialState: S | (() => S),
) => [
  S,
  (setStateFunctionOrValue: SetStateAction<S>) => void,
  MutableRefObject<S>,
]

const useStateWithRef: UseStateWithRefType = <S,>(
  initialState: S | (() => S),
) => {
  const [stateValue, _setStateValue] = useState<S>(initialState)
  const theRef = useRef(stateValue)

  const setStateValue = (setStateFunctionOrValue: SetStateAction<S>) => {
    theRef.current =
      typeof setStateFunctionOrValue === 'function'
        ? (setStateFunctionOrValue as (prev: S) => S)(theRef.current)
        : setStateFunctionOrValue
    _setStateValue(theRef.current)
  }

  return [stateValue, setStateValue, theRef]
}

type Setter<S> = (setStateFunctionOrValue: SetStateAction<S>) => void

type GetterSetter<S> = {
  get: () => S
  set: Setter<S>
}

export interface DynamicChoicesStateManager {
  model: GetterSetter<DynamicModel>
  ready: GetterSetter<ReadyStatus>
  choices: GetterSetter<DynamicChoices>
  choice: GetterSetter<DynamicChoice>
}

const useChoicesState = (
  system: StrippedSystem,
  command: AugmentedCommand,
): [DynamicChoicesStateManager, VoidFunction] => {
  const schema: CommandBasicSchema = getSchema(
    system.instances,
    command.parameters,
  )
  const parametersSchema = schema.properties.parameters
    .properties as ParameterAsProperty
  const instancesSchema =
    schema.properties.instance_names.properties.instance_name

  const initialModel = extractModel(parametersSchema, instancesSchema)
  const initialReady = extractReady(system.instances, command.parameters)
  const [initialDynamicChoices, initialDynamicChoice] = extractDynamicChoices(
    command.parameters,
  )

  const [modelForReset, readyForReset, choicesForReset, choiceForReset] = [
    initialModel,
    initialReady,
    initialDynamicChoices,
    initialDynamicChoice,
  ].map((x) => JSON.parse(JSON.stringify(x)))

  const [, setStateForDynamicCommand, stateForDynamicCommandRef] =
    useStateWithRef<DynamicModel>(initialModel)
  const [, setReadyStatusForDynamicCommand, readyStatusForDynamicCommandRef] =
    useStateWithRef<ReadyStatus>(initialReady)
  const [dynamicChoices, setDynamicChoices] = useStateWithRef<DynamicChoices>(
    initialDynamicChoices,
  )
  const [dynamicChoice, setDynamicChoice] =
    useStateWithRef<DynamicChoice>(initialDynamicChoice)

  const resetAll = () => {
    setStateForDynamicCommand(modelForReset)
    setReadyStatusForDynamicCommand(readyForReset)
    setDynamicChoices(choicesForReset)
    setDynamicChoice(choiceForReset)
  }

  return [
    {
      model: {
        get: () => stateForDynamicCommandRef.current,
        set: setStateForDynamicCommand,
      },
      ready: {
        get: () => readyStatusForDynamicCommandRef.current,
        set: setReadyStatusForDynamicCommand,
      },
      choices: {
        get: () => dynamicChoices,
        set: setDynamicChoices,
      },
      choice: {
        get: () => dynamicChoice,
        set: setDynamicChoice,
      },
    },
    resetAll,
  ]
}

export { useChoicesState }
