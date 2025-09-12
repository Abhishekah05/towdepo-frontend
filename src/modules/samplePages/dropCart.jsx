import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Alert,
  Snackbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { mediaUrl } from "@crema/constants/AppConst.jsx";
import { removeItemFromCart } from '@crema/Slices/cartSlice';

const Dropcart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  
  // State for authentication status and notifications
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(true);
  const [showAuthAlert, setShowAuthAlert] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  // Calculate total price
  const getTotalPrice = (cartItems) => {
    let total = 0;
    cartItems.forEach((item) => {
      const itemPrice = item.totalPrice || item.mrp || 0;
      const quantity = item.quantity || 1;
      total += itemPrice * quantity;
    });
    return total;
  };

  const totalPrice = cart.totalPrice;

  const removeItem = (item) => {
    dispatch(removeItemFromCart(item));
  };

  // Handle navigation with authentication check
  const handleNavigation = (path) => {
    if (isAuthenticated) {
      setIsCartOpen(false);
      navigate(path);
    } else {
      // Store the intended destination before redirecting to login
      localStorage.setItem('intendedDestination', path);
      setShowAuthAlert(true);
      
      // Close the cart dropdown after a brief delay
      setTimeout(() => {
        setIsCartOpen(false);
        navigate('/signin', { 
          search: `?redirect=${encodeURIComponent(path)}`
        });
      }, 1500);
    }
  };

  const handleViewCart = () => {
    handleNavigation('/ecommerce/cart');
  };

  const handleCheckout = () => {
    handleNavigation('/ecommerce/checkout');
  };

  if (!isCartOpen) return null;

  return (
    <Box className="dropcart">
      {/* Authentication Alert */}
      <Snackbar 
        open={showAuthAlert} 
        autoHideDuration={1500}
        onClose={() => setShowAuthAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="info" sx={{ width: '100%' }}>
          Please sign in to continue
        </Alert>
      </Snackbar>

      {cart.items.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '150px',
            borderRadius: '8px',
            backgroundColor: '#f7f7f7',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h1 style={{ fontSize: '18px', margin: 0 }}>Cart is empty</h1>
        </Box>
      ) : (
        <>
          <List className="dropcart__list">
            {cart.items.map((item) => {
              const itemImageUrl =
                item.images[0] ||
                (item.variant && item.variant[0]?.image) ||
                (item.image && item.image[0]) ||
                'default-image.jpg';
              
              const price = item.totalPrice || item.mrp || 0;
              const quantity = item.quantity || 1;

              return (
                <React.Fragment key={item.id}>
                  <ListItem className="dropcart__item">
                    <Box className="dropcart__item-image">
                      <a href={`/ecommerce/product_detail/${item.id}`}>
                        <img
                          src={`${mediaUrl}/product/${itemImageUrl}`}
                          alt={item.title || 'Product Image'}
                          className="image__tag"
                          onError={(e) =>
                            (e.target.src = '/path/to/default-image.jpg')
                          }
                        />
                      </a>
                    </Box>
                    <div className="dropcart__item-info">
                      <ListItemText
                        primary={
                          <a href={`/ecommerce/product_detail/${item.id}`}>
                            {item.title}
                          </a>
                        }
                      />
                      <div className="dropcart__item-meta">
                        <div className="dropcart__item-quantity">{quantity}</div>
                        <div className="dropcart__item-price">
                          ${price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="dropcart__item-remove"
                      onClick={() => {
                        removeItem(item);
                      }}
                    >
                      <svg width="10" height="10">
                        <path d="M8.8,8.8L8.8,8.8c-0.4,0.4-1,0.4-1.4,0L5,6.4L2.6,8.8c-0.4,0.4-1,0.4-1.4,0l0,0c-0.4-0.4-0.4-1,0-1.4L3.6,5L1.2,2.6c-0.4-0.4-0.4-1,0-1.4l0,0c0.4-0.4,1-0.4,1.4,0L5,3.6l2.4-2.4c0.4-0.4,1-0.4,1.4,0l0,0c0.4,0.4,0.4,1,0,1.4L6.4,5l2.4,2.4C9.2,7.8,9.2,8.4,8.8,8.8z"></path>
                      </svg>
                    </button>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              );
            })}
          </List>

          <Box className="dropcart__totals">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th">Subtotal</TableCell>
                  <TableCell>${totalPrice.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">Shipping</TableCell>
                  <TableCell>$00.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">Tax</TableCell>
                  <TableCell>$0.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">Total</TableCell>
                  <TableCell>${(totalPrice).toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>

          <Box className="dropcart__actions" sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" color="primary" onClick={handleViewCart}>
              View Cart
            </Button>
            <Button variant="contained" color="primary" onClick={handleCheckout}>
              Checkout
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Dropcart;