import { ExpandLess, ExpandMore } from '@mui/icons-material'
import {
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  IconButton,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { ThemeContext } from 'components/UI/Theme/ThemeProvider'
import { useContext } from 'react'
import ReactJson from 'react-json-view'
import { darkTheme, lightTheme } from 'utils/customRJVThemes'

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
  const colors = useTheme()
  const bgColor = colors.palette.background.default

  return (
    <Card sx={{ width: 1 }}>
      <CardActions
        sx={{
          backgroundColor: 'primary.main',
        }}
      >
        <Typography sx={{ flex: 1 }} color="common.white" variant="h3">
          {title}
        </Typography>
        {collapseHandler && (
          <Typography color="common.white" sx={{ float: 'right' }}>
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
            theme={theme === 'dark' ? darkTheme(bgColor) : lightTheme(bgColor)}
            style={{ backgroundColor: 'primary' }}
          />
        ) : (
          <CircularProgress aria-label="JSON data loading" />
        )}
      </CardContent>
    </Card>
  )
}

export { JsonCard }
