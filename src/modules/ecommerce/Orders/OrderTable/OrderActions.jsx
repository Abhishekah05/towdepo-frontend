import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

const OrderActions = ({ id, onDeleteOrder, onCancelOrder, orderStatus }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleViewOrder = () => {
    navigate(`/ecommerce/order_detail/${id}`);
    handleClose();
  };

  const handleCancelOrder = () => {
    onCancelOrder(id, orderStatus);
    handleClose();
  };

  return (
    <Box>
      <IconButton
        aria-controls="order-actions-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="order-actions-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem style={{ fontSize: 14 }} onClick={handleViewOrder}>
          View Order
        </MenuItem>
        <MenuItem style={{ fontSize: 14 }} onClick={() => onDeleteOrder(id)}>
          Delete
        </MenuItem>
        <MenuItem style={{ fontSize: 14 }} onClick={handleCancelOrder}>
          Cancel Order
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default OrderActions;