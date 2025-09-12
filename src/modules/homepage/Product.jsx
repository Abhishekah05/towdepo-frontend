import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { FavoriteBorder, Favorite } from '@mui/icons-material'; // Changed to use both outlined and filled icons
import { mediaUrl } from '@crema/constants/AppConst.jsx';
import { addItemToCart } from '@crema/Slices/cartSlice';
import '../samplePages/card.css';

const Product = ({ product: item }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [isFavorite, setIsFavorite] = React.useState(false); // State for favorite toggle

  const handleCardClick = (productId) => {
    navigate(`/ecommerce/product-view/${productId}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addItemToCart({ product: item, quantity: 1 }));
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);

  };

  return (
    <Card
      sx={{
        width: '100%',
        height: isMobile ? '95%' : '85%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease-in-out',
        cursor: 'pointer',
        position: 'relative',
        backgroundColor: '#FFFFFF',
        border: '1px solid #f0f0f0',
        overflow: 'hidden',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          transform: 'translateY(-2px)',
        },
      }}
      onClick={() => handleCardClick(item.id)}
    >
      {/* Product Image Container - Fixed for mobile */}
      <Box
        sx={{
          position: 'relative',
          backgroundColor: '#fafafa',
          height: isMobile ? '220px' : isTablet ? '200px' : '240px',
          minHeight: isMobile ? '220px' : '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          p: isMobile ? 1 : 2,
        }}
      >
        <CardMedia
          component="img"
          src={`${mediaUrl}/product/${item.images[0]?.src}`}
          alt={item.title}
          sx={{
            backgroundColor: '#FFFCF4',
            width: 'auto',
            maxWidth: '100%',
            height: 'auto',
            maxHeight: '100%',
            objectFit: 'contain',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.03)',
            }
          }}
          loading="lazy"
        />
      </Box>

      {/* Product Details */}
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          p: isMobile ? 1.5 : 1.5,
          pt: isMobile ? 1.5 : 0.5,
          pb: isMobile ? 1 : 1.5,
          backgroundColor: '#ffffff'
        }}
      >
        {/* Product Title - Left Aligned */}
        <Typography
          variant="h6"
          sx={{
            fontSize: isMobile ? '18px' : '20px',
            
            fontWeight: 700,
            fontStyle: 'normal',
            lineHeight: '150%',
            letterSpacing: '0%',
            verticalAlign: 'middle',
            mb: 1,
            color: 'black',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            textAlign: 'left',
            marginLeft: isMobile ? '5px' : '10px',
            maxHeight: '3em',
            minHeight: '1.5em',
          }}
        >
          {item.title}
        </Typography>

        {/* Price - Left Aligned */}
        <Typography
          variant="h6"
          sx={{
            fontSize: isMobile ? '15px' : '16px',
            fontWeight: 600,
            fontStyle: 'normal',
            fontFamily: 'Syne, sans-serif',
            lineHeight: '100%',
            letterSpacing: '0%',
            color: '#000000',
            mb: isMobile ? 1.5 : 2,
            mt: '5px',
            textAlign: 'left',
            marginLeft: isMobile ? '5px' : '10px',
          }}
        >
          ${item.mrp}
        </Typography>

        {/* Action Button Row */}
        <Box
          sx={{
            pl: isMobile ? 1 : 2,
            pr: isMobile ? 1 : 2,
            pb: isMobile ? 1 : 1.5,
            pt: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: isMobile ? 1 : 2,

          }}
        >
          {/* Add to Cart Button - Reduced width */}
          <Button
            className="add-to-cart-btn"
            variant="contained"
            onClick={handleAddToCart}
            sx={{
              backgroundColor: '#FD7E14',
              color: 'white',
              fontFamily: "Source Sans Pro, Arial, sans-serif",
              fontWeight: 600,
              fontSize: isMobile ? '0.85rem' : '0.8rem',
              py: isMobile ? 0.4 : 0.8,
              px: isMobile ? 0.5 : 2,
              borderRadius: 1,
              marginTop: isMobile ? 5 : 5,
              textTransform: 'none',
              boxShadow: 'none',
              border: 'none',
              transition: 'all 0.3s ease',
              minWidth: isMobile ? '110px' : '100px',
              width: isMobile ? '110px' : '100px',
              height: isMobile ? '22px' : '32px',
              flex: 'none',
              '&:hover': {
                backgroundColor: '#FD7E14',
                boxShadow: '0 2px 8px rgba(255, 107, 53, 0.3)',

              },
              '&:active': {
                transform: 'translateY(1px)',
              }
            }}
          >
            Add to Cart
          </Button>

          {/* Wishlist Button - Right Side with outlined/filled toggle */}
          <IconButton
            sx={{
              backgroundColor: '#FD7E14',
              marginTop: isMobile ? 5 : 5,
              width: isMobile ? 32 : 36,
              height: isMobile ? 32 : 36,
              color: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: '1px solid rgba(0,0,0,0.08)',
              flexShrink: 0,
              '&:hover': {
                backgroundColor: '#FD7E14',
                transform: 'scale(1.1)',
              },
            }}
            onClick={handleWishlist}
          >
            {isFavorite ? (
              <Favorite sx={{ fontSize: isMobile ? 18 : 20, color: 'white' }} />
            ) : (
              <FavoriteBorder sx={{ fontSize: isMobile ? 18 : 20, color: 'white' }} />
            )}
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

// Parent component that should use CSS Grid for proper alignment
const ProductGrid = ({ products }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(auto-fill, minmax(280px, 1fr))',
          sm: 'repeat(auto-fill, minmax(300px, 1fr))',
          md: 'repeat(auto-fill, minmax(320px, 1fr))',
        },
        gap: { xs: 2, sm: 3, md: 4 },
        justifyContent: 'center',
        width: '100%',
        padding: { xs: 1, sm: 2 },
      }}
    >
      {products.map((product) => (
        <Product key={product.id} product={product} />
      ))}
    </Box>
  );
};

export default Product;
export { ProductGrid };