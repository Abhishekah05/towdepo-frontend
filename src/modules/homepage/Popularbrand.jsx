import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useGetProductsQuery } from '@crema/Slices/productsSlice';
import { useGetDataApi } from '@crema/hooks/APIHooks';
import Product from './Product';

const Popularbrand = ({ type }) => {
  const [page] = useState(1);
  const itemsPerPage = 10;
  const scrollContainerRef = useRef(null);
  
  // Location state
  const [selectedLocation, setSelectedLocation] = useState("auto");
  const [availableLocations, setAvailableLocations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [manualLocation, setManualLocation] = useState(null);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [checkingLocation, setCheckingLocation] = useState(true);

  const { data, isLoading } = useGetProductsQuery({ page, limit: itemsPerPage });
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Fetch stores using useGetDataApi hook
  const [
    { apiData: storeData, loading: storesLoading },
    { setQueryParams: setStoreQueryParams }
  ] = useGetDataApi("/store", {}, {}, true);

  // Check if user has enabled location on component mount
  useEffect(() => {
    const checkUserLocation = () => {
      const userLocationStr = localStorage.getItem('userLocation');
      
      if (userLocationStr) {
        try {
          const location = JSON.parse(userLocationStr);
          setUserLocation(location);
          setLocationEnabled(true);
        } catch (error) {
          console.error('Error parsing user location:', error);
          setLocationEnabled(false);
        }
      } else {
        setLocationEnabled(false);
      }
      setCheckingLocation(false);
    };

    checkUserLocation();
  }, []);

  // Listen for location changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'userLocation') {
        if (e.newValue) {
          try {
            const location = JSON.parse(e.newValue);
            setUserLocation(location);
            setLocationEnabled(true);
          } catch (error) {
            console.error('Error parsing user location:', error);
            setLocationEnabled(false);
          }
        } else {
          setUserLocation(null);
          setLocationEnabled(false);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    const interval = setInterval(() => {
      const userLocationStr = localStorage.getItem('userLocation');
      if (userLocationStr && !userLocation) {
        try {
          const location = JSON.parse(userLocationStr);
          setUserLocation(location);
          setLocationEnabled(true);
        } catch (error) {
          console.error('Error parsing user location:', error);
        }
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [userLocation]);

  // Get city name from coordinates
  const getCityNameFromCoordinates = async (lat, lng) => {
    try {
      const GOOGLE_MAPS_API_KEY = 'AIzaSyDiMFGT0VJq9FRjuCXczF3Df1rhnAQf_hE';
      
      if (!GOOGLE_MAPS_API_KEY || !lat || !lng) {
        console.log('Missing API key or coordinates');
        return null;
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        const addressComponents = data.results[0].address_components;
        
        const cityComponent = addressComponents.find(component =>
          component.types.includes('locality')
        );
        
        const postalTownComponent = addressComponents.find(component =>
          component.types.includes('postal_town')
        );
        
        const adminAreaComponent = addressComponents.find(component =>
          component.types.includes('administrative_area_level_2')
        );
        
        if (cityComponent) {
          return cityComponent.long_name;
        } else if (postalTownComponent) {
          return postalTownComponent.long_name;
        } else if (adminAreaComponent) {
          return adminAreaComponent.long_name;
        } else {
          const formattedAddress = data.results[0].formatted_address;
          const addressParts = formattedAddress.split(',');
          return addressParts[0].trim();
        }
      } else {
        console.warn(`Geocoding failed: ${data.status}`);
        return null;
      }
      
    } catch (error) {
      console.error('Error in getCityNameFromCoordinates:', error);
      return null;
    }
  };

  // Process stores data and get city names
  useEffect(() => {
    const processStores = async () => {
      if (storeData && storeData.results) {
        console.log('Stores data loaded:', storeData.results);
        
        const locationsWithNames = [];
        const processedCities = new Set();

        for (const store of storeData.results) {
          const storeId = store.id || store._id;
          const coordinates = store.location?.coordinates;
          const deliveryRadius = store.deliveryRadius || 10;
          const storeCity = store.address?.city;

          if (storeId) {
            let cityName = storeCity;

            if ((!cityName || cityName.trim() === '') && coordinates && coordinates.length === 2) {
              try {
                const [lng, lat] = coordinates;
                console.log(`Getting city name for coordinates: [${lat}, ${lng}]`);
                
                cityName = await getCityNameFromCoordinates(lat, lng);
                
                if (cityName) {
                  console.log(`Converted coordinates [${lat}, ${lng}] to city: ${cityName}`);
                } else {
                  console.log(`Could not get city name for coordinates [${lat}, ${lng}]`);
                  cityName = `Location (${lat.toFixed(2)}, ${lng.toFixed(2)})`;
                }
              } catch (error) {
                console.error(`Error getting city name for store ${storeId}:`, error);
                cityName = store.name || `Store ${storeId}`;
              }
            } else if (!cityName) {
              cityName = store.name || `Store ${storeId}`;
            }

            if (cityName && !processedCities.has(cityName)) {
              processedCities.add(cityName);
              
              locationsWithNames.push({
                id: storeId,
                city: cityName,
                coordinates: coordinates,
                deliveryRadius: deliveryRadius,
                rawStore: store
              });
            }
          }
        }

        console.log('Available locations:', locationsWithNames);
        setAvailableLocations(locationsWithNames);
        
        if (locationsWithNames.length > 0 && selectedLocation === "auto") {
          setSelectedLocation(locationsWithNames[0].id);
        }
      }
    };

    if (storeData) {
      processStores();
    }
  }, [storeData]);

  // Function to calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  // Check if store is within delivery radius
  const isStoreWithinDeliveryRadius = (store, targetLocation) => {
    if (!store) {
      return false;
    }

    try {
      const storeCoordinates = store.location?.coordinates || store.coordinates;
      
      if (storeCoordinates && storeCoordinates.length === 2) {
        const [storeLng, storeLat] = storeCoordinates;
        const deliveryRadius = store.deliveryRadius || 10;
        
        if (targetLocation && targetLocation.coordinates) {
          const [targetLng, targetLat] = targetLocation.coordinates;
          const distance = calculateDistance(targetLat, targetLng, storeLat, storeLng);
          return distance <= deliveryRadius;
        }
        
        if (userLocation) {
          const { latitude: userLat, longitude: userLng } = userLocation;
          const distance = calculateDistance(userLat, userLng, storeLat, storeLng);
          return distance <= deliveryRadius;
        }
      }
    } catch (error) {
      console.error('Error checking store delivery radius:', error);
    }
    
    return false;
  };

  // Check if store is in selected city
  const isStoreInSelectedCity = (store, selectedLocationId) => {
    if (selectedLocationId === "auto") {
      return true;
    }
    
    const storeId = store.id || store._id;
    return storeId === selectedLocationId;
  };

  const handleCardClick = (productId) => {
    navigate(`/ecommerce/product-view/${productId}`);
  };

  // Filter products by category and location
  const filterByCategoryAndLocation = (data, categoryName) => {
    if (!data || !data.products) return [];
    
    // If location is not enabled, return empty array
    if (!locationEnabled) {
      return [];
    }

    return data.products.filter(product => {
      const categoryMatch = product?.category?.name === categoryName;
      if (!categoryMatch) return false;

      if (!product.store) return false;

      if (selectedLocation !== "auto") {
        return isStoreInSelectedCity(product.store, selectedLocation);
      } else {
        if (userLocation) {
          return isStoreWithinDeliveryRadius(product.store, null);
        } else {
          return true;
        }
      }
    });
  };

  let filteredData = [];
  if (data && locationEnabled) {
    filteredData = filterByCategoryAndLocation(data, type);
  }

  const productsToShow = filteredData.slice(0, 16);

  // Show location prompt if location is not enabled
  const renderLocationPrompt = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        px: 2,
        textAlign: "center",
        height: "300px",
        backgroundColor: "background.paper",
        borderRadius: 2,
        mx: 2,
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{
          fontWeight: 600,
          color: "text.primary",
          mb: 2,
        }}
      >
        📍 Enable Location Access
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: "text.secondary",
          mb: 2,
          maxWidth: "400px",
          lineHeight: 1.6,
        }}
      >
        Please enable location access in the header to view {type.toLowerCase()} available in your area.
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "text.disabled",
          fontStyle: "italic",
        }}
      >
        Products will automatically appear once you enable location.
      </Typography>
    </Box>
  );

  return (
    <Box sx={{
      padding: { xs: 2, sm: 3, md: 4 },
      mb: isMobile ? 0 : -20,
      position: 'relative'
    }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1.3rem', sm: '1.8rem', md: '2.2rem' },
            lineHeight: 1,
            textAlign: 'left',
            color: '#000000',
            mb: 0,
          }}
        >
          {type}
        </Typography>
      </Box>

      <br />

      {/* Show location prompt or products */}
      {!locationEnabled ? (
        renderLocationPrompt()
      ) : (
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
          {isLoading || storesLoading ? (
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
              <Typography>
                No {type.toLowerCase()} available in your area.
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Popularbrand;