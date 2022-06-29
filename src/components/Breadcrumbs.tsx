import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import {
  Box,
  Breadcrumbs as MUIBreadcrumbs,
  Tooltip,
  Zoom,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

interface MyBreadcrumbsProps {
  breadcrumbs: string[]
}

const Breadcrumbs = ({ breadcrumbs: breadcrumbsArr }: MyBreadcrumbsProps) => {
  if (breadcrumbsArr) {
    return (
      <MUIBreadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbsArr
          .slice(0, breadcrumbsArr.length - 1)
          .map((breadcrumb, index) => (
            <Tooltip
              title={'Navigate to ' + String(breadcrumbsArr[index])}
              key={index}
              TransitionComponent={Zoom}
              followCursor
            >
              <RouterLink
                key={breadcrumb}
                to={['/systems']
                  .concat(breadcrumbsArr.slice(0, index + 1))
                  .join('/')}
              >
                {breadcrumb}
              </RouterLink>
            </Tooltip>
          ))}
        <Box component="span">{breadcrumbsArr[breadcrumbsArr.length - 1]}</Box>
      </MUIBreadcrumbs>
    )
  }

  return null
}

export default Breadcrumbs
