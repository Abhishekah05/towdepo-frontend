import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetProductByIdQuery } from '@crema/Slices/productsSlice';
import AddEditProduct from '../AddEditProduct';
import { Box } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AppLoader from '../../../../@crema/components/AppLoader';

const ProductEditPage = () => {
  const { id } = useParams();
  const { data: product, isLoading, isError, refetch } = useGetProductByIdQuery(id);

  if (isLoading) {
    return <AppLoader />;
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
      </Box>
    );
  }

  return product && <AddEditProduct selectedProd={product}  />;
};

export default ProductEditPage;
