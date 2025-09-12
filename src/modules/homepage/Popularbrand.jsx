import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Divider,
  IconButton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';  // ✅ Correct import
import useMediaQuery from '@mui/material/useMediaQuery'; // ✅ Add this
import { ChevronLeft, ChevronRight } from '@mui/icons-material'; // ✅ Add icons
import { useGetProductsQuery } from '@crema/Slices/productsSlice';
import Product from './Product';


const Popularbrand = ({ type }) => {
  const [page] = useState(1);
  const itemsPerPage = 10;
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const { data, isLoading } = useGetProductsQuery({ page, limit: itemsPerPage });
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleCardClick = (productId) => {
    navigate(`/ecommerce/product-view/${productId}`);
  };

  // const handleScroll = (direction) => {
  //   const container = scrollContainerRef.current;
  //   if (!container) return;

  //   const scrollAmount = isMobile ? 280 : 400;
  //   if (direction === 'left') {
  //     container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  //   } else {
  //     container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  //   }
  // };

  // Update arrow visibility on scroll and resize
  // useEffect(() => {
  //   const container = scrollContainerRef.current;
  //   if (!container) return;

  //   const updateArrowVisibility = () => {
  //     setShowLeftArrow(container.scrollLeft > 0);
  //     setShowRightArrow(
  //       container.scrollLeft < container.scrollWidth - container.clientWidth - 10
  //     );
  //   };

  //   container.addEventListener('scroll', updateArrowVisibility);
  //   window.addEventListener('resize', updateArrowVisibility);

  //   // Initial check
  //   updateArrowVisibility();

  //   return () => {
  //     container.removeEventListener('scroll', updateArrowVisibility);
  //     window.removeEventListener('resize', updateArrowVisibility);
  //   };
  // }, [data, isMobile]);

  const filterByCategory = (data, categoryName) => {
    if (!data || !data.products) return [];
    return data.products.filter(product => product?.category?.name === categoryName);
  };

  let filteredData = [];
  if (data) {
    filteredData = filterByCategory(data, type);
  }

  const productsToShow = filteredData.slice(0, 16);

  return (
    <Box sx={{
      padding: { xs: 2, sm: 3, md: 4 },
      mb: isMobile ? 0 : -20,
      position: 'relative'
    }}>
      <Typography
        variant="h1"
        component="h1"
        gutterBottom
        sx={{

          fontWeight: 700,
          fontSize: { xs: '1.3rem', sm: '1.8rem', md: '2.2rem' },
          lineHeight: 1,
          mb: { xs: 1, sm: 2, md: 3 },
          textAlign: 'left',
          color: '#000000',
        }}
      >
        {type}
      </Typography>
      <br />

      <Box
        ref={scrollContainerRef}
        sx={{
          display: 'flex',
          overflowX: isMobile ? 'auto' : 'hidden',
          overflowY: 'hidden',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          pb: 2,
          ...(isMobile ? {
            scrollSnapType: 'x mandatory',
            gap: 2,
            '& > *': {
              flex: '0 0 calc(85% - 16px)',
              scrollSnapAlign: 'start',
            }
          } : {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: { xs: 2, sm: 3, md: 4 },
            overflow: 'visible',
          })
        }}
      >
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : productsToShow?.length > 0 ? (
          productsToShow.map((item, index) => (
            <Box
              key={index}
              sx={isMobile ? {
                minWidth: '250px',
                flexShrink: 0
              } : {}}
            >
              <Product
                product={item}
                onCardClick={handleCardClick}
              />
            </Box>
          ))
        ) : (
          <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
            <Typography>No products available.</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Popularbrand;

