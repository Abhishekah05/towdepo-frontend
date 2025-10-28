import React, { useEffect, useState, useRef } from 'react';
import { IconButton, Popover, Typography, List, ListItem, Divider, Button, Avatar, Badge } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

import { useAuthMethod, useAuthUser } from "@crema/hooks/AuthHooks";

import { Link } from 'react-router-dom';
import AccountMenu from './accountMenu';
import Dropcart from './dropCart';
import DropWishlist from './dropWishlist';

const BasketButton = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const cart = useSelector((state) => state.cart);

  // Helper function to calculate total price of the cart
  const getTotalPrice = (cartItems) => {
    let total = 0;
    cartItems.forEach((item) => {
      const itemPrice = item.totalPrice || item.mrp || 0;
      const quantity = item.quantity || 1;
      // Ensure we only multiply the price by quantity once
      total += itemPrice * quantity;
    });
    return total;
  };
  
  const totalPrice = cart.totalPrice;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'cart-popover' : undefined;

  return (
    <>
      <div className="indicator indicator--trigger--click" onClick={handleClick}>
        <a href="#" className="indicator__button">
          <span className="indicator__icon">
            <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10.5" cy="27.5" r="2.5"></circle>
              <circle cx="23.5" cy="27.5" r="2.5"></circle>
              <path d="M26.4,21H11.2C10,21,9,20.2,8.8,19.1L5.4,4.8C5.3,4.3,4.9,4,4.4,4H1C0.4,4,0,3.6,0,3s0.4-1,1-1h3.4C5.8,2,7,3,7.3,4.3 l3.4,14.3c0.1,0.2,0.3,0.4,0.5,0.4h15.2c0.2,0,0.4-0.1,0.5-0.4l3.1-10c0.1-0.2,0-0.4-0.1-0.4C29.8,8.1,29.7,8,29.5,8H14 c-0.6,0-1-0.4-1-1s0.4-1,1-1h15.5c0.8,0,1.5,0.4,2,1c0.5,0.6,0.6,1.5,0.4,2.2l-3.1,10C28.5,20.3,27.5,21,26.4,21z"></path>
            </svg>
            <span className="indicator__counter">{cart.items?.length}</span>
          </span>
          <span className="indicator__title">Cart</span>
          <span className="indicator__value">${totalPrice.toFixed(2)}</span>
        </a>
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Typography sx={{ p: 2 }}>Cart Items</Typography>
        <Divider />
        <Dropcart />
      </Popover>
    </>
  );
};

const WishlistButton = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const wishlist = useSelector((state) => state.wishlist);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'wishlist-popover' : undefined;

  return (
    <>
      <div className="indicator indicator--trigger--click" onClick={handleClick}>
        <a href="#" className="indicator__button">
          <span className="indicator__icon">
            <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
              <path d="M23,4c3.9,0,7,3.1,7,7c0,6.3-11.4,15.9-14,16.9C13.4,26.9,2,17.3,2,11c0-3.9,3.1-7,7-7c2.1,0,4.1,1,5.4,2.6l1.6,2l1.6-2 C18.9,5,20.9,4,23,4 M23,2c-2.8,0-5.4,1.3-7,3.4C14.4,3.3,11.8,2,9,2c-5,0-9,4-9,9c0,8,14,19,16,19s16-11,16-19C32,6,28,2,23,2L23,2z"></path>
            </svg>
          </span>
          <span className="indicator__counter">{wishlist?.items?.length}</span>
        </a>
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Typography sx={{ p: 2 ,backgroundColor:'#f1f1f1' }}>Wishlist Items</Typography>
        <Divider />
        <DropWishlist />
      </Popover>
    </>
  );
};

// IMPROVED: Better location name function with multiple geocoding services
// const getLocationName = async (latitude, longitude) => {
//   console.log('Getting location name for:', latitude, longitude);
  
//   try {
//     // Try Google Maps Geocoding API first (most accurate)
//     const googleName = await getLocationNameFromGoogle(latitude, longitude);
//     if (googleName) {
//       console.log('Found location via Google:', googleName);
//       return googleName;
//     }

//     // Try BigDataCloud as second option
//     const bigDataName = await getLocationNameFromBigDataCloud(latitude, longitude);
//     if (bigDataName) {
//       console.log('Found location via BigDataCloud:', bigDataName);
//       return bigDataName;
//     }

//     // Try OpenStreetMap as third option
//     const osmName = await getLocationNameFromOSM(latitude, longitude);
//     if (osmName) {
//       console.log('Found location via OSM:', osmName);
//       return osmName;
//     }

//     // If all APIs fail, show coordinates
//     console.log('All geocoding APIs failed, using coordinates');
//     return `Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
    
//   } catch (error) {
//     console.error('All geocoding APIs failed:', error);
//     return 'Your location';
//   }
// };

// Google Maps Geocoding API (Most Accurate)
// const getLocationNameFromGoogle = async (latitude, longitude) => {
//   try {
//     const GOOGLE_MAPS_API_KEY = 'AIzaSyDiMFGT0VJq9FRjuCXczF3Df1rhnAQf_hE';
    
//     if (!GOOGLE_MAPS_API_KEY) {
//       console.log('Google Maps API key not configured');
//       return null;
//     }

//     const response = await fetch(
//       `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
//     );
    
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
    
//     const data = await response.json();
    
//     if (data.status === 'OK' && data.results.length > 0) {
//       // Find the most specific locality result
//       for (let result of data.results) {
//         const addressComponents = result.address_components;
        
//         // Look for locality
//         const locality = addressComponents.find(component =>
//           component.types.includes('locality')
//         );
        
//         // Look for administrative_area_level_2 (county)
//         const adminArea2 = addressComponents.find(component =>
//           component.types.includes('administrative_area_level_2')
//         );
        
//         // Look for postal_town
//         const postalTown = addressComponents.find(component =>
//           component.types.includes('postal_town')
//         );
        
//         if (locality) {
//           return locality.long_name;
//         } else if (postalTown) {
//           return postalTown.long_name;
//         } else if (adminArea2) {
//           return adminArea2.long_name;
//         }
//       }
      
//       // If no specific locality found, use the first result's formatted address
//       const firstResult = data.results[0];
//       const addressParts = firstResult.formatted_address.split(',');
//       return addressParts[0].trim();
//     } else {
//       console.warn('Google Geocoding failed:', data.status);
//       return null;
//     }
//   } catch (error) {
//     console.error('Error with Google Geocoding:', error);
//     return null;
//   }
// };

// // BigDataCloud API
// const getLocationNameFromBigDataCloud = async (latitude, longitude) => {
//   try {
//     const response = await fetch(
//       `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
//     );
    
//     if (response.ok) {
//       const data = await response.json();
      
//       if (data.city) {
//         return data.city;
//       } else if (data.locality) {
//         return data.locality;
//       }
//     }
//     return null;
//   } catch (error) {
//     console.error('Error with BigDataCloud:', error);
//     return null;
//   }
// };

// // OpenStreetMap Nominatim
// const getLocationNameFromOSM = async (latitude, longitude) => {
//   try {
//     const response = await fetch(
//       `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
//     );
    
//     if (response.ok) {
//       const data = await response.json();
      
//       if (data.address) {
//         const city = data.address.city || data.address.town || data.address.village || data.address.municipality;
//         if (city) {
//           return city;
//         }
//       }
//     }
//     return null;
//   } catch (error) {
//     console.error('Error with OSM:', error);
//     return null;
//   }
// };

export const HeaderIndicators = () => {
  const [accountAnchorEl, setAccountAnchorEl] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const { logout } = useAuthMethod();
  const { user } = useAuthUser();
  const navigate = useNavigate();
  const accountButtonRef = useRef(null);

  // Load user location from localStorage and get location name
  // useEffect(() => {
  //   const loadUserLocation = async () => {
  //     const userLocationStr = localStorage.getItem('userLocation');
  //     console.log('Loading user location from localStorage:', userLocationStr);
      
  //     if (userLocationStr) {
  //       try {
  //         const location = JSON.parse(userLocationStr);
  //         console.log('Parsed location:', location);
  //         setUserLocation(location);
  //         setIsLoadingLocation(true);
          
  //         // Get location name from coordinates using reverse geocoding
  //         const name = await getLocationName(location.latitude, location.longitude);
  //         console.log('Location name resolved:', name);
  //         setLocationName(name);
  //       } catch (error) {
  //         console.error('Error parsing user location:', error);
  //         setLocationName('Your location');
  //       } finally {
  //         setIsLoadingLocation(false);
  //       }
  //     } else {
  //       console.log('No user location found in localStorage');
  //     }
  //   };

  //   loadUserLocation();

  //   // Listen for location changes from Header component
  //   const handleLocationChanged = (event) => {
  //     console.log('Location changed event received in HeaderIndicators:', event.detail);
  //     if (event.detail.userLocation) {
  //       setUserLocation(event.detail.userLocation);
  //       setIsLoadingLocation(true);
        
  //       // Update location name when location changes
  //       getLocationName(event.detail.userLocation.latitude, event.detail.userLocation.longitude)
  //         .then(name => {
  //           setLocationName(name);
  //           setIsLoadingLocation(false);
  //         })
  //         .catch(error => {
  //           console.error('Error updating location name:', error);
  //           setLocationName('Your location');
  //           setIsLoadingLocation(false);
  //         });
  //     }
  //   };

  //   // Listen for storage changes to update location in real-time
  //   const handleStorageChange = (e) => {
  //     if (e.key === 'userLocation') {
  //       console.log('Storage change detected for userLocation');
  //       loadUserLocation();
  //     }
  //   };

  //   window.addEventListener('storage', handleStorageChange);
  //   window.addEventListener('locationChanged', handleLocationChanged);
    
  //   // Cleanup
  //   return () => {
  //     window.removeEventListener('storage', handleStorageChange);
  //     window.removeEventListener('locationChanged', handleLocationChanged);
  //   };
  // }, []);

  const handleAccountClick = (event) => {
    setAccountAnchorEl(accountAnchorEl ? null : accountButtonRef.current);
  };

  const handleAccountClose = () => {
    setAccountAnchorEl(null);
  };

  const openAccount = Boolean(accountAnchorEl);
  const idAccount = openAccount ? 'account-popover' : undefined;

  return (
    <div className="header__indicators">
      {/* Wishlist */}
      <WishlistButton/>
      <BasketButton />

      {/* Account */}
      <div className="indicator indicator--trigger--click" ref={accountButtonRef} onClick={handleAccountClick}>
        <a href="#" className="indicator__button">
          <span className="indicator__icon">
            <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
              <path d="M16,18C9.4,18,4,23.4,4,30H2c0-6.2,4-11.5,9.6-13.3C9.4,15.3,8,12.8,8,10c0-4.4,3.6-8,8-8s8,3.6,8,8c0,2.8-1.5,5.3-3.6,6.7 C26,18.5,30,23.8,30,30h-2C28,23.4,22.6,18,16,18z M22,10c0-3.3-2.7-6-6-6s-6,2.7-6,6s2.7,6,6,6S22,13.3,22,10z"></path>
            </svg>
          </span>
          <span className="indicator__title">Hello, {user?.id ? user.displayName : "Log In"}</span>
          {userLocation && (
            <span 
              className="indicator__value" 
              style={{ 
                fontSize: '12px', 
                color: '#666',
                display: 'block',
                marginTop: '2px',
                fontStyle: isLoadingLocation ? 'italic' : 'normal'
              }}
            >
              {/* {isLoadingLocation ? 'Detecting location...' : locationName}
              {userLocation && (
                <span style={{ fontSize: '10px', display: 'block', color: '#999' }}>
                  ({userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)})
                </span>
              )} */}
            </span>
          )}
          {!userLocation && user?.id && (
            <span className="indicator__value">My Account</span>
          )}
        </a>
        <Popover
          id={idAccount}
          open={openAccount}
          anchorEl={accountAnchorEl}
          onClose={handleAccountClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <AccountMenu anchorEl={accountAnchorEl} handleClose={handleAccountClose} />
        </Popover>
      </div>
    </div>
  );
};