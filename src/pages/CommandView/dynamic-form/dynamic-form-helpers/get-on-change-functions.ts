import { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios'
import { FormikContextType } from 'formik'
import {
  DynamicChoicesStateManager,
  isCommandChoiceWithArgs,
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
import { ObjectWithStringKeys } from 'types/custom-types'

const getOnChangeFunctions = (
  parameters: Parameter[],
  stateManager: DynamicChoicesStateManager,
  systemProperties: SystemProperties,
) => {
  let onChangeFunctions: Record<string, OnChangeGetterFunction> = {}
  let dynamicChoices: Record<string, DynamicProperties> = {}
  let parametersThatCanInitiateUpdates: Record<string, string[]> = {}

  const dynamicChoiceNames: string[] = Object.keys(stateManager.choices.get())
  const parametersThatMustBeUpdatedNames = new Set(
    Object.keys(stateManager.ready.get()),
  )

  for (const parameter of parameters) {
    if (parameter.choices && isCommandChoiceWithArgs(parameter.choices)) {
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
            parameterName,
            parametersThatCanInitiateUpdates[parameterName],
            dynamicChoices,
            parametersThatMustBeUpdatedNames,
            stateManager,
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
 * @param tag - the name of the parameter that's changing
 * @param shouldUpdate - an array of the dynamic choice parameters that should
 *     be updated by a change in this parameter
 * @param dynamicChoices - an object keyed by the name of the dynamic choice
 *     parameters, whose values are the properties necessary to build a request
 *     to update the dynamic choice values
 * @param mustChoose - a set of the names of parameters that must be set to
 *     an initial value before an update request can be executed
 * @param stateManager - the getters and setters of the state we need to keep
 *     track of
 * @returns - a function for use in individual components to get an 'onChange'
 *     function; this function takes a FormikContextType, the execute function
 *     from an invocation of 'useAxios', an 'onError' function in case
 *     anything goes wrong when running 'execute' and an 'authEnabled' boolean
 *     indicating whether authentication is enabled and returns a function to
 *     be used for 'onChange' in the component
 */
const getOnChangeForDependency = (
  tag: string,
  shouldUpdate: string[],
  dynamicChoices: Record<string, DynamicProperties>,
  mustChoose: Set<string>,
  stateManager: DynamicChoicesStateManager,
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

    const updateDynamic = () => {
      const functions: VoidFunction[] = []

      for (const dynamicChoicesParameter of shouldUpdate) {
        const { args, commandProperties, dependsOn } =
          dynamicChoices[dynamicChoicesParameter]
        const commandParameters: Record<string, unknown> = {}
        const instanceName = stateManager.model.get()['instance_name']

        for (const [arg, parameter] of args.map((e, i) => [e, dependsOn[i]])) {
          commandParameters[arg] =
            stateManager.model.get().parameters[parameter]
        }

        const { system, version, namespace, command } = commandProperties
        const request: RequestTemplate = {
          system: system,
          system_version: version,
          instance_name: instanceName,
          namespace: namespace,
          command: command,
          command_type: 'INFO',
          parameters: commandParameters,
          output_type: 'JSON',
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
              const values = response.data.output

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
                  context.setFieldValue('parameters', {
                    ...(context.values['parameters'] as ObjectWithStringKeys),
                    [dynamicChoicesParameter]: '',
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
            .catch((e) => onError(e)),
        )
      }

      for (const f of functions) {
        f()
      }
    }

    return (event: ChangeEvent<HTMLInputElement>) => {
      if ('target' in event) {
        const target = event.target

        if ('value' in target && 'name' in target) {
          const { value, name } = target as EventTarget & {
            value: string
            name: string
          }

          // update the form library's context object
          const newContextParameters = {
            ...(context.values['parameters'] as ObjectWithStringKeys),
            [name]: value,
          }
          context.setFieldValue('parameters', newContextParameters)

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

          if (canUpdate()) updateDynamic()
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
        otherMustChoose
          .map((x) => stateManager.ready.get()[x].ready)
          .every((x) => x)
      )
    }

    const updateDynamic = () => {
      const functions: VoidFunction[] = []

      for (const dynamicChoicesParameter of shouldUpdate) {
        const { args, commandProperties, dependsOn } =
          dynamicChoices[dynamicChoicesParameter]
        const commandParameters: Record<string, unknown> = {}
        const instanceName = stateManager.model.get()['instance_name']

        for (const [arg, parameter] of args.map((e, i) => [e, dependsOn[i]])) {
          commandParameters[arg] =
            stateManager.model.get().parameters[parameter]
        }

        const { system, version, namespace, command } = commandProperties
        const request: RequestTemplate = {
          system: system,
          system_version: version,
          instance_name: instanceName,
          namespace: namespace,
          command: command,
          command_type: 'INFO',
          parameters: commandParameters,
          output_type: 'JSON',
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
                  context.setFieldValue('parameters', {
                    ...(context.values['parameters'] as ObjectWithStringKeys),
                    [dynamicChoicesParameter]: '',
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
            .catch((e) => onError(e)),
        )
      }

      for (const f of functions) {
        f()
      }
    }

    return (event: ChangeEvent<HTMLInputElement>) => {
      if ('target' in event) {
        const target = event.target

        if ('value' in target && 'name' in target) {
          const { value, name } = target as EventTarget & {
            value: string
            name: string
          }

          // update the form library's context object
          context.setFieldValue(name, value)

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

          if (canUpdate()) updateDynamic()
        }
      }
    }
  }
}
// const getOnChangeForMustChoose_old = (
//   tag: string,
//   shouldUpdate: string[],
//   dynamicChoices: Record<string, DynamicProperties>,
//   mustChoose: string[],
//   stateForDynamicCommand: MutableRefObject<DynamicModel>,
//   setStateForDynamicCommand: DynamicModelSetter,
//   readyStatusForDynamicCommand: MutableRefObject<ReadyStatus | null>,
//   setReadyStatusForDynamicCommand: ReadyStatusSetter,
//   theDynamicChoices: DynamicChoices | null,
//   setTheDynamicChoices: DynamicChoicesSetter,
// ) => {
//   /* at this time, we assume every 'must choose' is not actually a proper
//      parameter of the request -- e.g. 'instance_name' */
//   const otherMustChoose = mustChoose.filter((x) => x !== tag)

//   return <T extends Record<string, unknown>>(
//     context: FormikContextType<T>,
//     execute: (
//       config?: AxiosRequestConfig<RequestTemplate>,
//     ) => AxiosPromise<Request>,
//     onError: (e: AxiosError<T>) => void,
//     authEnabled: boolean,
//   ) => {
//     const canUpdate = () => {
//       return (
//         otherMustChoose.length === 0 ||
//         otherMustChoose.map(
//           (x) =>
//             readyStatusForDynamicCommand.current &&
//             x in readyStatusForDynamicCommand.current &&
//             (readyStatusForDynamicCommand.current[x]?.ready ?? false),
//         )
//       )
//     }

//     const updateDynamic = () => {
//       const functions: VoidFunction[] = []

//       for (const dynamicChoicesParameter of shouldUpdate) {
//         const { args, commandProperties, dependsOn } =
//           dynamicChoices[dynamicChoicesParameter]
//         const commandParameters: Record<string, unknown> = {}
//         const instanceName = stateForDynamicCommand.current['instance_name']

//         for (const [arg, parameter] of args.map((e, i) => [e, dependsOn[i]])) {
//           commandParameters[arg] =
//             stateForDynamicCommand.current.parameters[parameter]
//         }

//         const { system, version, namespace, command } = commandProperties
//         const request: RequestTemplate = {
//           system: system,
//           system_version: version,
//           instance_name: instanceName,
//           namespace: namespace,
//           command: command,
//           command_type: 'INFO',
//           parameters: commandParameters,
//           output_type: 'JSON',
//         }
//         const config: AxiosRequestConfig<RequestTemplate> = {
//           url: '/api/v1/requests?blocking=true',
//           method: 'post',
//           data: request,
//           withCredentials: authEnabled,
//         }

//         functions.push(() =>
//           execute(config)
//             .then((response) => {
//               // our response provides the values for the dynamic choices
//               const values = response.data.output

//               try {
//                 if (values) {
//                   const parsedValues = JSON.parse(values)

//                   setTheDynamicChoices((prev) => {
//                     return {
//                       ...prev,
//                       [dynamicChoicesParameter]: {
//                         enum: parsedValues,
//                       },
//                     }
//                   })
//                 }
//               } catch (e) {
//                 // noop
//               }
//             })
//             .catch((e) => onError(e)),
//         )
//       }

//       functions.map((f) => f())
//     }

//     return (event: ChangeEvent<HTMLInputElement>) => {
//       if ('target' in event) {
//         const target = event.target

//         if ('value' in target && 'name' in target) {
//           const { value, name } = target as EventTarget & {
//             value: string
//             name: string
//           }

//           context.setFieldValue(name, value)
//           setReadyStatusForDynamicCommand((prev) => {
//             return {
//               ...prev,
//               [name]: {
//                 ready: true,
//               },
//             }
//           })
//           setStateForDynamicCommand((prev) => {
//             return {
//               ...prev,
//               [name]: value,
//             }
//           })
//         }
//       }
//       if (canUpdate()) updateDynamic()
//     }
//   }
// }

export { getOnChangeFunctions }
