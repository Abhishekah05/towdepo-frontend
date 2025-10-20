import React from 'react';
import { Box, Typography, Divider, TextField, Button, Grid, Alert, CircularProgress } from '@mui/material';
import { Fonts } from '@crema/constants/AppEnums';
import PropTypes from 'prop-types';
import PaymentInfo from '../Checkout/PaymentInfo';
import { mediaUrl } from "@crema/constants/AppConst.jsx";

const getTotalPrice = (cartItems) => {
  let total = 0;
  cartItems.forEach((data) => {
    const quantity = data.quantity || 1;
    total += data.originalPrice * quantity;
  });
  return total;
};

const getDiscountPrice = (cartItems) => {
  let totalDiscountAmount = 0;
  cartItems.forEach((data) => {
    const quantity = data.quantity || 1;
    totalDiscountAmount += data.discountAmount * quantity;
  });
  return totalDiscountAmount;
};

const OrderSummary = ({ cartItems, deliveryAvailable = false, deliveryMessage = '', checkingDelivery = false }) => {
  const totalPrice = getTotalPrice(cartItems);
  const discountAmount = getDiscountPrice(cartItems);
  const grandTotal = totalPrice - discountAmount;

  return (
    <Box sx={{ pr: { xs: 0, md: 1 }, mb: 2 }}>
      {/* Title */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: Fonts.BOLD,
          mb: 4,
          fontSize: { xs: 18, md: 20 },
          ml: { xs: 0, md: 5 },
        }}
      >
        Your Order
      </Typography>

      {/* Delivery Availability Status */}
      {checkingDelivery && (
        <Alert severity="info" sx={{ mb: 2, ml: { xs: 0, md: 5 }, mr: { xs: 0, md: 5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={16} />
            Checking delivery availability...
          </Box>
        </Alert>
      )}

      {!deliveryAvailable && deliveryMessage && !checkingDelivery && (
        <Alert severity="warning" sx={{ mb: 2, ml: { xs: 0, md: 5 }, mr: { xs: 0, md: 5 } }}>
          {deliveryMessage}
        </Alert>
      )}

      {/* Product Rows */}
      {cartItems.map((item, idx) => {
        const productImageUrl =
          item.images?.[0] ||
          (item.variant && item.variant[0]?.image) ||
          (item.image && item.image[0]?.src) ||
          'default-image.jpg';

        return (
          <Grid
            container
            spacing={2}
            alignItems="center"
            key={idx}
            sx={{ mb: 2 }}
          >
            {/* Product Image */}
            <Grid item>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 2,
                  overflow: 'hidden',
                  ml: { xs: 0, md: 5 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #eee',
                }}
              >
                <img
                  src={`${mediaUrl}/product/${productImageUrl}`}
                  alt={item.title || item.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            </Grid>

            {/* Product Details */}
            <Grid item xs>
              <Typography sx={{ fontWeight: 500, fontSize: { xs: 14, md: 16 } }}>
                {item.title || item.name}
              </Typography>

              <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                {item.variant || ''}
              </Typography>
              <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                Qty: {item.quantity}
              </Typography>
            </Grid>

            {/* Price */}
            <Grid item>
              <Typography sx={{ fontWeight: 600, mr: { xs: 0, md: 5 } }}>
                ${(item.originalPrice * (item.quantity || 1)).toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        );
      })}

      <Divider sx={{ my: 4 }} />

      {/* Discount Code */}
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 500,
          mb: 2,
          ml: { xs: 0, md: 5 },
        }}
      >
        Discount Code
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 2,
          ml: { xs: 0, md: 5 },
          mr: { xs: 0, md: 5 },
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Add discount code"
          sx={{
            '& .MuiOutlinedInput-root': { borderRadius: 1 },
          }}
        />
        <Button
          variant="outlined"
          sx={{
            borderRadius: 1,
            color: "white",
            px: { xs: 4, md: 10 },
            height: "35px",
            backgroundColor: '#FF6600',
            whiteSpace: 'nowrap',
            '&:hover': {
              backgroundColor: '#e55a00',
            }
          }}
        >
          Apply
        </Button>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Totals */}
      {[
        { label: 'Subtotal', value: `$${totalPrice.toFixed(2)}` },
        { label: 'Discount', value: `$${discountAmount.toFixed(2)}` },
        { label: 'Shipment Cost', value: deliveryAvailable ? '$0.00' : 'N/A' },
      ].map((row, idx) => (
        <Box
          key={idx}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 1,
            ml: { xs: 0, md: 5 },
            mr: { xs: 0, md: 5 },
          }}
        >
          <Typography
            sx={{ fontSize: 14, fontWeight: Fonts.MEDIUM, color: '#333' }}
          >
            {row.label}
          </Typography>
          <Typography
            sx={{ fontSize: 14, fontWeight: Fonts.MEDIUM, color: '#333' }}
          >
            {row.value}
          </Typography>
        </Box>
      ))}

      <Divider sx={{ my: 4 }} />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 2,
          ml: { xs: 0, md: 5 },
          mr: { xs: 0, md: 5 },
        }}
      >
        <Typography
          sx={{ fontSize: 14, fontWeight: Fonts.MEDIUM, color: '#333' }}
        >
          Grand Total
        </Typography>
        <Typography
          sx={{ fontSize: 14, fontWeight: Fonts.MEDIUM, color: '#333' }}
        >
          {deliveryAvailable ? `$${grandTotal.toFixed(2)}` : 'N/A'}
        </Typography>
      </Box>

      {/* Button */}
      <Box sx={{ mb: { xs: 4, md: 10 }, mr: { xs: 0, md: 5 } }}>
        <PaymentInfo 
          deliveryAvailable={deliveryAvailable} 
          checkingDelivery={checkingDelivery}
        />
      </Box>
    </Box>
  );
};

OrderSummary.propTypes = {
  cartItems: PropTypes.array,
  deliveryAvailable: PropTypes.bool,
  deliveryMessage: PropTypes.string,
  checkingDelivery: PropTypes.bool,
};

export default OrderSummary;