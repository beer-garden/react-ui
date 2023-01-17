import { fireEvent, render, screen } from '@testing-library/react'
import * as Formik from 'formik'
import { DynamicChoicesStateManager } from 'pages/CommandView/dynamic-form'

import { CommentField } from './CommentField'

describe('Comment field', () => {
  const useFormikContextMock = jest.spyOn(Formik, 'useFormikContext')
  const commentText = 'Here is a comment!'
  const modelSetter = jest.fn()
  const mockGetterSetter = {
    get: jest.fn(),
    set: jest.fn(),
  }
  const dummyDynamicChoicesStateManager: DynamicChoicesStateManager = {
    model: {
      get: jest.fn(),
      set: modelSetter,
    },
    ready: mockGetterSetter,
    choices: mockGetterSetter,
    choice: mockGetterSetter,
  }

  beforeEach(() => {
    useFormikContextMock.mockReturnValue({
      errors: {
        comment: undefined,
      },
      setFieldValue: jest.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as unknown as any)
  })
  test('sets comment model value on change', async () => {
    render(<CommentField stateManager={dummyDynamicChoicesStateManager} />)
    fireEvent.change(screen.getByLabelText('Comment'), {
      target: { value: commentText },
    })
    expect(modelSetter).toHaveBeenCalledWith({ comment: commentText })
  })
})
