import React, { useRef } from 'react';
import { Box, Grid } from '@mui/material';
import AppTextField from '@crema/components/AppFormComponents/AppTextField';
import AppCard from '@crema/components/AppCard';




const ProductContent = () => {
  return (
      <Grid item xs={12}>
          <Box sx={{width:"600px" , marginLeft:"25px",}} >
            <AppTextField
              name='title'
              variant='outlined'
              sx={{
                width: '100%',
                my: 2,
                marginTop: '15px'
                
              }}
              label='Product Name'
            />
          </Box>
      </Grid>
  );
};

export default ProductContent;

