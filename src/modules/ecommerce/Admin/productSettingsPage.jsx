import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetProductByIdQuery } from '@crema/Slices/productsSlice';
import AddEditProduct from './ProductSettings';
import AppLoader from "../../../@crema/components/AppLoader";
import { Box, CircularProgress, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ProductEditPage = () => {
  const { id } = useParams();
  const { data: product, isLoading, isError } = useGetProductByIdQuery(id);

  if (isLoading) {
    return (
        <AppLoader />
     );
  }

  if (isError) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '80vh' 
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 50, color: 'error.main', mb: 1 }} />
        {/* <Typography variant="h6" color="error">
          Error loading product...
        </Typography> */}
      </Box>
    );
  }

  return <AddEditProduct selectedProd={product} />;
};

export default ProductEditPage;
