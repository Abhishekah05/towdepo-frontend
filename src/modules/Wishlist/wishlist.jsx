import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { mediaUrl } from "@crema/constants/AppConst.jsx";
import { removeItemFromWishlist } from '@crema/Slices/wishlistSlice';
import { addItemToCart } from '@crema/Slices/cartSlice';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state?.wishlist?.items);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const removeItem = (item) => {
    dispatch(removeItemFromWishlist(item));
  };

  const addToCart = (item) => {
    const price = item.mrp && !isNaN(item.mrp) ? item.mrp : 0;
    dispatch(addItemToCart({ ...item, price, totalPrice: price * item.quantity }));
    dispatch(removeItemFromWishlist(item));
  };

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="70vh"
      >
        <Typography variant="h5" color="textSecondary">
          Your Wishlist is Empty
        </Typography>
      </Box>
    );
  }

  return (
    <Box padding={3}>
      <Typography variant="h4" mb={3}>
        My Wishlist
      </Typography>
      <List>
        {wishlistItems.map((item) => (
          <React.Fragment key={item.id}>
            <ListItem
              alignItems="flex-start"
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 2,
                flexDirection: isMobile ? 'column' : 'row',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: 2, width: '100%' }}>
                <ListItemAvatar>
                  <Avatar
                    variant="square"
                    src={`${mediaUrl}/product/${item.images[0]?.src}`}
                    alt={item.title}
                    sx={{ width: 80, height: 80 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={item.title}
                  secondary={`$${item.mrp}`}
                  sx={{ flex: 1 }}
                />
              </Box>
              <Box sx={{
                display: 'flex',
                gap: 1,
                width: isMobile ? '100%' : 'auto',
                justifyContent: isMobile ? 'space-between' : 'flex-end',
              }}>
                <Button
                  variant="contained"
                  color="primary"
                  size={isMobile ? 'medium' : 'small'}
                  onClick={() => addToCart(item)}
                  fullWidth={isMobile}
                  sx={{
                    minWidth: isMobile ? 'auto' : 120,
                  }}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size={isMobile ? 'medium' : 'small'}
                  startIcon={!isMobile && <CloseIcon />}
                  onClick={() => removeItem(item)}
                  fullWidth={isMobile}
                  sx={{
                    minWidth: isMobile ? 'auto' : 120,
                  }}
                >
                  {isMobile ? <CloseIcon /> : 'Remove'}
                </Button>
              </Box>
            </ListItem>
            <Divider sx={{ my: 1 }} />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default WishlistPage;