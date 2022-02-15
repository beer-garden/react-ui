import Breadcrumbs from '@mui/material/Breadcrumbs'
import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'

interface MyBreadcrumbsProps {
  breadcrumbs: string[]
}

const myBreadcrumbs: FC<MyBreadcrumbsProps> = ({
  breadcrumbs,
}: MyBreadcrumbsProps) => {
  if (breadcrumbs) {
    return (
      <Breadcrumbs aria-label="breadcrumb">
        {breadcrumbs
          .slice(0, breadcrumbs.length - 1)
          .map((breadcrumb, index) => (
            <RouterLink
              key={breadcrumb}
              to={['/systems']
                .concat(breadcrumbs.slice(0, index + 1))
                .join('/')}
            >
              {breadcrumb}
            </RouterLink>
          ))}
        <span>{breadcrumbs[breadcrumbs.length - 1]}</span>
      </Breadcrumbs>
    )
  } else {
    return null
  }
}

export default myBreadcrumbs
