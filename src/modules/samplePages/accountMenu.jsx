import React, { useEffect } from 'react';
import { 
  Menu, 
  MenuItem, 
  TextField, 
  Button, 
  Divider, 
  Avatar, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Link 
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useAuthMethod, useAuthUser } from "@crema/hooks/AuthHooks";

const AccountMenu = ({ anchorEl, handleClose }) => {
  const open = Boolean(anchorEl);
  const { logout } = useAuthMethod();
  const { user, isAuthenticated } = useAuthUser();
  const navigate = useNavigate();

  // Redirect to signin if user is not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      handleClose();
      navigate('/signin', { 
        state: { from: window.location.pathname },
        search: `?redirect=${encodeURIComponent(window.location.pathname)}`
      });
    }
  }, [isAuthenticated, navigate, handleClose]);

  // If not authenticated, don't render the menu
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: { width: 320, p: 2 }
      }}
    >
      <Link href="#" underline="none">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            alt={user.displayName || "User"} 
            src="images/avatars/avatar-4.jpg" 
            sx={{ mr: 2 }} 
          />
          <div>
            <Typography variant="subtitle1">
              {user.displayName || "Guest"}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {user.email || "No email"}
            </Typography>
          </div>
        </div>
      </Link>

      <Divider sx={{ my: 2 }} />

      <List>
        <ListItem 
          button 
          onClick={() => {
            handleClose();
            navigate('/my-profile');
          }}
        >
          <ListItemText primary="My Profile" />
        </ListItem>
        
        <ListItem 
          button 
          onClick={() => {
            handleClose();
            navigate('/ecommerce/orders');
          }}
        >
          <ListItemText primary="Order History" />
        </ListItem>
      </List>

      <Divider sx={{ my: 2 }} />

      <List>
        <ListItem 
          button 
          onClick={() => {
            handleClose();
            logout();
            navigate('/signin');
          }}
        >
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Menu>
  );
};

export default AccountMenu;