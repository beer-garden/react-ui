import { Button } from '@mui/material'
import { Link } from 'react-router-dom'

const LinkButton = (
  label: string,
  linkTo: string,
  disabled = false,
  onClick?: () => void,
) => {
  return (
    <Button
      size="small"
      component={Link}
      to={linkTo}
      variant="contained"
      color="primary"
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </Button>
  )
}

export { LinkButton }
