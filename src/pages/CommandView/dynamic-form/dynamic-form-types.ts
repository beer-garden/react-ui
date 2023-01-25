import { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios'
import { FormikContextType } from 'formik'
import { getOnChangeFunctions } from 'pages/CommandView/dynamic-form'
import { ChangeEvent, Dispatch, SetStateAction } from 'react'
import { Request, RequestTemplate } from 'types/backend-types'
import { ObjectWithStringKeys } from 'types/custom-types'

export interface SystemProperties {
  system: string
  version: string
  namespace: string
}

export interface DynamicProperties {
  args: string[]
  commandProperties: SystemProperties & {
    command: string
  }
  dependsOn: string[]
}

export type OnChangeFunction = (e: ChangeEvent) => void

export type OnChangeGetterFunction = <T extends Record<string, unknown>>(
  context: FormikContextType<T>,
  execute: DynamicExecuteFunction,
  onError: (e: AxiosError<T>) => void,
  authEnabled: boolean,
) => OnChangeFunction

export type DynamicExecuteFunction = (
  config?: AxiosRequestConfig<RequestTemplate>,
) => AxiosPromise<Request>

export interface DynamicModel {
  comment: string
  instance_name: string
  parameters: ObjectWithStringKeys
}

export interface ReadyStatus {
  [tag: string]: {
    ready: boolean
  }
}

export interface DynamicChoices {
  [tag: string]: {
    enum: Array<string>
  }
}

export interface DynamicChoice {
  [tag: string]: {
    choice: string
  }
}

export type DynamicModelSetter = Dispatch<SetStateAction<DynamicModel>>
export type ReadyStatusSetter = Dispatch<SetStateAction<ReadyStatus | null>>
export type DynamicChoicesSetter = Dispatch<
  SetStateAction<DynamicChoices | null>
>

export type OnChangeFunctionMap = ReturnType<typeof getOnChangeFunctions>
