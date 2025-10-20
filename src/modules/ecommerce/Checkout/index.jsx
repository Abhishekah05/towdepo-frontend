import React, { useEffect, useState } from 'react';
import { Box, Grid, Alert, Button } from '@mui/material';
import AppCard from '@crema/components/AppCard';
import IntlMessages from '@crema/helpers/IntlMessages';
import { Fonts } from '@crema/constants/AppEnums';
import AppAnimate from '@crema/components/AppAnimate';
import AppGridContainer from '@crema/components/AppGridContainer';
import { useGetDataApi, postDataApi } from '@crema/hooks/APIHooks';
import AppLoader from '@crema/components/AppLoader';
import DeliveryAddress from './DeliveryAddress';
import OrderSummary from '../OrderSummary';
import { useLayoutContext, useLayoutActionsContext } from '@crema/context/AppContextProvider/LayoutContextProvider';
import { useInfoViewActionsContext } from '@crema/context/AppContextProvider/InfoViewContextProvider';
import { useSelector } from 'react-redux';

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const [{ apiData: address, loading }] = useGetDataApi('/address', []);
  const { selectedAddress } = useLayoutContext();
  const { setSelectedAddress } = useLayoutActionsContext();
  const infoViewActionsContext = useInfoViewActionsContext();
  
  const [deliveryStatus, setDeliveryStatus] = useState({
    isAvailable: false,
    message: 'Select an address to check delivery availability',
    store: null,
    distance: null
  });
  const [userLocation, setUserLocation] = useState(null);
  const [checkingDelivery, setCheckingDelivery] = useState(false);

  // Get user location from localStorage
  useEffect(() => {
    const userLocationStr = localStorage.getItem('userLocation');
    if (userLocationStr) {
      try {
        const location = JSON.parse(userLocationStr);
        setUserLocation(location);
        console.log('User location from localStorage:', location);
      } catch (error) {
        console.error('Error parsing user location:', error);
      }
    }
  }, []);

  // Check delivery availability when address or cart changes
  useEffect(() => {
    checkDeliveryAvailability();
  }, [selectedAddress, cartItems]);

  // Main function to check delivery availability using API Hook

const checkDeliveryAvailability = async () => {
  if (!selectedAddress || !cartItems || cartItems.length === 0) {
    setDeliveryStatus({
      isAvailable: false,
      message: 'Please select an address and add items to cart',
      store: null,
      distance: null
    });
    return;
  }

  try {
    setCheckingDelivery(true);
    setDeliveryStatus({
      isAvailable: false,
      message: 'Checking delivery availability...',
      store: null,
      distance: null
    });

    // Validate address has required fields
    if (!selectedAddress.addressLine1 || !selectedAddress.city) {
      throw new Error('Please provide complete address with street and city');
    }

    // **FIXED: Extract store IDs properly from cart items**
    const storeIds = cartItems
      .map(item => item.storeId || (item.store && item.store.id))
      .filter(storeId => storeId && storeId.trim() !== ''); // Remove empty/null values

    if (storeIds.length === 0) {
      throw new Error('No valid store information found in cart items');
    }

    console.log('Store IDs from cart:', storeIds);

    // Prepare payload with coordinates if available
    const payload = { 
      address: selectedAddress,
      storeIds: storeIds
    };
    
    // If user location is available in localStorage, use it
    const userLocationStr = localStorage.getItem('userLocation');
    if (userLocationStr) {
      try {
        const userLocation = JSON.parse(userLocationStr);
        if (userLocation.latitude && userLocation.longitude) {
          payload.latitude = userLocation.latitude;
          payload.longitude = userLocation.longitude;
          console.log('Using coordinates from localStorage:', payload.latitude, payload.longitude);
        }
      } catch (error) {
        console.error('Error parsing user location:', error);
      }
    }

    // If no coordinates from localStorage, try to use city-based fallback coordinates
    if (!payload.latitude || !payload.longitude) {
      const cityCoordinates = {
        'bangalore': { latitude: 12.9716, longitude: 77.5946 },
        'mumbai': { latitude: 19.0760, longitude: 72.8777 },
        'delhi': { latitude: 28.7041, longitude: 77.1025 },
        'chennai': { latitude: 13.0827, longitude: 80.2707 },
        'kolkata': { latitude: 22.5726, longitude: 88.3639 },
        'hyderabad': { latitude: 17.3850, longitude: 78.4867 },
        'pune': { latitude: 18.5204, longitude: 73.8567 },
        'ahmedabad': { latitude: 23.0225, longitude: 72.5714 },
        'jaipur': { latitude: 26.9124, longitude: 75.7873 },
        'lucknow': { latitude: 26.8467, longitude: 80.9462 },
        'mysore': { latitude: 12.2958, longitude: 76.6394 }
      };
      
      const city = selectedAddress.city.toLowerCase();
      if (cityCoordinates[city]) {
        const fallbackCoords = cityCoordinates[city];
        payload.latitude = fallbackCoords.latitude;
        payload.longitude = fallbackCoords.longitude;
        console.log(`Using fallback coordinates for ${selectedAddress.city}:`, fallbackCoords);
      } else {
        // Default fallback coordinates
        payload.latitude = 12.9716;
        payload.longitude = 77.5946;
        console.log('Using default fallback coordinates');
      }
    }

    console.log('Sending delivery check payload:', payload);

    // Use the postDataApi hook
    const result = await postDataApi(
      '/store/delivery-check',
      infoViewActionsContext,
      payload,
      false // show loader
    );
    
    console.log('Delivery check API response:', result);
    
    if (result && result.isDeliverable) {
      setDeliveryStatus({
        isAvailable: true,
        message: result.message || 'Delivery available in your area!',
        store: result.store,
        distance: result.distance
      });
    } else {
      setDeliveryStatus({
        isAvailable: false,
        message: result?.message || 'Delivery not available in your area.',
        store: result?.store || null,
        distance: result?.distance || null
      });
    }

  } catch (error) {
    console.error('Error checking delivery availability:', error);
    
    let errorMessage = 'Error checking delivery availability. Please try again.';
    
    if (error?.message) {
      errorMessage = error.message;
    } else if (error?.error?.message) {
      errorMessage = error.error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    setDeliveryStatus({
      isAvailable: false,
      message: `❌ ${errorMessage}`,
      store: null,
      distance: null
    });
  } finally {
    setCheckingDelivery(false);
  }
};

  // Function to handle manual recheck
  const handleRecheckDelivery = () => {
    checkDeliveryAvailability();
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    // Recheck delivery when address changes
    setTimeout(() => checkDeliveryAvailability(), 100);
  };

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

            {/* Delivery Status Alert */}
            {deliveryStatus.message && (
              <Box sx={{ mb: 3, mx: 2 }}>
                <Alert 
                  severity={deliveryStatus.isAvailable ? "success" : "warning"}
                  action={
                    !deliveryStatus.isAvailable && !checkingDelivery && (
                      <Button 
                        color="inherit" 
                        size="small" 
                        onClick={handleRecheckDelivery}
                        disabled={checkingDelivery}
                      >
                        {checkingDelivery ? 'Checking...' : 'Recheck'}
                      </Button>
                    )
                  }
                >
                  {checkingDelivery ? 'Checking delivery availability...' : deliveryStatus.message}
                  {deliveryStatus.store && (
                    <Box component="span" sx={{ display: 'block', fontSize: '0.875rem', mt: 0.5 }}>
                      Store: {deliveryStatus.store.name} | Delivery Radius: {deliveryStatus.store.deliveryRadius || 10}km
                    </Box>
                  )}
                </Alert>
              </Box>
            )}

            <AppGridContainer spacing={4}>
              {/* Left side - Delivery Address (Sticky) */}
              <Grid item xs={12} md={8}>
                <Box
                  sx={{
                    position: 'sticky',
                    top: 80,
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
                          setSelectAddress={handleAddressSelect}
                          selectedAddress={selectedAddress}
                        />
                      </Box>
                    )}
                  </AppCard>
                </Box>
              </Grid>

              {/* Right side - Order Summary */}
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <OrderSummary 
                    cartItems={cartItems} 
                    deliveryAvailable={deliveryStatus.isAvailable}
                    deliveryMessage={deliveryStatus.message}
                    checkingDelivery={checkingDelivery}
                  />
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