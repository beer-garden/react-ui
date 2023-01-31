import { render, screen } from '@testing-library/react'
import {
  checkContext,
  commandIsDynamic,
  fixReplayAny,
  handleByteParametersReset,
  isByteCommand,
  parameterHasDynamicChoiceProperties,
  removeOldTriggerKeys,
} from 'pages/CommandView/commandViewHelpers'
import { HashRouter } from 'react-router-dom'
import {
  dynamicCommandsList,
  simpleDynamicCommand,
} from 'test/dynamic-choice-discriminators.test-values'
import { paramWithStaticChoice } from 'test/dynamic-choice-discriminators.test-values'
import {
  TAugmentedCommand,
  TRequestCommandModel,
  TRequestJobModel,
} from 'test/request-command-job-test-values'
import { TParameter, TSystem } from 'test/system-test-values'
import { ParameterType } from 'types/backend-types'
import { CommandViewRequestModel } from 'types/form-model-types'

describe('checkContext', () => {
  test('errors if no model for a replay', () => {
    render(
      <HashRouter>
        {checkContext(
          'namespace',
          'sname',
          'version',
          'cname',
          undefined,
          undefined,
          true,
          undefined,
        )}
      </HashRouter>,
    )
    expect(
      screen.getByText('IRRECOVERABLE ERROR IN RE-EXECUTION, GO TO systems'),
    ).toBeInTheDocument()
  })

  test('errors if no namespace', () => {
    render(
      <HashRouter>
        {checkContext(
          undefined,
          'sname',
          'version',
          'cname',
          undefined,
          undefined,
          false,
          undefined,
        )}
      </HashRouter>,
    )
    expect(screen.getByText('GO TO systems')).toBeInTheDocument()
  })

  test('errors if no systemName', () => {
    render(
      <HashRouter>
        {checkContext(
          'namespace',
          undefined,
          'version',
          'cname',
          undefined,
          undefined,
          false,
          undefined,
        )}
      </HashRouter>,
    )
    expect(screen.getByText('GO TO systems : namespace')).toBeInTheDocument()
  })

  test('errors if no version', () => {
    render(
      <HashRouter>
        {checkContext(
          'namespace',
          'sname',
          undefined,
          'cname',
          undefined,
          undefined,
          false,
          undefined,
        )}
      </HashRouter>,
    )
    expect(
      screen.getByText('GO TO systems : namespace : sname'),
    ).toBeInTheDocument()
  })

  test('errors if no commandName', () => {
    render(
      <HashRouter>
        {checkContext(
          'namespace',
          'sname',
          'version',
          undefined,
          undefined,
          undefined,
          false,
          undefined,
        )}
      </HashRouter>,
    )
    expect(
      screen.getByText('GO TO systems : namespace : sname'),
    ).toBeInTheDocument()
  })

  test('errors if no system', () => {
    render(
      <HashRouter>
        {checkContext(
          'namespace',
          'sname',
          'version',
          'cname',
          undefined,
          undefined,
          false,
          undefined,
        )}
      </HashRouter>,
    )
    expect(
      screen.getByText('GO TO systems : namespace : sname'),
    ).toBeInTheDocument()
  })

  test('errors if no command', () => {
    render(
      <HashRouter>
        {checkContext(
          'namespace',
          'sname',
          'version',
          'cname',
          TSystem,
          undefined,
          false,
          undefined,
        )}
      </HashRouter>,
    )
    expect(
      screen.getByText('GO TO systems : namespace : sname'),
    ).toBeInTheDocument()
  })

  test('returns undefined if has all data', () => {
    const renderElem = checkContext(
      'namespace',
      'sname',
      'version',
      'cname',
      TSystem,
      TAugmentedCommand,
      false,
      undefined,
    )
    expect(renderElem).toBeUndefined()
  })
})

describe('parameterHasDynamicChoiceProperties', () => {
  describe('rejects non-dynamic parameters', () => {
    test('no choices', () => {
      expect(parameterHasDynamicChoiceProperties(TParameter)).toBe(false)
    })

    test('parameter with only static choices', () => {
      expect(parameterHasDynamicChoiceProperties(paramWithStaticChoice)).toBe(
        false,
      )
    })
  })

  test('accepts dynamic parameter', () => {
    expect(
      parameterHasDynamicChoiceProperties(simpleDynamicCommand.parameters[0]),
    ).toBe(true)
  })
})

describe('handleByteParametersReset', () => {
  test('does nothing if no params', () => {
    const { parameters, ...noParamModel } = TRequestCommandModel
    expect(
      handleByteParametersReset(
        TRequestCommandModel,
        noParamModel as CommandViewRequestModel,
        [],
      ),
    ).toEqual(TRequestCommandModel)
  })
})

describe('commandIsDynamic', () => {
  test('accepts known dynamic commands from example plugins repo', () => {
    expect(dynamicCommandsList.every(commandIsDynamic)).toBe(true)
  })
})

describe('isByteCommand', () => {
  const byteParam = { ...TParameter, type: 'Bytes' as ParameterType }
  const nestedParam = { ...TParameter, parameters: [byteParam] }

  test('returns false if no byte parameter', () => {
    expect(isByteCommand([TParameter])).toBe(false)
  })

  test('returns true if byte parameter', () => {
    expect(isByteCommand([byteParam])).toBe(true)
  })

  test('returns true if nested byte parameter', () => {
    expect(isByteCommand([nestedParam])).toBe(true)
  })
})

describe('removeOldTriggerKeys', () => {
  test('removes old trigger keys', () => {
    const jobModel = {
      ...TRequestJobModel,
      job: {
        name: 'My favorite job',
        trigger: 'date',
        timezone: 'UTC',
        week: 2,
        hour: 8,
      },
    }
    const reqJobModel = { ...TRequestJobModel }
    delete reqJobModel.job.timezone
    removeOldTriggerKeys(jobModel, 'cron')
    expect(jobModel).toEqual(reqJobModel)
  })

  test('does not remove trigger keys for unchanged trigger', () => {
    const jbModel = { ...TRequestJobModel }
    removeOldTriggerKeys(jbModel, 'date')
    expect(jbModel).toEqual(TRequestJobModel)
  })
})

describe('fixReplayAny', () => {
  test('does not change non-dictionary and non-any type command models', () => {
    expect(fixReplayAny(TRequestCommandModel, [TParameter])).toStrictEqual(
      TRequestCommandModel,
    )
  })
})
