import { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios'
import { FormikContextType } from 'formik'
import {
  DynamicChoicesStateManager,
  isCommandChoiceWithArgs,
  isSimpleCommandChoice,
} from 'pages/CommandView/dynamic-form'
import {
  DynamicProperties,
  OnChangeGetterFunction,
  SystemProperties,
} from 'pages/CommandView/dynamic-form'
import { ChangeEvent } from 'react'
import {
  DynamicChoiceCommandDetails,
  Parameter,
  Request,
  RequestTemplate,
} from 'types/backend-types'

const getOnChangeFunctions = (
  parameters: Parameter[],
  stateManager: DynamicChoicesStateManager,
  systemProperties: SystemProperties,
  setLoadingChoicesContext: (name: string, isLoading: boolean) => void,
  setDynamicRequestErrors: (
    name: string,
    error: AxiosError | undefined,
  ) => void,
) => {
  let onChangeFunctions: Record<string, OnChangeGetterFunction> = {}
  let dynamicChoices: Record<string, DynamicProperties> = {}
  let parametersThatCanInitiateUpdates: Record<string, string[]> = {}

  const dynamicChoiceNames: string[] = Object.keys(stateManager.choices.get())
  const parametersThatMustBeUpdatedNames = new Set(
    Object.keys(stateManager.ready.get()),
  )

  for (const parameter of parameters) {
    if (
      parameter.choices &&
      (isCommandChoiceWithArgs(parameter.choices) ||
        isSimpleCommandChoice(parameter.choices))
    ) {
      const dynamicChoiceParameterToBeUpdatedName = parameter.key
      const dynamicChoiceCommandDetails = parameter.choices
        .details as DynamicChoiceCommandDetails
      const thisDynamicChoiceDependsOn = []
      /* parameter names for the request that will be created to update the 
         choices, distinct from the names of the parameters of *this* command */
      const argumentsToCommand = []

      for (const [
        argName,
        parameterInitiatingUpdate,
      ] of dynamicChoiceCommandDetails.args) {
        thisDynamicChoiceDependsOn.push(parameterInitiatingUpdate)
        argumentsToCommand.push(argName)

        if (parameterInitiatingUpdate in parametersThatCanInitiateUpdates) {
          const previous = parametersThatCanInitiateUpdates[
            parameterInitiatingUpdate
          ] as string[]
          parametersThatCanInitiateUpdates = {
            ...parametersThatCanInitiateUpdates,
            [parameterInitiatingUpdate]: previous.concat([
              dynamicChoiceParameterToBeUpdatedName,
            ]),
          }
        } else {
          parametersThatCanInitiateUpdates = {
            ...parametersThatCanInitiateUpdates,
            [parameterInitiatingUpdate]: [
              dynamicChoiceParameterToBeUpdatedName,
            ],
          }
        }
      }

      dynamicChoices = {
        ...dynamicChoices,
        [dynamicChoiceParameterToBeUpdatedName]: {
          dependsOn: thisDynamicChoiceDependsOn,
          args: argumentsToCommand,
          commandProperties: {
            ...systemProperties,
            command: dynamicChoiceCommandDetails.name,
          },
        },
      }
    }
  }

  /* after the previous loop, we know which parameters can initiate an
     update and are in the "must be chosen" category and which can initiate
     an update; here we create the onChange functions */
  for (const parameter of parameters) {
    const parameterName = parameter.key

    if (parametersThatMustBeUpdatedNames.has(parameterName)) {
      onChangeFunctions = {
        ...onChangeFunctions,
        [parameterName]: getOnChangeForMustChoose(
          parameterName,
          dynamicChoiceNames,
          dynamicChoices,
          parametersThatMustBeUpdatedNames,
          stateManager,
          setLoadingChoicesContext,
          setDynamicRequestErrors,
        ),
      }
    } else if (
      !parameter.choices ||
      !isCommandChoiceWithArgs(parameter.choices)
    ) {
      if (parameterName in parametersThatCanInitiateUpdates) {
        onChangeFunctions = {
          ...onChangeFunctions,
          [parameterName]: getOnChangeForDependency(
            parametersThatCanInitiateUpdates[parameterName],
            dynamicChoices,
            parametersThatMustBeUpdatedNames,
            stateManager,
            setLoadingChoicesContext,
            setDynamicRequestErrors,
          ),
        }
      }
    } else if (
      (isCommandChoiceWithArgs(parameter.choices) ||
        isSimpleCommandChoice(parameter.choices)) &&
      parameter.choices.display === 'typeahead'
    ) {
      if (parameterName in parametersThatCanInitiateUpdates) {
        onChangeFunctions = {
          ...onChangeFunctions,
          [parameterName]: getOnChangeForDependency(
            parametersThatCanInitiateUpdates[parameterName],
            dynamicChoices,
            parametersThatMustBeUpdatedNames,
            stateManager,
            setLoadingChoicesContext,
            setDynamicRequestErrors,
          ),
        }
      }
    }
  }

  /*  Lastly, we pick up those 'must change's that aren't actually parameters,
      e.g., 'instance_name' */
  for (const parameterLikeName of parametersThatMustBeUpdatedNames) {
    if (!(parameterLikeName in Object.keys(onChangeFunctions))) {
      onChangeFunctions = {
        ...onChangeFunctions,
        [parameterLikeName]: getOnChangeForMustChoose(
          parameterLikeName,
          dynamicChoiceNames,
          dynamicChoices,
          parametersThatMustBeUpdatedNames,
          stateManager,
          setLoadingChoicesContext,
          setDynamicRequestErrors,
        ),
      }
    }
  }

  return onChangeFunctions
}

/**
 * Get an 'onChange' function for a parameter which is a dependency of a
 * dynamic choice parameter
 *
 * @param shouldUpdate - an array of the dynamic choice parameters that should
 *     be updated by a change in this parameter
 * @param dynamicChoices - an object keyed by the name of the dynamic choice
 *     parameters, whose values are the properties necessary to build a request
 *     to update the dynamic choice values
 * @param mustChoose - a set of the names of parameters that must be set to
 *     an initial value before an update request can be executed
 * @param stateManager - the getters and setters of the state we need to keep
 *     track of
 * @param setLoadingChoicesContext - sets context for what parameter choices are being loaded
 * @param setDynamicRequestErrors - sets error for parameters that got an error from dynamic request
 * @returns - a function for use in individual components to get an 'onChange'
 *     function; this function takes a FormikContextType, the execute function
 *     from an invocation of 'useAxios', an 'onError' function in case
 *     anything goes wrong when running 'execute' and an 'authEnabled' boolean
 *     indicating whether authentication is enabled and returns a function to
 *     be used for 'onChange' in the component
 */
const getOnChangeForDependency = (
  shouldUpdate: string[],
  dynamicChoices: Record<string, DynamicProperties>,
  mustChoose: Set<string>,
  stateManager: DynamicChoicesStateManager,
  setLoadingChoicesContext: (name: string, isLoading: boolean) => void,
  setDynamicRequestErrors: (
    name: string,
    error: AxiosError | undefined,
  ) => void,
): OnChangeGetterFunction => {
  return <T extends Record<string, unknown>>(
    context: FormikContextType<T>,
    execute: (
      config?: AxiosRequestConfig<RequestTemplate>,
    ) => AxiosPromise<Request>,
    onError: (e: AxiosError<T>) => void,
    authEnabled: boolean,
  ) => {
    const canUpdate = () => {
      return (
        mustChoose.size === 0 ||
        [...mustChoose].every((x) => stateManager.ready.get()[x].ready)
      )
    }

    const updateDynamicState = (selfRefers = false) => {
      const functions: VoidFunction[] = []
      for (const dynamicChoicesParameter of shouldUpdate) {
        const { args, commandProperties, dependsOn } =
          dynamicChoices[dynamicChoicesParameter]
        const commandParameters: Record<string, unknown> = {}
        const theModel = stateManager.model.get()
        const instanceName = theModel['instance_name']

        for (const [arg, parameter] of args.map((e, i) => [e, dependsOn[i]])) {
          commandParameters[arg] = theModel.parameters[parameter]
        }

        const { system, version, namespace, command } = commandProperties
        const request: RequestTemplate = {
          system: system,
          system_version: version,
          instance_name: instanceName,
          namespace: namespace,
          command: command,
          parameters: commandParameters,
        }
        const config: AxiosRequestConfig<RequestTemplate> = {
          url: '/api/v1/requests?blocking=true',
          method: 'post',
          data: request,
          withCredentials: authEnabled,
        }
        if (setLoadingChoicesContext) {
          setLoadingChoicesContext(dynamicChoicesParameter, true)
        }
        if (setDynamicRequestErrors) {
          setDynamicRequestErrors(dynamicChoicesParameter, undefined)
        }

        functions.push(() =>
          execute(config)
            .then((response) => {
              const values = response.data.output
              if (setLoadingChoicesContext) {
                setLoadingChoicesContext(dynamicChoicesParameter, false)
              }
              if (setDynamicRequestErrors) {
                setDynamicRequestErrors(dynamicChoicesParameter, undefined)
              }
              try {
                if (values) {
                  const parsedValues = JSON.parse(values)

                  // update the model's value for the dynamic choice, the
                  // current value of the dynamic choice component and the
                  // form library's context for the dynamic parameter to zeroes
                  if (!selfRefers) {
                    stateManager.model.set((prev) => {
                      return {
                        ...prev,
                        parameters: {
                          ...prev.parameters,
                          [dynamicChoicesParameter]: '',
                        },
                      }
                    })

                    stateManager.choice.set((prev) => {
                      return {
                        ...prev,
                        [dynamicChoicesParameter]: {
                          choice: '',
                        },
                      }
                    })
                  }

                  // update the choices that will be shown for the dynamic
                  // choices component
                  stateManager.choices.set((prev) => {
                    return {
                      ...prev,
                      [dynamicChoicesParameter]: {
                        enum: parsedValues,
                      },
                    }
                  })
                }
              } catch (e) {
                // this is for problems with JSON parsing -- 'nop'
              }
            })
            .catch((e) => {
              if (setLoadingChoicesContext) {
                setLoadingChoicesContext(dynamicChoicesParameter, false)
              }
              if (setDynamicRequestErrors) {
                setDynamicRequestErrors(dynamicChoicesParameter, e)
              }
              onError(e)
              stateManager.choices.set((prev) => {
                return {
                  ...prev,
                  [dynamicChoicesParameter]: {
                    enum: [],
                  },
                }
              })
            }),
        )
      }

      for (const f of functions) {
        f()
      }
    }

    return (event: ChangeEvent) => {
      if ('target' in event) {
        const target = event.target

        if ('value' in target && 'name' in target) {
          const { value, name } = target as EventTarget & {
            value: string
            name: string
          }

          // update our tracked 'model' state
          stateManager.model.set((prev) => {
            return {
              ...prev,
              parameters: {
                ...prev.parameters,
                [name]: value,
              },
            }
          })

          if (canUpdate()) {
            const selfRefers =
              'selfRefers' in target && Boolean(target['selfRefers'])
            updateDynamicState(selfRefers)
          }
        }
      }
    }
  }
}

/**
 * Get an 'onChange' function for a parameter which is a must choose dependency
 * of a dynamic choice parameter
 *
 * @param tag - the name of the parameter or parameter-like that we're building
 *     a function for
 * @param shouldUpdate - an array of the dynamic choice parameters that should
 *     be updated by a change in this parameter
 * @param dynamicChoices - an object keyed by the name of the dynamic choice
 *     parameters, whose values are the properties necessary to build a request
 *     to update the dynamic choice values
 * @param mustChoose - a set of the names of parameters that must be set to
 *     an initial value before an update request can be executed
 * @param stateManager - the getters and setters of the state we need to keep
 *     track of
 * @param setLoadingChoicesContext - sets context for what parameter choices are being loaded
 * @param setDynamicRequestErrors - sets error for parameters that got an error from dynamic request
 * @returns - a function for use in individual components to get an 'onChange'
 *     function; this function takes a FormikContextType, the execute function
 *     from an invocation of 'useAxios', an 'onError' function in case
 *     anything goes wrong when running 'execute' and an 'authEnabled' boolean
 *     indicating whether authentication is enabled and returns a function to
 *     be used for 'onChange' in the component
 */
const getOnChangeForMustChoose = (
  tag: string,
  shouldUpdate: string[],
  dynamicChoices: Record<string, DynamicProperties>,
  mustChoose: Set<string>,
  stateManager: DynamicChoicesStateManager,
  setLoadingChoicesContext: (name: string, isLoading: boolean) => void,
  setDynamicRequestErrors: (
    name: string,
    error: AxiosError | undefined,
  ) => void,
): OnChangeGetterFunction => {
  /* at this time, we assume every 'must choose' is not actually a proper
     parameter of the request -- e.g. 'instance_name' */
  const otherMustChoose = [...mustChoose].filter((x) => x !== tag)

  return <T extends Record<string, unknown>>(
    context: FormikContextType<T>,
    execute: (
      config?: AxiosRequestConfig<RequestTemplate>,
    ) => AxiosPromise<Request>,
    onError: (e: AxiosError<T>) => void,
    authEnabled: boolean,
  ) => {
    const canUpdate = () => {
      return (
        otherMustChoose.length === 0 ||
        otherMustChoose.every((x) => stateManager.ready.get()[x].ready)
      )
    }

    const updateDynamicState = () => {
      const functions: VoidFunction[] = []

      for (const dynamicChoicesParameter of shouldUpdate) {
        const { args, commandProperties, dependsOn } =
          dynamicChoices[dynamicChoicesParameter]
        const commandParameters: Record<string, unknown> = {}
        const theModel = stateManager.model.get()
        const instanceName = theModel['instance_name']

        for (const [arg, parameter] of args.map((e, i) => [e, dependsOn[i]])) {
          commandParameters[arg] = theModel.parameters[parameter]
        }

        const { system, version, namespace, command } = commandProperties
        const request: RequestTemplate = {
          system: system,
          system_version: version,
          instance_name: instanceName,
          namespace: namespace,
          command: command,
          parameters: commandParameters,
        }
        const config: AxiosRequestConfig<RequestTemplate> = {
          url: '/api/v1/requests?blocking=true',
          method: 'post',
          data: request,
          withCredentials: authEnabled,
        }

        functions.push(() =>
          execute(config)
            .then((response) => {
              // our response provides the values for the dynamic choices
              const values = response.data.output
              if (setLoadingChoicesContext) {
                setLoadingChoicesContext(dynamicChoicesParameter, false)
              }
              if (setDynamicRequestErrors) {
                setDynamicRequestErrors(dynamicChoicesParameter, undefined)
              }
              try {
                if (values) {
                  const parsedValues = JSON.parse(values)

                  // update the model's value for the dynamic choice, the
                  // current value of the dynamic choice component and the
                  // form library's context for the dynamic parameter to zeroes
                  stateManager.model.set((prev) => {
                    return {
                      ...prev,
                      parameters: {
                        ...prev.parameters,
                        [dynamicChoicesParameter]: '',
                      },
                    }
                  })
                  stateManager.choice.set((prev) => {
                    return {
                      ...prev,
                      [dynamicChoicesParameter]: {
                        choice: '',
                      },
                    }
                  })

                  // update the choices that will be shown for the dynamic
                  // choices component
                  stateManager.choices.set((prev) => {
                    return {
                      ...prev,
                      [dynamicChoicesParameter]: {
                        enum: parsedValues,
                      },
                    }
                  })
                }
              } catch (e) {
                // this is for problems with JSON parsing -- 'nop'
              }
            })
            .catch((e) => {
              if (setLoadingChoicesContext) {
                setLoadingChoicesContext(dynamicChoicesParameter, false)
              }
              if (setDynamicRequestErrors) {
                setDynamicRequestErrors(dynamicChoicesParameter, e)
              }
              onError(e)
              stateManager.choices.set((prev) => {
                return {
                  ...prev,
                  [dynamicChoicesParameter]: {
                    enum: [],
                  },
                }
              })
            }),
        )
      }

      for (const f of functions) {
        f()
      }
    }

    return (event: ChangeEvent) => {
      if ('target' in event) {
        const target = event.target

        if ('value' in target && 'name' in target) {
          const { value, name } = target as EventTarget & {
            value: string
            name: string
          }

          // update our tracked 'ready' state
          stateManager.ready.set((prev) => {
            return {
              ...prev,
              [name]: {
                ready: true,
              },
            }
          })

          // update our tracked 'model' state; note that we're essentially
          // assuming we're working on 'instance_name'
          stateManager.model.set((prev) => {
            return {
              ...prev,
              [name]: value,
            }
          })

          if (canUpdate()) updateDynamicState()
        }
      }
    }
  }
}

export { getOnChangeFunctions }
