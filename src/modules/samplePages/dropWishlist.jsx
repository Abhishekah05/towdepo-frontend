import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import { mediaUrl } from "@crema/constants/AppConst.jsx";
import { removeItemFromWishlist, clearWishlist } from '@crema/Slices/wishlistSlice';
import { addItemToCart } from '@crema/Slices/cartSlice';

const DropWishlist = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state?.wishlist?.items);

  // Add state to manage the visibility of the wishlist dropdown
  const [isWishlistOpen, setIsWishlistOpen] = useState(true);

  const removeItem = (item) => {
    dispatch(removeItemFromWishlist(item));
  };

  const addToCartAndClearWishlist = () => {
    wishlistItems.forEach((item) => {
      // Ensure item has valid price before adding to cart
      const price = item.mrp && !isNaN(item.mrp) ? item.mrp : 0; // Fallback to 0 if no valid price

      if (price === 0) {
        console.warn(`Item ${item.title} has no valid price!`);
      }

      // Keep the existing quantity from the wishlist
      const itemToAdd = {
        ...item,
        totalPrice: price * item.quantity, // Calculate total price
        price, // Ensure price is set
      };

      // Add item with quantity intact
      dispatch(addItemToCart(itemToAdd)); // Add item with price to cart
      dispatch(removeItemFromWishlist(item)); // Remove item from wishlist
    });
    dispatch(clearWishlist()); // Clear the wishlist
  };


  // Return null when wishlist dropdown is not open to avoid rendering empty space
  if (!isWishlistOpen) return null;

  if (wishlistItems?.length === 0) {
    return (
      <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '8px',
        backgroundColor: '#f7f7f7',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
      >
        <h1 style={{ fontSize: '18px', margin: 0 }}>Wishlist is Empty</h1>
      </Box>
    );
  }

  return (
    <Box
      className="drop_wishlist"
      sx={{
        maxHeight: '400px',
        overflowY: 'auto',
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <List className="dropwishlist" sx={{ flexGrow: 1 }}>
        {wishlistItems?.map((item) => (
          <React.Fragment key={item.id}>
            <ListItem
              className="dropwishlist__item"
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 16px',
              }}
            >
              <Box
                className="dropwishlist__item-image"
                sx={{ width: 60, height: 80, marginRight: 2 }}
              >
                <a href="/ecommerce/product_detail">
                  <img
                    src={`${mediaUrl}/product/${item.images[0]?.src}`}
                    alt={item.title}
                    className="image__tag"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </a>
              </Box>
              <Box
                className="dropwishlist__item-info"
                sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}
              >
                <ListItemText
                  primary={
                    <a href="/ecommerce/product_detail" style={{ textDecoration: 'none' }}>
                      {item.title}
                    </a>
                  }
                  sx={{ marginBottom: 1 }}
                />
                <div className="dropwishlist__item-price" sx={{ fontSize: '1rem', color: 'text.secondary' }}>
                  ${item.mrp}
                </div>
              </Box>
              <button
                type="button"
                className="dropwishlist__item-remove"
                onClick={() => removeItem(item)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <CloseIcon sx={{ fontSize: 16 }} />
              </button>
            </ListItem>
          <Divider/>
          </React.Fragment>
        ))}
        <Box className="dropwishlist__actions" sx={{ display: 'flex', gap: 1 ,ml:30 ,mr:30, mt:10}}>
        <Button variant="contained" color="primary" onClick={addToCartAndClearWishlist}>
          Add to Cart
        </Button>
      </Box>
      </List>


      
    </Box>
  );
};

export default DropWishlist;
