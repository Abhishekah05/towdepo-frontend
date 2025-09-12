import React from 'react';
import { Box, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import AppCard from '@crema/components/AppCard';
import IntlMessages from '@crema/helpers/IntlMessages';
import { Fonts } from '@crema/constants/AppEnums';
import AppAnimate from '@crema/components/AppAnimate';
import AppGridContainer from '@crema/components/AppGridContainer';
import { postDataApi, putDataApi, useGetDataApi } from '@crema/hooks/APIHooks';

import AppLoader from '@crema/components/AppLoader';
import { useInfoViewActionsContext } from '@crema/context/AppContextProvider/InfoViewContextProvider';
import CartTable from './table';
import OrderSummary from '../OrderSummary';

import { useGetCartItemsQuery, useUpdateCartItemMutation, useRemoveItemFromCartMutation } from '@crema/Slices/cartSlice';

const Carts = () => {



  const infoViewActionsContext = useInfoViewActionsContext();
  const navigate = useNavigate();


  
  const { data, error, isLoading, refetch } = useGetCartItemsQuery();
  
  const [updateCartItem, result] = useUpdateCartItemMutation();

  const [deleteCartItem, ...rest] = useRemoveItemFromCartMutation();


  //useRemoveItemFromCartMutation
  
  if(isLoading) return <h1> Loading</h1>

  const onRemoveItem = (product) => {
    deleteCartItem(product.id);
    refetch();
   
  };

  const onDecrement = (data) => {
    handleUpdateQuantity(data.id,data.count - 1);
    
  };

  const handleUpdateQuantity = async (id, count) => {
    await updateCartItem({ id, count });
    refetch();
  };
  const onIncrement = (data) => {

    handleUpdateQuantity(data.id,data.count + 1);
    
  };

  return (
    <>
      {isLoading ? (
        <AppLoader />
      ) : (
        <AppAnimate animation='transition.slideUpIn' delay={200}>
          <Box>
            <Box
              component='h2'
              sx={{
                color: 'text.primary',
                fontWeight: Fonts.BOLD,
                mb: 6,
                fontSize: 16,
              }}
            >
              <IntlMessages id='sidebar.ecommerce.cart' />
            </Box>
            <AppGridContainer>
              <Grid item xs={12} md={8}>
                <AppCard
                  contentStyle={{ px: 0 }}
                  footer={
                    <Box
                      sx={{
                        mt: 4,
                        width: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Button
                        variant='contained'
                        color='primary'
                        onClick={() => {
                          navigate('/ecommerce/products');
                        }}
                      >
                        Continue Shopping
                      </Button>
                      <Button
                        variant='contained'
                        color='secondary'
                        onClick={() => {
                          navigate('/ecommerce/checkout');
                        }}
                      >
                        Checkout
                      </Button>
                    </Box>
                  }
                >
                  <CartTable
                    cartItems={data.results}
                    onRemoveItem={onRemoveItem}
                    onIncrement={onIncrement}
                    onDecrement={onDecrement}
                  />
                </AppCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <OrderSummary cartItems={data.results} />
              </Grid>
            </AppGridContainer>
          </Box>
        </AppAnimate>
      )}
    </>
  );
};

export default Carts;
