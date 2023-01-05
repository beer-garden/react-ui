import { Box, Button, Stack } from '@mui/material'
import { Snackbar } from 'components/Snackbar'
import { AuthContainer } from 'containers/AuthContainer'
import { Form, Formik, FormikHelpers } from 'formik'
import { LoginTextField } from 'pages/Login'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SnackbarState } from 'types/custom-types'
import * as Yup from 'yup'

export interface LoginFormValues {
  [index: string]: string
  username: string
  password: string
}

const loginValidationSchema = () =>
  Yup.object().shape({
    username: Yup.string().required('Required'),
    password: Yup.string().required('Required'),
  })

const Login = () => {
  const initialValues: LoginFormValues = { username: '', password: '' }
  const { login } = AuthContainer.useContainer()
  const [alert, setAlert] = useState<SnackbarState | undefined>(undefined)
  const { state } = useLocation()
  const navigate = useNavigate()

  const from: string =
    state instanceof Object && 'from' in state ? state['from'] : '/systems'
  const nextPage = () => {
    navigate(from, { replace: true })
  }
  const loginOnSubmit = (
    values: LoginFormValues,
    actions: FormikHelpers<LoginFormValues>,
  ) => {
    login(values.username, values.password)
      .then(() => nextPage())
      .catch((error) => {
        setAlert({
          severity: 'error',
          message:
            (error.response?.data.message || 'Authentication Failed') +
            ': please enter correct username and password',
          doNotAutoDismiss: true,
          showSeverity: false,
        })
      })

    actions.setSubmitting(false)
  }

  return (
    <Box width={'50%'}>
      <Formik
        initialValues={initialValues}
        validationSchema={loginValidationSchema}
        onSubmit={loginOnSubmit}
      >
        <Form>
          <Stack spacing={2}>
            <LoginTextField id="username" label="Username" type="text" />
            <LoginTextField id="password" label="Password" type="password" />
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </Stack>
        </Form>
      </Formik>
      {alert ? <Snackbar status={alert} /> : null}
    </Box>
  )
}
export { Login }
