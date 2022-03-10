import { Form, Formik, FormikHelpers, useFormikContext } from 'formik'
import { Box, TextField, Button, Stack } from '@mui/material'
import * as Yup from 'yup'
import { AuthContainer } from '../containers/AuthContainer'
import { useLocation, useNavigate } from 'react-router-dom'
import { replace } from 'lodash'
interface LoginFormValues {
  [index: string]: string
  username: string
  password: string
}

const loginValidationSchema = () =>
  Yup.object().shape({
    username: Yup.string().required('Required'),
    password: Yup.string().required('Required'),
  })

const getLoginOnSubmit = (
  login: (username: string, password: string) => Promise<void>,
  nextPage: VoidFunction
) => (values: LoginFormValues, actions: FormikHelpers<LoginFormValues>) => {
  console.log(
    'Login.getLoginOnSubmit values: ',
    JSON.stringify(values, null, 2)
  )

  login(values.username, values.password).then(() => nextPage())

  actions.setSubmitting(false)
}

interface LoginTextFieldProps {
  id: string
  label: string
  type: string
}

const LoginTextField = ({ id, label, type }: LoginTextFieldProps) => {
  const context = useFormikContext<LoginFormValues>()

  return (
    <TextField
      required
      name={id}
      type={type}
      label={label}
      value={context.values[id]}
      onChange={context.handleChange}
      error={context.touched[id] && Boolean(context.errors[id])}
      helperText={context.touched[id] && context.errors[id]}
    />
  )
}

const Login = () => {
  const initialValues: LoginFormValues = { username: '', password: '' }
  const { login } = AuthContainer.useContainer()
  const { state } = useLocation()
  const navigate = useNavigate()

  let from: string
  if (state instanceof Object && 'from' in state) {
    from = state['from']
  } else {
    from = '/jobs'
  }

  const nextPage = () => {
    console.log('Login FORWARDING TO', from)
    navigate(from, { replace: true })
  }

  // const loginAndForward

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
export default Login
