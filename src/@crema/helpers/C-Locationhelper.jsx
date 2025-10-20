// src/@crema/helpers/C-Locationhelper.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedStoreLocation, setSelectedStoreLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  // Load stored locations on mount
  useEffect(() => {
    const storedUserLocation = getStoredLocation('userLocation');
    const storedStoreLocation = getStoredLocation('selectedStoreLocation');
    
    if (storedUserLocation) {
      setUserLocation(storedUserLocation);
    }
    if (storedStoreLocation) {
      setSelectedStoreLocation(storedStoreLocation);
    }
  }, []);

  const getStoredLocation = (key) => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error reading stored location:', error);
      return null;
    }
  };

  const storeLocation = (key, location) => {
    try {
      localStorage.setItem(key, JSON.stringify(location));
    } catch (error) {
      console.error('Error storing location:', error);
    }
  };

  const getUserLocation = () => {
    setIsLocationLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      setIsLocationLoading(false);
      return Promise.reject('Geolocation not supported');
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    };

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString()
          };
          
          setUserLocation(location);
          storeLocation('userLocation', location);
          setIsLocationLoading(false);
          resolve(location);
        },
        (error) => {
          setIsLocationLoading(false);
          let errorMessage = 'Unable to retrieve your location.';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location permissions.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
            default:
              errorMessage = 'An unknown error occurred.';
              break;
          }
          
          setLocationError(errorMessage);
          reject(errorMessage);
        },
        options
      );
    });
  };

  const disableUserLocation = () => {
    setUserLocation(null);
    localStorage.removeItem('userLocation');
    setLocationError(null);
  };

  const selectStoreLocation = (location) => {
    setSelectedStoreLocation(location);
    if (location) {
      storeLocation('selectedStoreLocation', location);
    } else {
      localStorage.removeItem('selectedStoreLocation');
    }
  };

  const getCurrentLocation = () => {
    return selectedStoreLocation || userLocation;
  };

  const value = {
    userLocation,
    selectedStoreLocation,
    locationError,
    isLocationLoading,
    getUserLocation,
    disableUserLocation,
    selectStoreLocation,
    getCurrentLocation,
    hasLocation: !!userLocation || !!selectedStoreLocation
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};