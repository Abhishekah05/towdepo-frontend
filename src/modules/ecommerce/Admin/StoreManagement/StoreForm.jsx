// components/Store/StoreForm.js
import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  MenuItem,
  Chip,
  Alert,
  Tabs,
  Tab,
  CircularProgress,
  Snackbar
} from '@mui/material';

// MapDialog Component
const MapDialog = ({ open, onClose, onLocationSelect, initialLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [addressInfo, setAddressInfo] = useState(null);
  const [geocodingError, setGeocodingError] = useState(false);
  const [geocodingInProgress, setGeocodingInProgress] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (open) {
      setMapLoaded(false);
      setMapError(false);
      setGeocodingError(false);
      setGeocodingInProgress(false);
      
      const timer = setTimeout(() => {
        initializeMap();
      }, 100);

      return () => clearTimeout(timer);
    } else {
      setMapLoaded(false);
      setMapError(false);
      setSelectedLocation(null);
      setAddressInfo(null);
      setGeocodingError(false);
      setGeocodingInProgress(false);
    }
  }, [open]);

  const initializeMap = () => {
    if (!mapRef.current) {
      console.error('Map element not found');
      setMapError(true);
      return;
    }

    if (window.google && window.google.maps) {
      createMap();
    } else {
      loadGoogleMapsScript();
    }
  };

  const loadGoogleMapsScript = () => {
    if (scriptLoadedRef.current) {
      return;
    }

    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      const checkGoogle = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkGoogle);
          createMap();
        }
      }, 100);
      return;
    }

    scriptLoadedRef.current = true;
    
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDXxniXWoB_Q-EUET1WqZHjPx_15CLLfz0&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log('Google Maps script loaded successfully');
      createMap();
    };

    script.onerror = (error) => {
      console.error('Failed to load Google Maps script:', error);
      setMapError(true);
      setMapLoaded(false);
    };

    document.head.appendChild(script);
  };

  // Enhanced geocoding function with multiple fallbacks
  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      console.log('Starting geocoding for coordinates:', { lat, lng });

      // Method 1: Try Google Maps Geocoding API directly (REST API)
      try {
        console.log('Trying Google Maps Geocoding API...');
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDXxniXWoB_Q-EUET1WqZHjPx_15CLLfz0`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Google Maps Geocoding API response:', data);
        
        if (data.status === 'OK' && data.results && data.results.length > 0) {
          const address = data.results[0];
          const addressInfo = parseAddressComponents(address);
          console.log('Successfully got address from Google Maps API:', addressInfo);
          return addressInfo;
        } else {
          console.warn('Google Maps Geocoding API failed with status:', data.status);
        }
      } catch (apiError) {
        console.warn('Google Maps Geocoding API failed:', apiError);
      }

      // Method 2: Try Google Maps JavaScript Geocoder
      if (window.google && window.google.maps) {
        try {
          console.log('Trying Google Maps JavaScript Geocoder...');
          const geocoder = new window.google.maps.Geocoder();
          
          return new Promise((resolve) => {
            geocoder.geocode(
              { 
                location: { lat, lng },
                region: 'in'
              },
              (results, status) => {
                console.log('Google Maps JavaScript Geocoder status:', status);
                
                if (status === 'OK' && results && results.length > 0) {
                  const address = results[0];
                  const addressInfo = parseAddressComponents(address);
                  console.log('Successfully got address from JavaScript Geocoder:', addressInfo);
                  resolve(addressInfo);
                } else {
                  console.warn('JavaScript Geocoder failed with status:', status);
                  resolve(null);
                }
              }
            );
          });
        } catch (jsError) {
          console.warn('JavaScript Geocoder failed:', jsError);
        }
      }

      // Method 3: Fallback to OpenStreetMap Nominatim
      try {
        console.log('Trying OpenStreetMap Nominatim as fallback...');
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
        );
        
        if (response.ok) {
          const data = await response.json();
          console.log('OpenStreetMap Nominatim response:', data);
          
          if (data && data.address) {
            const addressInfo = parseOSMAddressComponents(data);
            console.log('Successfully got address from OpenStreetMap:', addressInfo);
            return addressInfo;
          }
        }
      } catch (osmError) {
        console.warn('OpenStreetMap Nominatim failed:', osmError);
      }

      // All methods failed
      console.error('All geocoding methods failed');
      return null;

    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      return null;
    }
  };

  // Parse Google Maps address components
  const parseAddressComponents = (address) => {
    const addressComponents = {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      formattedAddress: address.formatted_address || ''
    };

    if (!address || !address.address_components) {
      console.warn('No address components found');
      return addressComponents;
    }

    console.log('Raw address components:', address.address_components);

    let streetNumber = '';
    let route = '';
    let sublocality = '';
    let locality = '';
    let administrativeAreaLevel2 = '';
    let administrativeAreaLevel1 = '';
    let postalCode = '';
    let neighborhood = '';
    let village = '';
    let town = '';

    // Parse all address components
    address.address_components.forEach(component => {
      const types = component.types;
      const longName = component.long_name;
      
      if (types.includes('street_number')) {
        streetNumber = longName;
      } else if (types.includes('route')) {
        route = longName;
      } else if (types.includes('sublocality') || types.includes('sublocality_level_1') || types.includes('sublocality_level_2')) {
        sublocality = longName;
      } else if (types.includes('neighborhood')) {
        neighborhood = longName;
      } else if (types.includes('locality')) {
        locality = longName;
      } else if (types.includes('administrative_area_level_2')) {
        administrativeAreaLevel2 = longName;
      } else if (types.includes('administrative_area_level_1')) {
        administrativeAreaLevel1 = longName;
      } else if (types.includes('postal_code')) {
        postalCode = longName;
      } else if (types.includes('country')) {
        addressComponents.country = longName;
      } else if (types.includes('village')) {
        village = longName;
      } else if (types.includes('town')) {
        town = longName;
      }
    });

    // Build street address
    const streetParts = [];
    if (streetNumber) streetParts.push(streetNumber);
    if (route) streetParts.push(route);
    
    if (streetParts.length > 0) {
      addressComponents.street = streetParts.join(' ');
    } else if (neighborhood) {
      addressComponents.street = neighborhood;
    } else if (sublocality) {
      addressComponents.street = sublocality;
    }

    // Set city with priority
    addressComponents.city = locality || town || village || administrativeAreaLevel2 || sublocality || '';

    // Set state
    addressComponents.state = administrativeAreaLevel1 || '';

    // Set postal code
    addressComponents.postalCode = postalCode || '';

    // Enhanced fallback from formatted address
    if ((!addressComponents.street || addressComponents.street.trim() === '') && addressComponents.formattedAddress) {
      const addressParts = addressComponents.formattedAddress.split(',');
      if (addressParts.length > 0) {
        const firstPart = addressParts[0].trim();
        if (!firstPart.includes('Location at') && !firstPart.match(/^-?\d+\.\d+,\s*-?\d+\.\d+$/)) {
          addressComponents.street = firstPart;
        }
      }
    }

    console.log('Final parsed address:', addressComponents);
    return addressComponents;
  };

  // Parse OpenStreetMap address components
  const parseOSMAddressComponents = (data) => {
    const address = data.address;
    const addressComponents = {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: address.country || 'India',
      formattedAddress: data.display_name || ''
    };

    // Parse street address
    if (address.road) {
      addressComponents.street = address.road;
      if (address.house_number) {
        addressComponents.street = `${address.house_number} ${addressComponents.street}`;
      }
    } else if (address.pedestrian) {
      addressComponents.street = address.pedestrian;
    } else if (address.footway) {
      addressComponents.street = address.footway;
    }

    // Parse city
    if (address.city) {
      addressComponents.city = address.city;
    } else if (address.town) {
      addressComponents.city = address.town;
    } else if (address.village) {
      addressComponents.city = address.village;
    } else if (address.municipality) {
      addressComponents.city = address.municipality;
    } else if (address.county) {
      addressComponents.city = address.county;
    }

    // Parse state
    if (address.state) {
      addressComponents.state = address.state;
    } else if (address.region) {
      addressComponents.state = address.region;
    }

    // Parse postal code
    if (address.postcode) {
      addressComponents.postalCode = address.postcode;
    }

    // Fallback for street from formatted address
    if (!addressComponents.street && addressComponents.formattedAddress) {
      const addressParts = addressComponents.formattedAddress.split(',');
      if (addressParts.length > 0) {
        addressComponents.street = addressParts[0].trim();
      }
    }

    console.log('OSM parsed address:', addressComponents);
    return addressComponents;
  };

  const createMap = () => {
    try {
      if (!window.google || !window.google.maps) {
        throw new Error('Google Maps API not available');
      }

      if (!mapRef.current) {
        throw new Error('Map container not available');
      }

      const center = initialLocation || { lat: 20.5937, lng: 78.9629 };

      const map = new window.google.maps.Map(mapRef.current, {
        center: center,
        zoom: 12,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true
      });

      mapInstanceRef.current = map;

      // Add marker if initial location exists
      if (initialLocation) {
        addMarker(initialLocation, map);
        setSelectedLocation(initialLocation);
        // Get address for initial location
        setGeocodingInProgress(true);
        getAddressFromCoordinates(initialLocation.lat, initialLocation.lng)
          .then(address => {
            if (address) {
              setAddressInfo(address);
            } else {
              setGeocodingError(true);
            }
          })
          .finally(() => {
            setGeocodingInProgress(false);
          });
      }

      // Add click listener
      map.addListener('click', async (event) => {
        const location = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        };
        setSelectedLocation(location);
        addMarker(location, map);
        setGeocodingError(false);
        setGeocodingInProgress(true);

        // Get address for clicked location
        try {
          const address = await getAddressFromCoordinates(location.lat, location.lng);
          if (address) {
            setAddressInfo(address);
            console.log('Address found for clicked location:', address);
          } else {
            setGeocodingError(true);
            console.warn('No address found for location:', location);
          }
        } catch (error) {
          console.error('Error getting address:', error);
          setGeocodingError(true);
        } finally {
          setGeocodingInProgress(false);
        }
      });

      // Add search box
      addSearchBox(map);

      setMapLoaded(true);
      setMapError(false);

    } catch (error) {
      console.error('Error creating map:', error);
      setMapError(true);
      setMapLoaded(false);
    }
  };

  const addMarker = (location, map) => {
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    markerRef.current = new window.google.maps.Marker({
      position: location,
      map: map,
      draggable: true,
      title: 'Selected Store Location',
      animation: window.google.maps.Animation.DROP
    });

    // Update location when marker is dragged
    markerRef.current.addListener('dragend', async (event) => {
      const newLocation = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      setSelectedLocation(newLocation);
      setGeocodingError(false);
      setGeocodingInProgress(true);

      try {
        const address = await getAddressFromCoordinates(newLocation.lat, newLocation.lng);
        if (address) {
          setAddressInfo(address);
        } else {
          setGeocodingError(true);
        }
      } catch (error) {
        console.error('Error getting address:', error);
        setGeocodingError(true);
      } finally {
        setGeocodingInProgress(false);
      }
    });
  };

  const addSearchBox = (map) => {
    try {
      const input = document.createElement('input');
      input.placeholder = 'Search for an address...';
      input.style.cssText = `
        margin-top: 10px;
        margin-left: 10px;
        padding: 8px 12px;
        width: 300px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        outline: none;
      `;
      
      map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(input);

      const searchBox = new window.google.maps.places.SearchBox(input);

      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();
        if (places.length === 0) return;

        const place = places[0];
        if (!place.geometry) return;

        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        
        map.panTo(location);
        map.setZoom(17);

        setSelectedLocation(location);
        addMarker(location, map);
        setGeocodingError(false);

        // Parse address from place details
        let addressInfo = {};
        
        if (place.address_components && place.address_components.length > 0) {
          addressInfo = parseAddressComponents(place);
        } else if (place.formatted_address) {
          // Enhanced fallback using formatted address
          const addressParts = place.formatted_address.split(',');
          addressInfo = {
            street: addressParts[0]?.trim() || place.name || 'Address',
            city: addressParts[1]?.trim() || '',
            state: addressParts[2]?.trim() || '',
            postalCode: '',
            country: 'India',
            formattedAddress: place.formatted_address
          };
        }
        
        setAddressInfo(addressInfo);
        console.log('Address from search:', addressInfo);
      });

      input.addEventListener('focus', () => {
        input.value = '';
      });

    } catch (error) {
      console.error('Error adding search box:', error);
    }
  };

  const handleConfirm = () => {
    console.log('Confirming location with:', { selectedLocation, addressInfo });
    
    if (selectedLocation) {
      // Only pass addressInfo if it has valid data, otherwise pass null
      const hasValidAddress = addressInfo && (
        addressInfo.street || 
        addressInfo.city || 
        addressInfo.state || 
        addressInfo.postalCode ||
        (addressInfo.formattedAddress && !addressInfo.formattedAddress.includes('Location at'))
      );
      
      const addressToPass = hasValidAddress ? addressInfo : null;
      console.log('Passing address to parent:', addressToPass);
      onLocationSelect(selectedLocation, addressToPass);
    }
    onClose();
  };

  const handleRetry = () => {
    setMapError(false);
    setMapLoaded(false);
    setGeocodingError(false);
    initializeMap();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        Select Store Location on Map
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Click on the map or search for an address to select your store location
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ height: '500px', p: 0, position: 'relative' }}>
        
        {/* Loading State */}
        {!mapLoaded && !mapError && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'grey.100',
              zIndex: 1
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress size={40} sx={{ mb: 2 }} />
              <Typography>Loading Map...</Typography>
            </Box>
          </Box>
        )}

        {/* Error State */}
        {mapError && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'grey.100',
              zIndex: 1,
              flexDirection: 'column',
              gap: 2
            }}
          >
            <Typography color="error" variant="h6">
              Failed to load map
            </Typography>
            <Typography color="textSecondary" sx={{ mb: 2 }}>
              Please check your internet connection and try again.
            </Typography>
            <Button variant="contained" onClick={handleRetry}>
              Retry
            </Button>
          </Box>
        )}

        {/* Map Container */}
        <div 
          ref={mapRef}
          style={{ 
            height: '100%', 
            width: '100%',
            cursor: 'pointer',
            visibility: mapLoaded ? 'visible' : 'hidden'
          }}
        />
        
        {/* Selected Location Info */}
        {selectedLocation && mapLoaded && (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              backgroundColor: 'white',
              padding: 2,
              borderRadius: 1,
              boxShadow: 3,
              maxWidth: 300,
              zIndex: 2
            }}
          >
            <Typography variant="subtitle2" gutterBottom>
              Selected Location:
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Lat: {selectedLocation.lat.toFixed(6)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Lng: {selectedLocation.lng.toFixed(6)}
            </Typography>
            
            {geocodingInProgress && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <CircularProgress size={16} />
                <Typography variant="body2">Getting address...</Typography>
              </Box>
            )}
            
            {addressInfo && !geocodingInProgress && (
              <>
                <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
                  Detected Address:
                </Typography>
                {addressInfo.street && (
                  <Typography variant="body2" color="textSecondary">
                    <strong>Street:</strong> {addressInfo.street}
                  </Typography>
                )}
                {addressInfo.city && (
                  <Typography variant="body2" color="textSecondary">
                    <strong>City:</strong> {addressInfo.city}
                  </Typography>
                )}
                {addressInfo.state && (
                  <Typography variant="body2" color="textSecondary">
                    <strong>State:</strong> {addressInfo.state}
                  </Typography>
                )}
                {addressInfo.postalCode && (
                  <Typography variant="body2" color="textSecondary">
                    <strong>Postal Code:</strong> {addressInfo.postalCode}
                  </Typography>
                )}
                {addressInfo.country && (
                  <Typography variant="body2" color="textSecondary">
                    <strong>Country:</strong> {addressInfo.country}
                  </Typography>
                )}
              </>
            )}
            
            {geocodingError && !geocodingInProgress && (
              <Alert severity="warning" sx={{ mt: 1 }}>
                Address detection unavailable. Please enter address manually in the form.
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained" 
          disabled={!selectedLocation}
        >
          Confirm Location
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Rest of the StoreForm component remains the same...
// [Keep all the existing StoreForm code below exactly as you have it]

const daysOfWeek = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
];

const timeSlots = Array.from({ length: 24 * 4 }, (_, i) => {
  const hour = Math.floor(i / 4);
  const minute = (i % 4) * 15;
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`;
});

const StoreForm = ({ open, onClose, onSave, initialData, isEdit = false }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: 'India',
      postalCode: '',
      landmark: ''
    },
    location: {
      coordinates: [0, 0]
    },
    contact: {
      phone: '',
      email: '',
      website: ''
    },
    timings: daysOfWeek.map(day => ({
      day,
      openingTime: '09:00 AM',
      closingTime: '06:00 PM',
      isClosed: false
    })),
    deliveryRadius: 10,
    deliveryFee: 0,
    minOrderAmount: 0,
    isActive: true
  });

  const [ownerData, setOwnerData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const [locationManual, setLocationManual] = useState({
    longitude: '',
    latitude: ''
  });

  const [errors, setErrors] = useState({});
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [geocodingError, setGeocodingError] = useState(false);

  useEffect(() => {
    if (initialData && isEdit) {
      setFormData(initialData);
      if (initialData.location?.coordinates) {
        setLocationManual({
          longitude: initialData.location.coordinates[0]?.toString() || '',
          latitude: initialData.location.coordinates[1]?.toString() || ''
        });
      }
      if (initialData.owner) {
        setOwnerData({
          name: initialData.owner.name || '',
          email: initialData.owner.email || '',
          phone: initialData.owner.phone || '',
          password: ''
        });
      }
    } else {
      // Reset form for new store
      setFormData({
        name: '',
        description: '',
        address: {
          street: '',
          city: '',
          state: '',
          country: 'India',
          postalCode: '',
          landmark: ''
        },
        location: {
          type: 'Point',
          coordinates: [0, 0]
        },
        contact: {
          phone: '',
          email: '',
          website: ''
        },
        timings: daysOfWeek.map(day => ({
          day,
          openingTime: '09:00 AM',
          closingTime: '06:00 PM',
          isClosed: false
        })),
        deliveryRadius: 10,
        deliveryFee: 0,
        minOrderAmount: 0,
        isActive: true
      });
      setOwnerData({
        name: '',
        email: '',
        phone: '',
        password: ''
      });
      setLocationManual({
        longitude: '',
        latitude: ''
      });
      setActiveTab(0);
    }
  }, [initialData, isEdit, open]);

  // Function to update address fields when location is selected
  const updateAddressFields = (addressInfo) => {
    if (!addressInfo) return;

    console.log('Updating address fields with:', addressInfo);

    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        street: addressInfo.street || prev.address.street || '',
        city: addressInfo.city || prev.address.city || '',
        state: addressInfo.state || prev.address.state || '',
        postalCode: addressInfo.postalCode || prev.address.postalCode || '',
        country: addressInfo.country || prev.address.country || 'India'
      }
    }));
  };

  const handleMapLocationSelect = (location, addressInfo) => {
    const { lat, lng } = location;
    
    console.log('Map location selected:', { location, addressInfo });
    
    // Update coordinates
    setLocationManual({
      longitude: lng.toString(),
      latitude: lat.toString()
    });

    setFormData(prev => ({
      ...prev,
      location: {
        type: 'Point',
        coordinates: [lng, lat]
      }
    }));

    // Update address fields with the detected address
    if (addressInfo) {
      updateAddressFields(addressInfo);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (path, value) => {
    const keys = path.split('.');
    setFormData(prev => {
      const newData = { ...prev };
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleOwnerChange = (field, value) => {
    setOwnerData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTimingChange = (index, field, value) => {
    const newTimings = [...formData.timings];
    newTimings[index] = { ...newTimings[index], [field]: value };
    setFormData(prev => ({ ...prev, timings: newTimings }));
  };

  const handleLocationChange = (field, value) => {
    const newLocationManual = {
      ...locationManual,
      [field]: value
    };

    setLocationManual(newLocationManual);

    const longitude = field === 'longitude' ? parseFloat(value) || 0 : parseFloat(locationManual.longitude) || 0;
    const latitude = field === 'latitude' ? parseFloat(value) || 0 : parseFloat(locationManual.latitude) || 0;

    setFormData(prev => ({
      ...prev,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      }
    }));
  };

  const validateOwnerData = () => {
    const newErrors = {};

    if (!ownerData.name.trim()) {
      newErrors.name = 'Owner name is required';
    }

    if (!ownerData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(ownerData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!ownerData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!ownerData.password) {
      newErrors.password = 'Password is required';
    } else if (ownerData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStoreData = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.storeName = 'Store name is required';
    }

    if (!formData.contact.phone.trim()) {
      newErrors.storePhone = 'Store phone is required';
    }

    if (!formData.address.street.trim()) {
      newErrors.street = 'Street address is required';
    }

    if (!formData.address.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.address.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.address.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateOwnerData()) {
      setActiveTab(0);
      return;
    }

    if (!validateStoreData()) {
      setActiveTab(1);
      return;
    }

    const finalCoordinates = [
      parseFloat(locationManual.longitude) || 0,
      parseFloat(locationManual.latitude) || 0
    ];

    const ownerPayload = {
      name: ownerData.name,
      email: ownerData.email,
      phone: ownerData.phone,
      password: ownerData.password
    };

    const submitData = {
      ...formData,
      location: {
        type: 'Point',
        coordinates: finalCoordinates
      },
      owner: ownerPayload
    };

    console.log('Submitting store with coordinates:', finalCoordinates);
    onSave(submitData);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoadingAddress(true);
      setGeocodingError(false);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { longitude, latitude } = position.coords;
          const newLocationManual = {
            longitude: longitude.toString(),
            latitude: latitude.toString()
          };

          setLocationManual(newLocationManual);
          setFormData(prev => ({
            ...prev,
            location: {
              type: 'Point',
              coordinates: [longitude, latitude]
            }
          }));

          // Try to get address from coordinates using Google Maps API directly
          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDXxniXWoB_Q-EUET1WqZHjPx_15CLLfz0`
            );
            const data = await response.json();
            
            if (data.status === 'OK' && data.results[0]) {
              const address = data.results[0];
              const addressComponents = {
                street: '',
                city: '',
                state: '',
                postalCode: '',
                country: 'India',
                formattedAddress: address.formatted_address || ''
              };

              address.address_components.forEach(component => {
                const types = component.types;
                if (types.includes('street_number') || types.includes('route')) {
                  addressComponents.street = component.long_name;
                } else if (types.includes('locality')) {
                  addressComponents.city = component.long_name;
                } else if (types.includes('administrative_area_level_1')) {
                  addressComponents.state = component.long_name;
                } else if (types.includes('postal_code')) {
                  addressComponents.postalCode = component.long_name;
                }
              });

              updateAddressFields(addressComponents);
            }
          } catch (error) {
            console.error('Error getting address:', error);
            setGeocodingError(true);
          } finally {
            setLoadingAddress(false);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get current location. Please enter manually.');
          setLoadingAddress(false);
        }
      );
    }
  };

  const getInitialLocation = () => {
    const longitude = parseFloat(locationManual.longitude) || 0;
    const latitude = parseFloat(locationManual.latitude) || 0;
    
    if (longitude !== 0 && latitude !== 0) {
      return { lat: latitude, lng: longitude };
    }
    return null;
  };

  const handleSnackbarClose = () => {
    setGeocodingError(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEdit ? 'Edit Store' : 'Add New Store'}
        </DialogTitle>

        <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Owner Information" />
          <Tab label="Store Details" />
        </Tabs>

        <DialogContent>
          {activeTab === 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Store Owner Information
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                Every store must have an owner. The owner will be created as an admin user.
              </Alert>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Owner Name"
                    value={ownerData.name}
                    onChange={(e) => handleOwnerChange('name', e.target.value)}
                    error={!!errors.name}
                    helperText={errors.name}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={ownerData.email}
                    onChange={(e) => handleOwnerChange('email', e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={ownerData.phone}
                    onChange={(e) => handleOwnerChange('phone', e.target.value)}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={ownerData.password}
                    onChange={(e) => handleOwnerChange('password', e.target.value)}
                    error={!!errors.password}
                    helperText={errors.password}
                    required
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {activeTab === 1 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Store Details
              </Typography>

              <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Basic Information
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Store Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    error={!!errors.storeName}
                    helperText={errors.storeName}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    multiline
                    rows={2}
                  />
                </Grid>

                {/* Contact Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Contact Information
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={formData.contact.phone}
                    onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                    error={!!errors.storePhone}
                    helperText={errors.storePhone}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) => handleInputChange('contact.email', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Website"
                    value={formData.contact.website}
                    onChange={(e) => handleInputChange('contact.website', e.target.value)}
                  />
                </Grid>

                {/* Address */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Address
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Button
                      variant="outlined"
                      onClick={getCurrentLocation}
                      disabled={loadingAddress}
                      startIcon={loadingAddress ? <CircularProgress size={16} /> : null}
                    >
                      {loadingAddress ? 'Getting Location...' : 'Use Current Location'}
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => setMapDialogOpen(true)}
                    >
                      Select on Map
                    </Button>
                    {loadingAddress && (
                      <Typography variant="body2" color="textSecondary">
                        Fetching address...
                      </Typography>
                    )}
                  </Box>
                  
                  {geocodingError && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      Address detection is temporarily unavailable. Please enter the address manually.
                    </Alert>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Street Address"
                    value={formData.address.street}
                    onChange={(e) => handleInputChange('address.street', e.target.value)}
                    error={!!errors.street}
                    helperText={errors.street}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="City"
                    value={formData.address.city}
                    onChange={(e) => handleInputChange('address.city', e.target.value)}
                    error={!!errors.city}
                    helperText={errors.city}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="State"
                    value={formData.address.state}
                    onChange={(e) => handleInputChange('address.state', e.target.value)}
                    error={!!errors.state}
                    helperText={errors.state}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Postal Code"
                    value={formData.address.postalCode}
                    onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
                    error={!!errors.postalCode}
                    helperText={errors.postalCode}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Landmark"
                    value={formData.address.landmark}
                    onChange={(e) => handleInputChange('address.landmark', e.target.value)}
                  />
                </Grid>

                {/* Location Coordinates */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Location Coordinates
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Longitude"
                    type="number"
                    value={locationManual.longitude}
                    onChange={(e) => handleLocationChange('longitude', e.target.value)}
                    placeholder="e.g., 77.5946"
                    inputProps={{ step: "0.000001" }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Latitude"
                    type="number"
                    value={locationManual.latitude}
                    onChange={(e) => handleLocationChange('latitude', e.target.value)}
                    placeholder="e.g., 12.9716"
                    inputProps={{ step: "0.000001" }}
                  />
                </Grid>

                {/* Store Timings */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Store Timings
                  </Typography>
                </Grid>

                {formData.timings.map((timing, index) => (
                  <Grid item xs={12} key={timing.day}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                      <Chip
                        label={timing.day.charAt(0).toUpperCase() + timing.day.slice(1)}
                        sx={{ minWidth: 100 }}
                      />

                      <FormControlLabel
                        control={
                          <Switch
                            checked={!timing.isClosed}
                            onChange={(e) => handleTimingChange(index, 'isClosed', !e.target.checked)}
                          />
                        }
                        label={timing.isClosed ? "Closed" : "Open"}
                      />

                      {!timing.isClosed && (
                        <>
                          <TextField
                            select
                            label="Open Time"
                            value={timing.openingTime}
                            onChange={(e) => handleTimingChange(index, 'openingTime', e.target.value)}
                            sx={{ minWidth: 120 }}
                            size="small"
                          >
                            {timeSlots.map((time) => (
                              <MenuItem key={time} value={time}>
                                {time}
                              </MenuItem>
                            ))}
                          </TextField>

                          <TextField
                            select
                            label="Close Time"
                            value={timing.closingTime}
                            onChange={(e) => handleTimingChange(index, 'closingTime', e.target.value)}
                            sx={{ minWidth: 120 }}
                            size="small"
                          >
                            {timeSlots.map((time) => (
                              <MenuItem key={time} value={time}>
                                {time}
                              </MenuItem>
                            ))}
                          </TextField>
                        </>
                      )}
                    </Box>
                  </Grid>
                ))}

                {/* Delivery Settings */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Delivery Settings
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Delivery Radius (km)"
                    type="number"
                    value={formData.deliveryRadius}
                    onChange={(e) => handleInputChange('deliveryRadius', parseFloat(e.target.value))}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Delivery Fee"
                    type="number"
                    value={formData.deliveryFee}
                    onChange={(e) => handleInputChange('deliveryFee', parseFloat(e.target.value))}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Min Order Amount"
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) => handleInputChange('minOrderAmount', parseFloat(e.target.value))}
                  />
                </Grid>

                {/* Status */}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isActive}
                        onChange={(e) => handleInputChange('isActive', e.target.checked)}
                      />
                    }
                    label="Store Active"
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          {activeTab === 0 ? (
            <Button onClick={() => setActiveTab(1)} variant="contained">
              Next: Store Details
            </Button>
          ) : (
            <Button onClick={handleSubmit} variant="contained">
              {isEdit ? 'Update Store' : 'Create Store'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Map Selection Dialog */}
      <MapDialog
        open={mapDialogOpen}
        onClose={() => setMapDialogOpen(false)}
        onLocationSelect={handleMapLocationSelect}
        initialLocation={getInitialLocation()}
      />

      {/* Global Snackbar for errors */}
      <Snackbar
        open={geocodingError}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Address detection service is temporarily unavailable. Please enter address manually."
      />
    </>
  );
};

export default StoreForm;