import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { Button, Divider, TextField } from '@mui/material'
import { FieldArray, getIn, useFormikContext } from 'formik'
import { nanoid } from 'nanoid/non-secure'
import { ConnectionFormFields, ConnectionFormHeading } from 'pages/GardenAdminView'
import { Fragment } from 'react'

const ConnectionStompHeaders = () => {
  const context = useFormikContext<ConnectionFormFields>()

  return (
    <Fragment>
      <ConnectionFormHeading labelText={'STOMP Headers'} sx={{ mb: 3 }} />
      <FieldArray name="stompHeaders">
        {({ push, remove }) => {
          return (
            <div>
              {context.values.stompHeaders.map((header, index) => {
                const key = `stompHeaders[${index}].key`
                const touchedKey = getIn(context.touched, key)
                const errorsKey = getIn(context.errors, key)

                const value = `stompHeaders[${index}].value`
                const touchedValue = getIn(context.touched, value)
                const errorsValue = getIn(context.errors, value)

                return (
                  <div key={header.id}>
                    <TextField
                      name={key}
                      label={'Key'}
                      value={header.key}
                      required
                      error={touchedKey && Boolean(errorsKey)}
                      helperText={touchedKey && errorsKey}
                      onChange={context.handleChange}
                      onBlur={context.handleBlur}
                    />

                    <TextField
                      name={value}
                      label={'Value'}
                      value={header.value}
                      required
                      error={touchedValue && Boolean(errorsValue)}
                      helperText={touchedValue && errorsValue}
                      onChange={context.handleChange}
                      onBlur={context.handleBlur}
                    />

                    <Button
                      type="button"
                      onClick={() => {
                        remove(index)
                      }}
                      startIcon={<DeleteIcon />}
                    >
                      Delete
                    </Button>
                    <Divider sx={{ mb: 0.5, mt: 0.5 }} />
                  </div>
                )
              })}
              <Button
                type="button"
                onClick={() => {
                  push({ id: nanoid(), key: '', value: '' })
                }}
                startIcon={<AddIcon />}
              >
                Add Header
              </Button>
            </div>
          )
        }}
      </FieldArray>
    </Fragment>
  )
}

export { ConnectionStompHeaders }
