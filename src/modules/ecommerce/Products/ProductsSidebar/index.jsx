import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { Fonts } from "@crema/constants/AppEnums";
import Divider from "@mui/material/Divider";
import PriceSelector from "./PriceSelector";
import AppScrollbar from "@crema/components/AppScrollbar";
import AppList from "@crema/components/AppList";
import CheckedCell from "./CheckedCell";
import ProductsDiscount from "./productDiscount";
import { useGetDataApi } from "@crema/hooks/APIHooks";

const ProductSidebar = ({ filterData, setFilterData, maxValue }) => {
  const [selectedCategories, setSelectedCategories] = useState(
    filterData.categories
  );
  const [selectedFor, setSelectedFor] = useState(filterData.ideaFor);
  const [selectedColor, setSelectedColor] = useState(filterData.color);
  const [selectedStores, setSelectedStores] = useState(filterData.stores || []);
  const [price, setPrice] = useState(filterData?.price || [0, maxValue]);
  const [selectedDiscounts, setSelectedDiscounts] = useState(
    filterData.discounts
  );

  const [page, setPage] = useState(0);
  const [storeDistances, setStoreDistances] = useState({});
  const [storeAvailability, setStoreAvailability] = useState({});

  // Fetch Categories
  const [
    { apiData: categoryData },
    { setQueryParams: setCategoryQueryParams },
  ] = useGetDataApi("/category", [], {}, false);
  const { results: categories } = categoryData;

  // Fetch Discounts
  const [
    { apiData: discountData },
    { setQueryParams: setDiscountQueryParams },
  ] = useGetDataApi("/discount", [], {}, false);

  // Fetch Stores
  const [
    { apiData: storeData },
    { setQueryParams: setStoreQueryParams },
  ] = useGetDataApi("/store", [], {}, false);
  const { results: stores } = storeData || {};

  useEffect(() => {
    setCategoryQueryParams({ page, filterData: [] });
    setStoreQueryParams({ page, filterData: [] });
  }, [page, filterData]);

  useEffect(() => {
    setDiscountQueryParams({ page });
  }, [page]);

  // Calculate distances when stores data is loaded
  useEffect(() => {
    if (stores && stores.length > 0) {
      calculateStoreDistances(stores);
    }
  }, [stores]);

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
    const distance = R * c; // Distance in kilometers
    return distance;
  };

  // Calculate distances for all stores and check availability
  const calculateStoreDistances = (stores) => {
    const userLocationStr = localStorage.getItem('userLocation');
    
    if (!userLocationStr) {
      console.log('User location not found in localStorage');
      return;
    }

    try {
      const userLocation = JSON.parse(userLocationStr);
      const { latitude: userLat, longitude: userLng } = userLocation;

      const distances = {};
      const availability = {};
      
      stores.forEach(store => {
        // Check if store has location data with coordinates
        if (store.location && store.location.coordinates && store.location.coordinates.length === 2) {
          // MongoDB stores coordinates as [longitude, latitude]
          const [storeLng, storeLat] = store.location.coordinates;
          
          const distance = calculateDistance(
            userLat, 
            userLng, 
            storeLat, 
            storeLng
          );
          distances[store.id] = distance.toFixed(1); // Distance in km with 1 decimal
          
          // Check if store is within delivery radius
          // Default delivery radius is 10km if not specified
          const deliveryRadius = store.deliveryRadius || 10;
          availability[store.id] = distance <= deliveryRadius;
        } else {
          distances[store.id] = null; // No location data for this store
          availability[store.id] = false; // Not available without location
        }
      });

      setStoreDistances(distances);
      setStoreAvailability(availability);
    } catch (error) {
      console.error('Error parsing user location or calculating distances:', error);
    }
  };

  // If maxValue changes, update the price state if it's not already set by user
  useEffect(() => {
    if (maxValue && (!filterData.price || !price[1])) {
      setPrice([0, maxValue]);
    }
  }, [maxValue]);

  // Process Discounts
  const discounts =
    discountData?.results
      ?.filter((discount) => discount.percentage && discount.label)
      ?.sort((a, b) => b.percentage - a.percentage) || [];

  useEffect(() => {
    setFilterData({
      ...filterData,
      categories: selectedCategories,
      ideaFor: selectedFor,
      color: selectedColor,
      stores: selectedStores,
      price,
      discounts: selectedDiscounts,
    });
  }, [
    selectedCategories,
    selectedFor,
    selectedColor,
    selectedStores,
    price,
    selectedDiscounts,
  ]);

  useEffect(() => {
    setSelectedCategories(filterData.categories);
    setSelectedStores(filterData.stores || []);
  }, [filterData.categories, filterData.stores]);

  const onSelectCategories = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const onSelectStores = (storeId) => {
    // Prevent selecting stores that are outside delivery radius
    if (!storeAvailability[storeId]) {
      return;
    }
    setSelectedStores((prev) =>
      prev.includes(storeId)
        ? prev.filter((id) => id !== storeId)
        : [...prev, storeId]
    );
  };

  const onSelectDiscount = (discountId) => {
    setSelectedDiscounts((prev) =>
      prev.includes(discountId)
        ? prev.filter((id) => id !== discountId)
        : [...prev, discountId]
    );
  };

  const handlePriceChange = (event, newValue) => {
    setPrice(newValue);
  };

  // Custom store item component to display distance and handle grayed out state
  const StoreItemWithDistance = ({ data, onChange, selected }) => {
    const distance = storeDistances[data.id];
    const isAvailable = storeAvailability[data.id];
    const deliveryRadius = data.deliveryRadius || 10;
    
    return (
      <Box 
        sx={{ 
          width: '100%',
          opacity: isAvailable ? 1 : 0.5,
          cursor: isAvailable ? 'pointer' : 'not-allowed',
          position: 'relative'
        }}
      >
        <CheckedCell
          data={data}
          onChange={onChange}
          selected={selected}
          disabled={!isAvailable}
        />
        {distance !== undefined && distance !== null && (
          <Box 
            sx={{ 
              fontSize: '12px', 
              color: isAvailable ? 'text.secondary' : 'text.disabled',
              mt: 0.5,
              ml: 4, // Match the indentation of the checkbox
              lineHeight: 1.2
            }}
          >
            {distance} km away
            {!isAvailable && (
              <Box 
                component="span"
                sx={{ 
                  ml: 1,
                  color: 'error.main',
                  fontSize: '11px',
                  fontStyle: 'italic'
                }}
              >
                (Outside {deliveryRadius}km delivery radius)
              </Box>
            )}
          </Box>
        )}
        {distance === null && data.location && (
          <Box 
            sx={{ 
              fontSize: '12px', 
              color: 'text.disabled',
              mt: 0.5,
              ml: 4,
              lineHeight: 1.2,
              fontStyle: 'italic'
            }}
          >
            Location not available
          </Box>
        )}
        
        {/* Gray overlay for unavailable stores */}
        {!isAvailable && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              borderRadius: 1,
              pointerEvents: 'none'
            }}
          />
        )}
      </Box>
    );
  };

  return (
    <AppScrollbar>
      <Box sx={{ p: 6 }}>
        <Box component="h5" sx={{ mb: 2, fontWeight: Fonts.MEDIUM }}>
          Filter By
        </Box>

        {/* STORE FILTER */}
        {/* <Box sx={{ color: "text.secondary", my: 4, fontWeight: Fonts.MEDIUM }}>
          STORES
          <AppList
            data={stores || []}
            renderRow={(data) => (
              <StoreItemWithDistance
                key={data.id}
                data={data}
                onChange={onSelectStores}
                selected={selectedStores}
              />
            )}
          />
        </Box> */}
        <Divider sx={{ mt: 4 }} />

        {/* CATEGORY FILTER */}
        <Box sx={{ color: "text.secondary", my: 4, fontWeight: Fonts.MEDIUM }}>
          CATEGORY
          <AppList
            data={categories}
            renderRow={(data) => (
              <CheckedCell
                key={data.id}
                data={data}
                onChange={onSelectCategories}
                selected={selectedCategories}
              />
            )}
          />
        </Box>
        <Divider sx={{ mt: 4 }} />

        {/* PRICE FILTER */}
        <Box sx={{ color: "text.secondary", my: 4, fontWeight: Fonts.MEDIUM }}>
          PRICE
        </Box>
        <PriceSelector
          value={price}
          maxValue={maxValue}
          onChange={handlePriceChange}
        />
        <Divider sx={{ mt: 4 }} />

        {/* DISCOUNT FILTER */}
        <Box sx={{ color: "text.secondary", my: 4, fontWeight: Fonts.MEDIUM }}>
          DISCOUNTS
          <ProductsDiscount
            discounts={discountData}
            selectedDiscounts={selectedDiscounts}
            onSelectDiscount={onSelectDiscount}
          />
        </Box>
      </Box>
    </AppScrollbar>
  );
};

ProductSidebar.propTypes = {
  filterData: PropTypes.object.isRequired,
  setFilterData: PropTypes.func.isRequired,
  maxValue: PropTypes.number.isRequired,
};

export default ProductSidebar;