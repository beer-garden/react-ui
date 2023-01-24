import { TextField } from '@mui/material'
import { useFormikContext } from 'formik'
import { useMountedState } from 'hooks/useMountedState'
import { DynamicChoicesStateManager } from 'pages/CommandView/dynamic-form'
import { ChangeEvent, useCallback, useEffect } from 'react'

interface CommentFieldProps {
  stateManager: DynamicChoicesStateManager
}
const CommentField = ({ stateManager }: CommentFieldProps) => {
  const context = useFormikContext<Record<string, unknown>>()

  const [value, setValue] = useMountedState<string>('')

  const setModel = useCallback(
    (newValue: string) => {
      stateManager.model.set({
        ...stateManager.model.get(),
        comment: newValue,
      })
    },
    [stateManager.model],
  )

  useEffect(() => {
    context.setFieldValue('comment', value)
    setModel(value)
  }, [context, setModel, value])

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <TextField
      multiline
      rows={2}
      variant="outlined"
      name="comment"
      label="Comment"
      value={value}
      error={Boolean(context.errors.comment)}
      onChange={onChange}
      helperText={
        context.errors.comment &&
        'Comment should be no more than 140 characters'
      }
    />
  )
}

export { CommentField }
