import React, { useState, useEffect } from "react";
import AppsHeader from "@crema/components/AppsContainer/AppsHeader";
import PropTypes from "prop-types";
import AppsContent from "@crema/components/AppsContainer/AppsContent";
import { alpha, Box, Hidden, Skeleton, Typography, Button } from "@mui/material";
import { useThemeContext } from "@crema/context/AppContextProvider/ThemeContextProvider";
import AppsFooter from "@crema/components/AppsContainer/AppsFooter";
import AppsPagination from "@crema/components/AppsPagination";
import ProductHeader from "../ProductHeader";
import ProductGrid from "./ProductGrid";
import ProductList from "./ProductList";
import { VIEW_TYPE } from "../index";
import { useGetProductsQuery } from "@crema/Slices/productsSlice";
import { useLocation } from "react-router-dom";
import { useGetDataApi } from '@crema/hooks/APIHooks';

const ProductListing = ({
  filterData,
  viewType,
  setViewType,
  setFilterData,
}) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.get("category");

  const [page, setPage] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState("auto");
  const [availableLocations, setAvailableLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [manualLocation, setManualLocation] = useState(null);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [checkingLocation, setCheckingLocation] = useState(true);
  const itemsPerPage = 10;

  const { data, error, isLoading } = useGetProductsQuery({
    page,
    limit: itemsPerPage,
  });

  const { theme } = useThemeContext();
  const totalPages = data ? Math.ceil(data.totalResults / itemsPerPage) : 0;

  // Check if user has enabled location on component mount
  useEffect(() => {
    const checkUserLocation = () => {
      const userLocationStr = localStorage.getItem('userLocation');
      console.log('Checking user location from localStorage:', userLocationStr);
      
      if (userLocationStr) {
        try {
          const location = JSON.parse(userLocationStr);
          console.log('User location found:', location);
          setUserLocation(location);
          setLocationEnabled(true);
        } catch (error) {
          console.error('Error parsing user location:', error);
          setLocationEnabled(false);
        }
      } else {
        console.log('No user location found in localStorage');
        setLocationEnabled(false);
      }
      setCheckingLocation(false);
    };

    checkUserLocation();
  }, []);

  // Listen for location changes in localStorage
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
    
    // Also check periodically (fallback for same-tab changes)
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

  // Fetch stores using useGetDataApi hook
  const [
    { apiData: storeData, loading: storesLoading },
    { setQueryParams: setStoreQueryParams }
  ] = useGetDataApi("/store", {}, {}, true);

  // Get city name from coordinates using Google Maps Geocoding API with fallback
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
      
      console.log('Google Geocoding response:', data);
      
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
        
        const stateComponent = addressComponents.find(component =>
          component.types.includes('administrative_area_level_1')
        );
        
        if (cityComponent) {
          return cityComponent.long_name;
        } else if (postalTownComponent) {
          return postalTownComponent.long_name;
        } else if (adminAreaComponent) {
          return adminAreaComponent.long_name;
        } else if (stateComponent) {
          return stateComponent.long_name;
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

  // Find the nearest city based on user location
  const findNearestCity = async (userLat, userLng) => {
    try {
      console.log('Finding nearest city for user location:', { userLat, userLng });
      
      if (availableLocations.length === 0) {
        console.log('No cities available yet');
        return;
      }

      let nearestCity = null;
      let shortestDistance = Infinity;

      for (const location of availableLocations) {
        if (location.coordinates && location.coordinates.length === 2) {
          const [storeLng, storeLat] = location.coordinates;
          const distance = calculateDistance(userLat, userLng, storeLat, storeLng);
          
          console.log(`Distance to ${location.city}: ${distance}km`);
          
          if (distance < shortestDistance) {
            shortestDistance = distance;
            nearestCity = location;
          }
        }
      }

      if (nearestCity) {
        console.log('Nearest city found:', nearestCity.city, 'Distance:', shortestDistance + 'km');
        setSelectedLocation(nearestCity.id);
        setManualLocation(nearestCity);
      } else {
        console.log('No city found within range');
        if (availableLocations.length > 0) {
          setSelectedLocation(availableLocations[0].id);
        }
      }
    } catch (error) {
      console.error('Error finding nearest city:', error);
      if (availableLocations.length > 0) {
        setSelectedLocation(availableLocations[0].id);
      }
    }
  };

  // Function to calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
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

  const handleLocationChange = (newLocationId) => {
    console.log('Location changed to:', newLocationId);
    setSelectedLocation(newLocationId);
    
    if (newLocationId === "auto") {
      setManualLocation(null);
    } else {
      const locationData = availableLocations.find(loc => loc.id === newLocationId);
      setManualLocation(locationData);
    }
  };

  const filterProducts = (product) => {
    if (!product || !product.store) {
      return false;
    }

    // If location is not enabled, don't show any products
    if (!locationEnabled) {
      return false;
    }

    // Location-based filtering
    if (selectedLocation !== "auto") {
      const locationMatch = isStoreInSelectedCity(product.store, selectedLocation);
      if (!locationMatch) {
        return false;
      }
    } else {
      if (userLocation) {
        const isWithinRadius = isStoreWithinDeliveryRadius(product.store, null);
        if (!isWithinRadius) {
          return false;
        }
      } else {
        console.log('No user location available, showing all products in auto mode');
      }
    }

    // Category filter
    const categoryMatch =
      (!filterData?.categories?.length && !category) ||
      product?.category?.name === category ||
      (filterData.categories?.includes(product.category?.id));

    // Price filter
    const priceMatch =
      !Array.isArray(filterData?.price) ||
      filterData.price[1] === 0 ||
      (product.mrp >= filterData.price[0] && product.mrp <= filterData.price[1]);

    // Discount filter
    const discountMatch =
      !filterData?.discounts?.length ||
      filterData.discounts.includes(Number(product.discount));

    // Store filter
    const storeMatch =
      !filterData?.stores?.length ||
      (product.store && filterData.stores.includes(product.store.id || product.store));

    return categoryMatch && priceMatch && discountMatch && storeMatch;
  };

  const filteredProducts = data?.products?.filter(filterProducts);

  const searchedProducts = filteredProducts?.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onPageChange = (event, value) => {
    setPage(value);
  };

  const searchProduct = (title) => {
    setSearchQuery(title);
  };

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
        height: "400px",
      }}
    >
      <Typography
        variant="h4"
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
          mb: 4,
          maxWidth: "500px",
          lineHeight: 1.6,
        }}
      >
        Please enable location access in the header to view products available in your area. 
        Your location helps us show you relevant products from nearby stores.
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "text.disabled",
          fontStyle: "italic",
        }}
      >
        Once you enable location, products will automatically appear here.
      </Typography>
    </Box>
  );

  // Show loading while checking location
  if (checkingLocation) {
    return (
      <>
        <AppsHeader>
          <ProductHeader
            list={[]}
            viewType={viewType}
            page={page}
            totalProducts={0}
            onPageChange={onPageChange}
            onSearch={searchProduct}
            setViewType={setViewType}
            selectedLocation={selectedLocation}
            availableLocations={availableLocations}
            onLocationChange={handleLocationChange}
          />
        </AppsHeader>
        <AppsContent
          style={{
            backgroundColor: alpha(theme.palette.background.default, 0.6),
          }}
        >
          <Box
            sx={{
              width: "100%",
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 2,
              px: 4,
              height: "200px",
            }}
          >
            <Skeleton width="100%" height={100} />
          </Box>
        </AppsContent>
      </>
    );
  }

  return (
    <>
      <AppsHeader>
        <ProductHeader
          list={searchedProducts || []}
          viewType={viewType}
          page={page}
          totalProducts={searchedProducts?.length || 0}
          onPageChange={onPageChange}
          onSearch={searchProduct}
          setViewType={setViewType}
          selectedLocation={selectedLocation}
          availableLocations={availableLocations}
          onLocationChange={handleLocationChange}
        />
      </AppsHeader>

      <AppsContent
        style={{
          backgroundColor: alpha(theme.palette.background.default, 0.6),
        }}
      >
        <Box
          sx={{
            width: "100%",
            flex: 1,
            display: "flex",
            py: 2,
            px: 4,
            height: 1,
            "& > div": {
              width: "100%",
            },
          }}
        >
          {/* Show location prompt if location is not enabled */}
          {!locationEnabled ? (
            renderLocationPrompt()
          ) : isLoading || storesLoading ? (
            <>
              <Skeleton />
              <Skeleton width="60%" />
            </>
          ) : viewType === VIEW_TYPE.GRID ? (
            <ProductGrid 
              ecommerceList={searchedProducts} 
              loading={isLoading} 
            />
          ) : (
            <ProductList 
              ecommerceList={searchedProducts} 
              loading={isLoading} 
            />
          )}
        </Box>
      </AppsContent>

      <Hidden smUp>
        {locationEnabled && searchedProducts?.length > 0 && (
          <AppsFooter>
            <AppsPagination
              count={totalPages}
              page={page}
              onPageChange={onPageChange}
            />
          </AppsFooter>
        )}
      </Hidden>
    </>
  );
};

export default ProductListing;

ProductListing.propTypes = {
  filterData: PropTypes.object,
  viewType: PropTypes.string.isRequired,
  setViewType: PropTypes.func.isRequired,
  setFilterData: PropTypes.func.isRequired,
};