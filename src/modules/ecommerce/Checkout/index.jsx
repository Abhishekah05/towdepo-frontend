import React, { useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import AppCard from '@crema/components/AppCard';
import IntlMessages from '@crema/helpers/IntlMessages';
import { Fonts } from '@crema/constants/AppEnums';

import AppAnimate from '@crema/components/AppAnimate';
import AppGridContainer from '@crema/components/AppGridContainer';
import { useGetDataApi } from '@crema/hooks/APIHooks';

import AppLoader from '@crema/components/AppLoader';
import DeliveryAddress from './DeliveryAddress';
import OrderSummary from '../OrderSummary';

import { useLayoutContext, useLayoutActionsContext } from '@crema/context/AppContextProvider/LayoutContextProvider';
import { useSelector } from 'react-redux';

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const [{ apiData: address, loading }] = useGetDataApi('/address', []);
  const { selectedAddress } = useLayoutContext();
  const { setSelectedAddress } = useLayoutActionsContext();

  useEffect(() => {
    console.log(selectedAddress);
  }, [selectedAddress]);

  return (
    <>
      {loading ? (
        <AppLoader />
      ) : (
        <AppAnimate animation='transition.slideUpIn' delay={200}>
          <Box>
            <Box
              sx={{
                component: 'h2',
                color: 'text.primary',
                fontWeight: Fonts.BOLD,
                mb: 6,
                fontSize: 20,
                ml: 13,
              }}
            >
              <IntlMessages id='sidebar.ecommerce.checkout' />
            </Box>

            <AppGridContainer spacing={4}>
              {/* Left side - Delivery Address (Sticky) */}
              <Grid item xs={12} md={8}>
                <Box
                  sx={{
                    position: 'sticky',
                    top: 80, // adjust if you have a fixed header
                    alignSelf: 'flex-start',
                  }}
                >
                  <AppCard
                    title={
                      <Box sx={{ fontSize: 16, fontWeight: Fonts.BOLD, ml: 8 }}>
                        Delivery Address
                      </Box>
                    }
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {address && (
                      <Box sx={{ flex: 1 }}>
                        <DeliveryAddress
                          addresses={address?.results?.slice(0, 1)}
                          setSelectAddress={setSelectedAddress}
                        />
                      </Box>
                    )}
                  </AppCard>
                </Box>
              </Grid>

              {/* Right side - Order Summary */}
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <OrderSummary cartItems={cartItems} />
                </Box>
              </Grid>
            </AppGridContainer>
          </Box>
        </AppAnimate>
      )}
    </>
  );
};

export default Checkout;
