// components/LocationSelector.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress
} from '@mui/material';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useGetDataApi } from "@crema/hooks/APIHooks";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect([lat, lng]);
    },
  });
  return null;
};

const LocationSelector = ({ selectedLocation, onLocationChange }) => {
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [tempLocation, setTempLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // Fetch ALL stores from your API to get all locations
  const [
    { apiData: storesData, loading: storesLoading },
    { setQueryParams: setStoresQueryParams },
  ] = useGetDataApi("/store", [], {}, false);

  // Get user location on component mount
  useEffect(() => {
    const userLocationStr = localStorage.getItem('userLocation');
    if (userLocationStr) {
      try {
        const location = JSON.parse(userLocationStr);
        setUserLocation([location.latitude, location.longitude]);
      } catch (error) {
        console.error('Error parsing user location:', error);
      }
    }

    // Fetch ALL active stores without location filters
    setStoresQueryParams({
      isActive: true,
      limit: 1000, // Get all stores
      page: 0
    });
  }, []);

  // Process stores data to get ALL unique locations with names
  const getAllStoreLocations = () => {
    if (!storesData?.results || storesData.results.length === 0) return [];

    const locationsMap = new Map();

    storesData.results.forEach(store => {
      if (store.location?.coordinates && store.location.coordinates.length === 2) {
        // Use city name as key to group stores by city
        const cityName = store.city || store.address?.city || 'Unknown Location';
        const coordinates = store.location.coordinates;
        
        if (!locationsMap.has(cityName)) {
          locationsMap.set(cityName, {
            name: cityName,
            coordinates: coordinates,
            storeCount: 1,
            stores: [store]
          });
        } else {
          const existing = locationsMap.get(cityName);
          existing.storeCount += 1;
          existing.stores.push(store);
          // Keep the coordinates from the first store in this city
        }
      }
    });

    return Array.from(locationsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  };

  const handleLocationSelect = (event) => {
    const locationValue = event.target.value;
    
    if (locationValue === "current") {
      getCurrentLocation();
    } else if (locationValue === "custom") {
      setMapDialogOpen(true);
    } else if (locationValue === "all") {
      // Show all products from all locations (no location filter)
      onLocationChange(null);
    } else {
      // Find selected store location
      const storeLocations = getAllStoreLocations();
      const selectedStoreLocation = storeLocations.find(loc => loc.name === locationValue);
      
      if (selectedStoreLocation) {
        onLocationChange({
          name: selectedStoreLocation.name,
          coordinates: selectedStoreLocation.coordinates,
          storeCount: selectedStoreLocation.storeCount,
          isCurrent: false,
          stores: selectedStoreLocation.stores
        });
      }
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = [
            position.coords.latitude,
            position.coords.longitude
          ];
          setUserLocation(location);
          
          onLocationChange({
            name: "Use My Location",
            coordinates: location,
            isCurrent: true
          });
          
          // Save to localStorage
          localStorage.setItem('userLocation', JSON.stringify({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your current location. Please select a store location from the list.');
        }
      );
    }
  };

  const handleMapLocationSelect = (coordinates) => {
    setTempLocation(coordinates);
  };

  const confirmMapLocation = () => {
    if (tempLocation) {
      onLocationChange({
        name: `Custom Location (${tempLocation[0].toFixed(4)}, ${tempLocation[1].toFixed(4)})`,
        coordinates: tempLocation,
        isCustom: true
      });
      setMapDialogOpen(false);
      setTempLocation(null);
    }
  };

  const getDisplayValue = () => {
    if (!selectedLocation) return "All Locations";
    if (selectedLocation.isCurrent) return "Use My Location";
    if (selectedLocation.isCustom) return selectedLocation.name;
    return selectedLocation.name;
  };

  const storeLocations = getAllStoreLocations();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <FormControl sx={{ minWidth: 280 }} size="small">
        <InputLabel>Delivery Location</InputLabel>
        <Select
          value={selectedLocation ? 
            (selectedLocation.isCurrent ? "current" : 
             selectedLocation.isCustom ? "custom" : 
             selectedLocation.name) 
            : 'all'}
          label="Delivery Location"
          onChange={handleLocationSelect}
          disabled={storesLoading}
        >
          <MenuItem value="all">
            🌍 All Locations
          </MenuItem>
          <MenuItem value="current">
            📍 Use My Location {userLocation && "✓"}
          </MenuItem>
          <MenuItem value="custom">
            🗺️ Select on Map...
          </MenuItem>
          
          {storeLocations.map((location) => (
            <MenuItem 
              key={location.name} 
              value={location.name}
            >
              {location.name} 
              {location.storeCount > 1 && ` (${location.storeCount} stores)`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedLocation && (
        <Typography variant="body2" color="primary.main" sx={{ fontWeight: 500 }}>
          {selectedLocation.isCurrent ? 
            `📍 Delivering to your current location` : 
            selectedLocation.isCustom ?
            `📍 Custom location selected` :
            `📍 Delivering to: ${selectedLocation.name}`
          }
          {selectedLocation.storeCount > 1 && ` (${selectedLocation.storeCount} stores available)`}
        </Typography>
      )}

      {!selectedLocation && (
        <Typography variant="body2" color="primary.main" sx={{ fontWeight: 500 }}>
          🌍 Showing products from all locations
        </Typography>
      )}

      {storesLoading && <CircularProgress size={20} />}

      <Dialog 
        open={mapDialogOpen} 
        onClose={() => setMapDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Select Delivery Location on Map
        </DialogTitle>
        <DialogContent>
          <Box sx={{ height: 400, width: '100%' }}>
            <MapContainer
              center={userLocation || [12.9716, 77.5946]} // Default center
              zoom={7}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {/* Show ALL store locations on map */}
              {storeLocations.map((location, index) => (
                <Marker 
                  key={index}
                  position={[location.coordinates[1], location.coordinates[0]]} // Note: Leaflet uses [lat, lng]
                />
              ))}
              
              <MapClickHandler onLocationSelect={handleMapLocationSelect} />
              {tempLocation && (
                <Marker position={tempLocation} />
              )}
            </MapContainer>
          </Box>
          {tempLocation && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              Selected Coordinates: {tempLocation[0].toFixed(6)}, {tempLocation[1].toFixed(6)}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMapDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={confirmMapLocation} 
            variant="contained"
            disabled={!tempLocation}
          >
            Confirm Location
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LocationSelector;