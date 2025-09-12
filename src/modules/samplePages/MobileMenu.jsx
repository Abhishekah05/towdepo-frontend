import React from "react";
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HomeIcon from "@mui/icons-material/Home"; // Added Home icon
import { useSelector } from "react-redux";
import {
  useLayoutContext,
  useLayoutActionsContext,
} from "@crema/context/AppContextProvider/LayoutContextProvider";
import { Link } from "react-router-dom";

const MobileMenu = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const { openMobileMenu } = useLayoutContext();
  const { setOpenMobileMenu } = useLayoutActionsContext();

  const handleMenuItemClick = () => {
    setOpenMobileMenu(false);
  };

  const handleClose = () => {
    setOpenMobileMenu(false);
  };

  return (
    <Box
      className={`mobile-menu ${openMobileMenu ? "mobile-menu--open" : ""}`}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1200,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <Box
        className="mobile-menu__backdrop"
        onClick={handleClose}
        sx={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
      />
      <Box
        className="mobile-menu__body"
        sx={{
          width: "80%",
          maxWidth: 300,
          height: "100%",
          backgroundColor: "#fff",
          boxShadow: 3,
        }}
      >
        <IconButton
          className="mobile-menu__close"
          onClick={handleClose}
          sx={{ position: "absolute", top: 16, right: 16 }}
        >
          <CloseIcon />
        </IconButton>
        <Box className="mobile-menu__panel">
          <Box
            className="mobile-menu__panel-header"
            sx={{ padding: 2, borderBottom: "1px solid #eee" }}
          >
            <Box className="mobile-menu__panel-title" sx={{ fontWeight: 600 }}>
              Menu
            </Box>
          </Box>
          <Box className="mobile-menu__panel-body">
            <List>
              {/* Home - Added as first item */}
              <ListItem
                button
                component={Link}
                to="/home"
                onClick={handleMenuItemClick}
                sx={{
                  "&:hover": {
                    backgroundColor: "#f2630a",
                  },
                }}
              >
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>

              {/* Cart */}
              {/* <ListItem
                button
                component={Link}
                to="/ecommerce/cart"
                onClick={handleMenuItemClick}
                sx={{
                  "&:hover": {
                    backgroundColor: "#f2630a",
                  },
                }}
              >
                <ListItemIcon>
                  <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="Cart" />
              </ListItem> */}

              {/* My Orders */}
              <ListItem
                button
                component={Link}
                to="/ecommerce/orders"
                onClick={handleMenuItemClick}
                sx={{
                  "&:hover": {
                    backgroundColor: "#f2630a",
                  },
                }}
              >
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="My Orders" />
              </ListItem>

              {/* Wishlist */}
              {/* <ListItem
                button
                component={Link}
                to="/wishlist"
                onClick={handleMenuItemClick}
                sx={{
                  "&:hover": {
                    backgroundColor: "#f2630a",
                  },
                }}
              >
                <ListItemIcon>
                  <FavoriteIcon />
                </ListItemIcon>
                <ListItemText primary="Wishlist" />
              </ListItem> */}

              {/* Account */}
              <ListItem
                button
                component={Link}
                to="/my-profile"
                onClick={handleMenuItemClick}
                sx={{
                  "&:hover": {
                    backgroundColor: "#f2630a",
                  },
                }}
              >
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Account" />
              </ListItem>
            </List>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MobileMenu;