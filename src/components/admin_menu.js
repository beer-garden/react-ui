import React from 'react';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { Link as RouterLink } from 'react-router-dom';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const AdminMenuTabs = ({data}) => {

  const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

  return (
    <Box >
        <Button color="default" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} >
          Admin
        </Button>
        <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        >
        <MenuItem onClick={handleClose} component={RouterLink} to="/admin/systems" >Systems</MenuItem>
        <MenuItem onClick={handleClose} component={RouterLink} to="/admin/gardens">Gardens</MenuItem>
        </Menu>
    </Box>
  );
};


export default AdminMenuTabs