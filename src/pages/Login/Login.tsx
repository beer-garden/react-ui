import { Box, Button, Stack } from '@mui/material'
import { AuthContainer } from 'containers/AuthContainer'
import { Form, Formik, FormikHelpers } from 'formik'
import { LoginTextField } from 'pages/Login'
import { useLocation, useNavigate } from 'react-router-dom'
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

const getLoginOnSubmit =
  (
    login: (username: string, password: string) => Promise<void>,
    nextPage: VoidFunction,
  ) =>
  (values: LoginFormValues, actions: FormikHelpers<LoginFormValues>) => {
    login(values.username, values.password)
      .then(() => nextPage())
      .catch((error) => {
        //TODO snackbar
        console.error(error)
      })

    actions.setSubmitting(false)
  }

const Login = () => {
  const initialValues: LoginFormValues = { username: '', password: '' }
  const { login } = AuthContainer.useContainer()
  const { state } = useLocation()
  const navigate = useNavigate()

  const from: string =
    state instanceof Object && 'from' in state ? state['from'] : '/jobs'
  const nextPage = () => {
    navigate(from, { replace: true })
  }
  const loginOnSubmit = getLoginOnSubmit(login, nextPage)

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
            <Button type="submit">Submit</Button>
          </Stack>
        </Form>
      </Formik>
    </Box>
  )
}
export { Login }
