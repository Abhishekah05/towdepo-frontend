import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
// Styled components for custom styling
const StyledCard = styled(Card)(({ theme, bgcolor }) => ({
  height: '220px',
  borderRadius: '16px',
  width: '400px',
  border: 'none',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF0E6 100%)',
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
  },
}));

const StyledCardContent = styled(CardContent)({
  padding: '24px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
});

const CategoryText = styled(Typography)({
  fontSize: '26px',
  fontWeight: 700,
  marginTop: '40px',
  color: 'black'
});

const ProductTitle = styled(Typography)({
  fontSize: '28px',
  fontWeight: 700,
  marginBottom: '10px',
  color: 'black'
});

const ViewAllButton = styled(Button)({
  fontSize: '14px',
  fontWeight: 600,
  color: '#666',
  textTransform: 'none',
  padding: '4px 0',
  minWidth: 'auto',
  justifyContent: 'flex-start',
  '&:hover': {
    backgroundColor: 'transparent',
    color: '#333',
  },
});

const ProductImage = styled('img')({
  position: 'absolute',
  right: '16px',
  bottom: '35px',
  width: '120px',
  height: '160px',

  objectFit: 'contain',
});

// Product data - only 3 cards as requested
const products = [
  {
    id: 1,
    category: 'Custom',
    title: 'Safety Shirts',
    gradient: 'linear-gradient(135deg, #FFF5E6 0%, #FFE4B8 100%)',
    imagePath: 'assets/homepageimages/Shirt.png',
  },
  {
    id: 2,
    category: 'Affordable',
    title: 'Truck Tyres',
    gradient: 'linear-gradient(135deg, #F5F5F5 0%, #E8E8E8 100%)',
    imagePath: 'assets/homepageimages/Tyre.png',
  },
  {
    id: 3,
    category: 'Custom',
    title: 'Safety Jackets',
    gradient: 'linear-gradient(135deg, #FFE8E8 0%, #FFCCC7 100%)',
    imagePath: 'assets/homepageimages/jacket.png',
  },
];

// Individual Product Card Component
const ProductCard = ({ product }) => {
    const navigate = useNavigate();
  const handleViewAll = () => {
  navigate(`/ecommerce/products?category=${encodeURIComponent(product.title)}`);
    // Add your navigation logic here
  };

  return (
    <StyledCard bgcolor={product.gradient}>
      <StyledCardContent>
        <Box>
          <CategoryText>{product.category}</CategoryText>
          <ProductTitle>{product.title}</ProductTitle>
        </Box>

        <ViewAllButton
          onClick={handleViewAll}
          endIcon={<Box component="span" sx={{ marginLeft: '4px' }}>→</Box>}
        >
          View all
        </ViewAllButton>

        {product.imagePath && (
          <ProductImage src={product.imagePath} alt={product.title} />
        )}
      </StyledCardContent>
    </StyledCard>
  );
};

// Main Component
const ProductRange = () => {
  return (
    <Box
      sx={{
        my: { xs: 4, sm: 5, md: 6 },
        width: "100%",
        padding: { xs: "0 16px 0 8px", sm: "0 24px 0 12px", md: 0, lg: 0, xl: 0 }
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          py: 4,
          px: { xs: 0, sm: 0, md: 0 } // Remove container padding for full width
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            color: '#333',
            marginBottom: '32px',
            fontSize: { xs: '28px', md: '36px' },
            paddingLeft: { xs: '16px', sm: '24px', md: '0px' } // Match your homepage padding
          }}
        >
          Explore our range
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "center", sm: "space-between", md: "space-between" },
            flexWrap: "wrap",
            gap: 3
          }}
        >
          {products.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default ProductRange;