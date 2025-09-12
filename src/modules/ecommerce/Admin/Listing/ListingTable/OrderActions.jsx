import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const OrderActions = ({ data, handleDeleteClick }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton aria-controls="alpha-menu" aria-haspopup="true" onClick={handleClick} size="small">
        <MoreVertIcon />
      </IconButton>

      <Menu
        id="alpha-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem
          style={{ fontSize: 14 }}
          onClick={() => navigate(`/ecommerce/product-view/${data.id}`)}
        >
          View Product
        </MenuItem>
        <MenuItem
          style={{ fontSize: 14 }}
          onClick={() => {
            console.log("Navigating to:", `/ecommerce/edit-products/${data.id}`);
            navigate(`/ecommerce/edit-products/${data.id}`);
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          style={{ fontSize: 14 }}
          onClick={() => handleDeleteClick(data.id)}
        >
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

OrderActions.propTypes = {
  data: PropTypes.object.isRequired,
  handleDeleteClick: PropTypes.func.isRequired,
};

export default OrderActions;
