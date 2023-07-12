import 'css/CustomJsonViewIndex.css'

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
import { darkStyles, defaultStyles, JsonView } from 'react-json-view-lite'

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
  darkStyles.punctuation = '_puncuationMargin'
  defaultStyles.punctuation = '_puncuationMargin'

  const shouldInitiallyExpand = (new TextEncoder().encode(JSON.stringify(data)).length) < 7e5

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
      <CardContent sx={{maxHeight: '700px', overflowY: 'auto' }} >
        {data ? (
          <JsonView
            data={data}
            shouldInitiallyExpand={(level) => shouldInitiallyExpand}
            style={theme === 'dark' ? darkStyles : defaultStyles}
          />
        ) : (
          <CircularProgress aria-label="JSON data loading" />
        )}
      </CardContent>
    </Card>
  )
}

export { JsonCard }
