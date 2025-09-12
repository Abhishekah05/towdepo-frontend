import React from 'react';
import { Box, Avatar, Typography, Button, Divider, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import { Fonts } from '@crema/constants/AppEnums';
import { mediaUrl } from "@crema/constants/AppConst.jsx";

const MobileTableItem = ({ data, onRemoveItem, onIncrement, onDecrement }) => {
  const productImageUrl =
    data.images[0] ||
    (data.variant && data.variant[0]?.image) ||
    (data.image && data.image[0]?.src) ||
    'default-image.jpg';
  const price = Number(data?.price) || 0;
  const totalPrice = Number(data?.totalPrice) || price * (data?.quantity || 1);

  const handleDecrement = () => {
    if (data.quantity > 1) {
      onDecrement(data);
    }
  };

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        p: 2,
        position: 'relative',
      }}
    >
      <IconButton
        sx={{ position: 'absolute', top: 8, right: 8 }}
        onClick={() => onRemoveItem(data)}
        aria-label="Remove item"
        title="Remove item"
      >
        <CloseIcon />
      </IconButton>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Avatar
          sx={{ width: 80, height: 80 }}
          src={`${mediaUrl}/product/${productImageUrl}`}
          alt={data.title || "Product Image"}
        />
        <Box>
          <Typography fontWeight={Fonts.MEDIUM}>
            {data.sku} - {data.title}
          </Typography>
          <Typography color="text.secondary" mt={1}>
            ${price.toFixed(2)}
          </Typography>
        </Box>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid',
            borderColor: 'text.secondary',
            borderRadius: 4,
            height: 36,
          }}
        >
          <IconButton
            onClick={handleDecrement}
            aria-label="Decrease quantity"
            title="Decrease quantity"
            size="small"
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
          <Typography px={2}>{data.quantity || 1}</Typography>
          <IconButton
            onClick={() => onIncrement(data)}
            aria-label="Increase quantity"
            title="Increase quantity"
            size="small"
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
        
        <Typography fontWeight={Fonts.MEDIUM}>
          ${totalPrice.toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );
};

MobileTableItem.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    sku: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    totalPrice: PropTypes.number,
    quantity: PropTypes.number,
    images: PropTypes.array,
    image: PropTypes.string,
  }).isRequired,
  onDecrement: PropTypes.func.isRequired,
  onIncrement: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
};

export default MobileTableItem;