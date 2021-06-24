import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import {Link as RouterLink} from 'react-router-dom';

const myBreadcrumbs = ({breadcrumbs}) => {
    if (breadcrumbs) {
        return (
            <Breadcrumbs aria-label="breadcrumb">
                {
                    (breadcrumbs.slice(0, breadcrumbs.length - 1)).map((breadcrumb, index) => (
                        <RouterLink key={breadcrumb}
                                    to={["/systems"].concat(breadcrumbs.slice(0, index + 1)).join("/")}>
                            {breadcrumb}
                        </RouterLink>
                    ))}
                <span>{breadcrumbs[breadcrumbs.length - 1]}</span>
            </Breadcrumbs>
        );
    } else {
        return null;
    }

}

export default myBreadcrumbs