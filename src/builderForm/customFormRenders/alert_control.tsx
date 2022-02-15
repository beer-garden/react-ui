import { withJsonFormsControlProps } from '@jsonforms/react'
import Alert from '@mui/material/Alert'

const AlertControl = () => <Alert severity="info">None! :)</Alert>

export default withJsonFormsControlProps(AlertControl)
