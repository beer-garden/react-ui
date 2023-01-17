import { fireEvent, render, screen, within } from '@testing-library/react'
import { InstanceNameSchema } from 'formHelpers'
import * as Formik from 'formik'
import {
  DynamicChoicesStateManager,
  DynamicModel,
  OnChangeFunctionMap,
} from 'pages/CommandView/dynamic-form'
import { ConfigProviders } from 'test/testMocks'

import { InstanceField } from './InstanceField'

describe('Instance field', () => {
  const useFormikContextMock = jest.spyOn(Formik, 'useFormikContext')
  const mockGetterSetter = {
    get: jest.fn(),
    set: jest.fn(),
  }
  const testInstanceName = 'MyFavoriteInstanceName'
  const otherInstanceName = 'OtherInstanceName'
  const dynamicModel: DynamicModel = {
    instance_name: testInstanceName,
    comment: '',
    parameters: {},
  }
  const dummyDynamicChoicesStateManager: DynamicChoicesStateManager = {
    model: {
      get: () => dynamicModel,
      set: jest.fn(),
    },
    ready: mockGetterSetter,
    choices: mockGetterSetter,
    choice: mockGetterSetter,
  }
  const singleInstanceNameSchema: InstanceNameSchema = {
    title: 'Instance Name',
    type: 'string',
    default: testInstanceName,
  }
  const multipleInstanceNameSchema: InstanceNameSchema = {
    title: 'Instance Name',
    type: 'string',
    enum: [testInstanceName, otherInstanceName],
  }
  const onChangeMock = jest.fn()
  const onChange = () => {
    return onChangeMock
  }
  const onChangeFunctionMap: OnChangeFunctionMap = {
    instance_name: onChange,
  }
  const execute = jest.fn()

  beforeEach(() => {
    useFormikContextMock.mockReturnValue({
      errors: {
        instance_name: undefined,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as unknown as any)
  })

  test('shows single instance value', async () => {
    render(
      <ConfigProviders>
        <InstanceField
          instanceSchema={singleInstanceNameSchema}
          onChangeFunctionMap={onChangeFunctionMap}
          execute={execute}
          stateManager={dummyDynamicChoicesStateManager}
        />
      </ConfigProviders>,
    )
    expect(screen.getByLabelText('Instance Name')).toHaveAttribute(
      'aria-disabled',
    )
    expect(
      await within(screen.getByLabelText('Instance Name')).findByText(
        testInstanceName,
      ),
    ).toBeInTheDocument()
  })

  test('sets instance_name model value on change', async () => {
    render(
      <ConfigProviders>
        <InstanceField
          instanceSchema={multipleInstanceNameSchema}
          onChangeFunctionMap={onChangeFunctionMap}
          execute={execute}
          stateManager={dummyDynamicChoicesStateManager}
        />
      </ConfigProviders>,
    )
    fireEvent.mouseDown(screen.getByLabelText('Instance Name'))
    fireEvent.click(await screen.findByText(otherInstanceName))
    expect(onChangeMock).toHaveBeenCalled()
  })
})
