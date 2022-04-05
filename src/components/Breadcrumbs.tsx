import {Breadcrumbs as MUIBreadcrumbs} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

interface MyBreadcrumbsProps {
  breadcrumbs: string[]
}

const Breadcrumbs = (
  {
    breadcrumbs: breadcrumbsArr
  }: MyBreadcrumbsProps
) => {
  if (breadcrumbsArr) {
    return (
      <MUIBreadcrumbs aria-label="breadcrumb">
        {breadcrumbsArr
          .slice(0, breadcrumbsArr.length - 1)
          .map((breadcrumb, index) => (
            <RouterLink
              key={breadcrumb}
              to={['/systems']
                .concat(breadcrumbsArr.slice(0, index + 1))
                .join('/')}
            >
              {breadcrumb}
            </RouterLink>
          ))}
        <span>{breadcrumbsArr[breadcrumbsArr.length - 1]}</span>
      </MUIBreadcrumbs>
    )
  } else {
    return null
  }
}

export default Breadcrumbs
