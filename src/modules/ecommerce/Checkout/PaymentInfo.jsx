import React from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { Fonts } from '@crema/constants/AppEnums';
import { useLayoutContext } from '@crema/context/AppContextProvider/LayoutContextProvider';
import { useCreateOrderMutation } from '@crema/Slices/orderSlice';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '@crema/Slices/cartSlice';
import PropTypes from 'prop-types';

const PaymentInfo = ({ deliveryAvailable = false, checkingDelivery = false }) => {
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const cartItems = useSelector((state) => state.cart.items);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedAddress } = useLayoutContext();

  const handlePlaceOrder = React.useCallback(async () => {
    if (!deliveryAvailable) {
      alert('Delivery is not available to your selected address. Please choose a different address or check the delivery status.');
      return;
    }

    if (!selectedAddress) {
      alert('Please select a delivery address.');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items to your cart.');
      return;
    }

    try {
      const orderPromise = createOrder({ selectedAddress, cartItems });
      await new Promise((resolve) => setTimeout(resolve, 300));
      const result = await orderPromise;
      if (result.data) {
        dispatch(clearCart());
        navigate(`/ecommerce/confirmation/${result.data.id}`);
      }
    } catch (err) {
      console.error('Order placement failed', err);
      alert('Order placement failed. Please try again.');
    }
  }, [createOrder, selectedAddress, cartItems, dispatch, navigate, deliveryAvailable]);

  const getButtonText = () => {
    if (checkingDelivery) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={16} color="inherit" />
          Checking Delivery...
        </Box>
      );
    }
    if (isLoading) return 'Processing...';
    if (!deliveryAvailable) return 'Delivery Not Available';
    if (!selectedAddress) return 'Select Address';
    if (cartItems.length === 0) return 'Cart Empty';
    return 'Place Order';
  };

  return (
    <Box sx={{ 
      mt: { xs: 4, md: 10 },
      display: 'flex',
      justifyContent: 'center',
      width: '100%'
    }}>
      <Button
        variant="contained"
        sx={{
          backgroundColor: deliveryAvailable && !checkingDelivery ? '#FF6600' : 'grey.400',
          borderRadius: 1,
          py: 1.2,
          width: { xs: '90%', sm: '80%', md: '100%' },
          maxWidth: 400,
          textTransform: 'none',
          fontSize: 16,
          '&:hover': {
            backgroundColor: deliveryAvailable && !checkingDelivery ? '#e55a00' : 'grey.400',
          }
        }}
        disabled={isLoading || !deliveryAvailable || cartItems.length === 0 || !selectedAddress || checkingDelivery}
        onClick={handlePlaceOrder}
      >
        {getButtonText()}
      </Button>
    </Box>
  );
};

PaymentInfo.propTypes = {
  deliveryAvailable: PropTypes.bool,
  checkingDelivery: PropTypes.bool,
};

export default PaymentInfo;