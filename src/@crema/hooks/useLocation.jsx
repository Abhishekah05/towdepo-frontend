// hooks/useLocation.js
import { useState, useEffect } from 'react';
import { useGetNearestLocationMutation } from '@crema/Slices/locationSlice';

export const useLocation = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [getNearestLocation] = useGetNearestLocationMutation();

  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Try to get location from localStorage first
        const savedLocation = localStorage.getItem('userLocation');
        if (savedLocation) {
          setUserLocation(JSON.parse(savedLocation));
          setIsLoading(false);
          return;
        }

        // Get current position
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              
              try {
                // Find nearest service location
                const location = await getNearestLocation({
                  lat: latitude,
                  lng: longitude
                }).unwrap();
                
                setUserLocation(location);
                localStorage.setItem('userLocation', JSON.stringify(location));
              } catch (err) {
                setError('Service not available in your area');
              }
              
              setIsLoading(false);
            },
            (error) => {
              console.error('Geolocation error:', error);
              setError('Unable to detect your location');
              setIsLoading(false);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 3600000 // 1 hour
            }
          );
        } else {
          setError('Geolocation is not supported');
          setIsLoading(false);
        }
      } catch (err) {
        setError('Location detection failed');
        setIsLoading(false);
      }
    };

    detectLocation();
  }, [getNearestLocation]);

  const updateLocation = (location) => {
    setUserLocation(location);
    localStorage.setItem('userLocation', JSON.stringify(location));
  };

  return { userLocation, isLoading, error, updateLocation };
};