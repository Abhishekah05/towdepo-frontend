import React from 'react';
import { Box, Button } from '@mui/material';
import { Fonts } from '@crema/constants/AppEnums';
import { useLayoutContext } from '@crema/context/AppContextProvider/LayoutContextProvider';
import { useCreateOrderMutation } from '@crema/Slices/orderSlice';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '@crema/Slices/cartSlice';

const PaymentInfo = () => {
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const cartItems = useSelector((state) => state.cart.items);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedAddress } = useLayoutContext();

  const handlePlaceOrder = React.useCallback(async () => {
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
    }
  }, [createOrder, selectedAddress, cartItems, dispatch, navigate]);

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
          backgroundColor: '#FF6600',
          borderRadius: 1,
          py: 1.2,
          width: { xs: '90%', sm: '80%', md: '100%' },
          maxWidth: 400,
          textTransform: 'none',
          fontSize: 16,
          '&:hover': {
            backgroundColor: '#e55a00',
          }
        }}
        disabled={isLoading}
        onClick={handlePlaceOrder}
      >
        {isLoading ? 'Processing...' : 'Place Order'}
      </Button>
    </Box>
  );
};

export default PaymentInfo;