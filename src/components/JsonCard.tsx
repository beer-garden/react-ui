import { ExpandLess, ExpandMore } from '@mui/icons-material'
import {
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  IconButton,
  Typography,
} from '@mui/material'
import { ThemeContext } from 'components/UI/Theme/ThemeProvider'
import { useContext } from 'react'
import ReactJson from 'react-json-view'

interface IJsonCard {
  title: string
  collapseHandler?: () => void
  iconTrigger?: boolean
  data?: object
}

/**
 * Reusable component that renders a JSON object on screen in a expandable box
 * @param title string Text for header
 * @param collapseHandler function Handler for collapse click
 * @param data Object JSON to display
 * @iconTrigger boolean Trigger collapse collapse icon flip
 * @returns
 */
const JsonCard = ({ title, collapseHandler, data, iconTrigger }: IJsonCard) => {
  const theme = useContext(ThemeContext).theme
  const textColor = theme === 'dark' ? 'text.secondary' : 'common.white'

  return (
    <Card sx={{ width: 1 }}>
      <CardActions
        sx={{
          backgroundColor: 'primary.main',
        }}
      >
        <Typography sx={{ flex: 1 }} color={textColor} variant="h6">
          {title}
        </Typography>
        {collapseHandler && (
          <Typography color={textColor} sx={{ float: 'right' }}>
            <IconButton
              color="inherit"
              size="small"
              onClick={collapseHandler}
              aria-label="Expand Area"
            >
              {iconTrigger ? <ExpandMore /> : <ExpandLess />}
            </IconButton>
          </Typography>
        )}
      </CardActions>
      <CardContent>
        {data ? (
          <ReactJson
            src={data}
            theme={theme === 'dark' ? 'bright' : 'rjv-default'}
            style={{ backgroundColor: 'primary' }}
          />
        ) : (
          <CircularProgress />
        )}
      </CardContent>
    </Card>
  )
}

export { JsonCard }
