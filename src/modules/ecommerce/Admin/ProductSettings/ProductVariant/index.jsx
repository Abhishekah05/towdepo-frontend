import React, { useState, useEffect } from 'react';
import ProductVariantList from './ProductVariantList';
import ProductVariantForm from './ProductVariantForm';
import { Grid, Typography, Box } from '@mui/material';
import AppCard from "@crema/components/AppCard";
import { useGetProductByIdQuery } from '@crema/Slices/productsSlice';

function ProductVariant({ selectedProd }) {
  const [variantToEdit, setVariantToEdit] = useState(null);

  // Use the RTK Query hook with proper options for caching
  const {
    data: productData,
    refetch: refetchProduct,
    isLoading
  } = useGetProductByIdQuery(
    selectedProd?.id,
    {
      skip: !selectedProd?.id,
      refetchOnMountOrArgChange: true
    }
  );

  // Make sure we always use the most up-to-date data
  const currentProduct = productData || selectedProd;

  // Function to handle editing a variant
  const handleEdit = (variant) => {
    setVariantToEdit(variant);
  };

  const handleSave = async (updatedVariant) => {
    // Clear the editing state
    setVariantToEdit(null);

    // Refetch the product data to get the latest variants
    await refetchProduct();
  };

  const handleVariantUpdated = async () => {
    // Refetch the product data after any variant changes
    await refetchProduct();
  };

  return (
    <Grid item xs={12} lg={8}>
      <Box>
        <Typography variant="h4" sx={{ marginLeft: "30px" }}>
          Product Variant Management
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {/* Left Side: Product Variant Form */}
          <AppCard sx={{ width: '55%' }}>
            <ProductVariantForm
              variantToEdit={variantToEdit}
              onSave={handleSave}
              selectedProd={currentProduct}
            />
          </AppCard>

          {/* Right Side: Higher Positioned Existing Variants */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              alignSelf: 'flex-start',
              mt: '-135px',
              marginRight: "230px"
            }}
          >
            <ProductVariantList
              onEdit={handleEdit}
              selectedProd={currentProduct}
              onVariantUpdated={handleVariantUpdated}
              key={JSON.stringify(currentProduct?.variant)} // Add key to force re-render
            />
          </Box>
        </Box>
      </Box>
    </Grid>
  );
}

export default ProductVariant;