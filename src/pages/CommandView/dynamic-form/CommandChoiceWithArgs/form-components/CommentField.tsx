import { TextField } from '@mui/material'
import { useFormikContext } from 'formik'
import { DynamicChoicesStateManager } from 'pages/CommandView/dynamic-form'
import { ChangeEvent, useEffect, useState } from 'react'

interface CommentFieldProps {
  stateManager: DynamicChoicesStateManager
}
const CommentField = ({ stateManager }: CommentFieldProps) => {
  const context = useFormikContext<Record<string, unknown>>()

  const [value, setValue] = useState('')

  const setModel = (newValue: string) => {
    stateManager.model.set({
      ...stateManager.model.get(),
      comment: value,
    })
  }

  useEffect(() => {
    context.setFieldValue('comment', value)
    setModel(value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

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
