import React, { useState, useEffect } from "react";
import { HeaderIndicators } from "./HeaderIndicators";
import "./style.header-spaceship-variant-one.css";
import "./mobile.css"
import logo from "../../../public/assets/paviimages/Logo.png";
import MobileHeader from "./MobileHeader";
import { Link } from "react-router-dom";
import MobileMenu from "./MobileMenu";

// Location Icon Component
const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ marginRight: '8px' }}>
    <path d="M8 0C4.1 0 1 3.1 1 7c0 1.9.7 3.7 2.1 5 .1.1 4.9 4.9 4.9 4.9s4.9-4.8 4.9-4.9c1.4-1.3 2.1-3.1 2.1-5C15 3.1 11.9 0 8 0zm0 10c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z"/>
  </svg>
);

// GPS Icon Component
const GPSIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ marginRight: '8px' }}>
    <path d="M8 0a1 1 0 0 0-1 1v.142A5.002 5.002 0 0 0 3 6v1H1a1 1 0 0 0 0 2h2v1a5.002 5.002 0 0 0 4 4.9V15a1 1 0 1 0 2 0v-.1A5.002 5.002 0 0 0 13 11v-1h2a1 1 0 1 0 0-2h-2V6a5.002 5.002 0 0 0-4-4.858V1a1 1 0 0 0-1-1zm2 6v5a2 2 0 1 1-4 0V6a2 2 0 1 1 4 0z"/>
  </svg>
);

const Header = () => {
  const [mobileView, setMobileView] = useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [locationMenuOpen, setLocationMenuOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [cityName, setCityName] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // LocationIQ API Key
  const LOCATION_IQ_API_KEY = 'pk.3afe48fb1a4f87a3a0a9a45a8471f945';

  // Get stored location from localStorage on component mount
  useEffect(() => {
    const storedLocation = getStoredLocation();
    if (storedLocation) {
      setUserLocation(storedLocation);
      if (storedLocation.city) {
        setCityName(storedLocation.city);
      } else if (storedLocation.latitude && storedLocation.longitude) {
        getCityName(storedLocation.latitude, storedLocation.longitude);
      }
    }
  }, []);

  // Get stored location from localStorage
  const getStoredLocation = () => {
    try {
      const stored = localStorage.getItem('userLocation');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error reading stored location:', error);
      return null;
    }
  };

  // Store location in localStorage
  const storeLocation = (location) => {
    try {
      localStorage.setItem('userLocation', JSON.stringify(location));
    } catch (error) {
      console.error('Error storing location:', error);
    }
  };

  // Reverse geocoding using LocationIQ and BigDataCloud
  const getCityName = async (latitude, longitude) => {
    console.log('Getting city name for coordinates:', latitude, longitude);
    
    // Try LocationIQ first, then fallback to BigDataCloud
    try {
      const city = await getCityNameFromLocationIQ(latitude, longitude);
      if (city && city !== 'Unknown Location') {
        return city;
      }
    } catch (error) {
      console.log('LocationIQ failed, trying BigDataCloud...');
    }

    // Try BigDataCloud as fallback
    try {
      const city = await getCityNameFromBigDataCloud(latitude, longitude);
      if (city && city !== 'Unknown Location') {
        return city;
      }
    } catch (error) {
      console.log('BigDataCloud also failed');
    }
    
    // If all services fail, use coordinates as fallback
    const fallbackName = `Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
    setCityName(fallbackName);
    updateStoredLocationCity(fallbackName);
    return fallbackName;
  };

  // Primary Service: LocationIQ
  const getCityNameFromLocationIQ = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://us1.locationiq.com/v1/reverse.php?key=${LOCATION_IQ_API_KEY}&lat=${latitude}&lon=${longitude}&format=json&accept-language=en`
      );
      
      if (!response.ok) {
        throw new Error(`LocationIQ API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('LocationIQ response:', data);
      
      if (data.address) {
        // Try to get the most specific location name for Mysuru region
        const city = data.address.city || 
                    data.address.town || 
                    data.address.village || 
                    data.address.county ||
                    data.address.state_district ||
                    data.address.region;
        
        if (city) {
          setCityName(city);
          updateStoredLocationCity(city);
          return city;
        } else if (data.display_name) {
          // Use the first part of display name as fallback
          const displayName = data.display_name.split(',')[0];
          setCityName(displayName);
          updateStoredLocationCity(displayName);
          return displayName;
        }
      }
      return 'Unknown Location';
    } catch (error) {
      console.error('Error with LocationIQ:', error);
      throw error;
    }
  };

  // Fallback Service: BigDataCloud (free, CORS-friendly)
  const getCityNameFromBigDataCloud = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      
      if (!response.ok) {
        throw new Error(`BigDataCloud API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('BigDataCloud response:', data);
      
      if (data.city) {
        setCityName(data.city);
        updateStoredLocationCity(data.city);
        return data.city;
      } else if (data.locality) {
        setCityName(data.locality);
        updateStoredLocationCity(data.locality);
        return data.locality;
      } else if (data.principalSubdivision) {
        setCityName(data.principalSubdivision);
        updateStoredLocationCity(data.principalSubdivision);
        return data.principalSubdivision;
      }
      return 'Unknown Location';
    } catch (error) {
      console.error('Error with BigDataCloud:', error);
      throw error;
    }
  };

  // Helper function to update stored location with city name
  const updateStoredLocationCity = (city) => {
    const storedLocation = getStoredLocation();
    if (storedLocation) {
      storedLocation.city = city;
      storeLocation(storedLocation);
    }
  };

  // Get display text for location
  const getLocationDisplayText = () => {
    if (!userLocation) {
      return 'Select Location';
    }
    if (isDetectingLocation) {
      return 'Detecting...';
    }
    return cityName || 'Your Location';
  };

  // Detect current location
  const detectCurrentLocation = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsDetectingLocation(true);
    setCityName('Detecting location...');

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        });
      });

      console.log('Raw geolocation coordinates:', {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy
      });

      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date().toISOString()
      };
      
      setUserLocation(location);
      storeLocation(location);
      
      // Get city name using our services
      await getCityName(location.latitude, location.longitude);
      
      setLocationMenuOpen(false);
    } catch (error) {
      console.error('Geolocation error:', error);
      let errorMessage = 'Unable to retrieve your location.';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location access denied. Please enable location permissions in your browser settings.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable. Please check your internet connection and try again.';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out. Please try again in an area with better signal.';
          break;
        default:
          errorMessage = 'An unexpected error occurred while detecting location.';
      }
      
      alert(errorMessage);
      setCityName('');
      setUserLocation(null);
    } finally {
      setIsDetectingLocation(false);
    }
  };

  // Clear location
  const clearLocation = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setUserLocation(null);
    setCityName('');
    setIsDetectingLocation(false);
    localStorage.removeItem('userLocation');
    setLocationMenuOpen(false);
  };

  // Handle dropdown toggle
  const toggleLocationMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLocationMenuOpen(!locationMenuOpen);
    // Close other menus
    setCurrencyMenuOpen(false);
    setLanguageMenuOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (locationMenuOpen || currencyMenuOpen || languageMenuOpen) {
        setLocationMenuOpen(false);
        setCurrencyMenuOpen(false);
        setLanguageMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [locationMenuOpen, currencyMenuOpen, languageMenuOpen]);

  const handleMobileMenu = (status) => {
    setMobileView(status);
  };

  return (
    <>
      <MobileHeader handleMobileMenu={handleMobileMenu} />
      <header className="site__header">
        <div className="header">
          <div className="header__megamenu-area megamenu-area"></div>
          <div className="header__topbar-start-bg"></div>
          <div className="header__topbar-start">
            <div className="topbar topbar--spaceship-start">
              <div
                style={{
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                Call Us: (619) 982-0777
              </div>
            </div>
          </div>
          <div className="header__topbar-end-bg"></div>
          <div className="header__topbar-end">
            <div className="topbar topbar--spaceship-end">
              
              {/* Current Location Dropdown */}
              <div className={`topbar__item-button topbar__menu ${locationMenuOpen ? 'topbar__menu--open' : ''}`}>
                <button
                  className="topbar__button topbar__button--has-arrow topbar__menu-button"
                  type="button"
                  onClick={toggleLocationMenu}
                  disabled={isDetectingLocation}
                >
                  <span className="topbar__button-label">Location:</span>
                  <span className="topbar__button-title">
                    {getLocationDisplayText()}
                  </span>
                  <span className="topbar__button-arrow">
                    <svg width="7px" height="5px">
                      <path d="M0.280,0.282 C0.645,-0.084 1.238,-0.077 1.596,0.297 L3.504,2.310 L5.413,0.297 C5.770,-0.077 6.363,-0.084 6.728,0.282 C7.080,0.634 7.088,1.203 6.746,1.565 L3.504,5.007 L0.262,1.565 C-0.080,1.203 -0.072,0.634 0.280,0.282 Z"></path>
                    </svg>
                  </span>
                </button>
                
                {/* Location Dropdown Menu */}
                <div 
                  className="topbar__menu-body" 
                  style={{
                    display: locationMenuOpen ? 'block' : 'none',
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    zIndex: 1000,
                    minWidth: '200px'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {!userLocation ? (
                    <button 
                      className="topbar__menu-item" 
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        width: '100%', 
                        textAlign: 'left',
                        cursor: isDetectingLocation ? 'not-allowed' : 'pointer',
                        padding: '12px 16px',
                        fontSize: '14px',
                        color: isDetectingLocation ? '#6c757d' : 'inherit',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        fontFamily: 'inherit',
                        opacity: isDetectingLocation ? 0.6 : 1
                      }}
                      onClick={detectCurrentLocation}
                      disabled={isDetectingLocation}
                    >
                      <GPSIcon /> 
                      {isDetectingLocation ? 'Detecting location...' : 'Detect current location'}
                    </button>
                  ) : (
                    <>
                      <div className="topbar__menu-item" style={{ 
                        cursor: 'default', 
                        color: '#6c757d', 
                        fontSize: '12px',
                        padding: '12px 16px',
                        borderBottom: '1px solid #f0f0f0',
                        background: '#f8f9fa'
                      }}>
                        <strong>Current Location:</strong>
                        <div style={{ marginTop: '4px' }}>{cityName || 'Location detected'}</div>
                        {userLocation && (
                          <div style={{ fontSize: '10px', marginTop: '4px' }}>
                            Lat: {userLocation.latitude.toFixed(6)}, Lng: {userLocation.longitude.toFixed(6)}
                            {userLocation.accuracy && (
                              <div>Accuracy: ±{Math.round(userLocation.accuracy)} meters</div>
                            )}
                          </div>
                        )}
                      </div>
                      <button 
                        className="topbar__menu-item" 
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          width: '100%', 
                          textAlign: 'left',
                          cursor: isDetectingLocation ? 'not-allowed' : 'pointer',
                          padding: '12px 16px',
                          fontSize: '14px',
                          color: isDetectingLocation ? '#6c757d' : 'inherit',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          fontFamily: 'inherit',
                          opacity: isDetectingLocation ? 0.6 : 1
                        }}
                        onClick={detectCurrentLocation}
                        disabled={isDetectingLocation}
                      >
                        <GPSIcon /> 
                        {isDetectingLocation ? 'Updating Location...' : 'Update Location'}
                      </button>
                      <button 
                        className="topbar__menu-item" 
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          width: '100%', 
                          textAlign: 'left',
                          cursor: 'pointer',
                          padding: '12px 16px',
                          fontSize: '14px',
                          color: '#dc3545',
                          textDecoration: 'none',
                          fontFamily: 'inherit'
                        }}
                        onClick={clearLocation}
                      >
                        Clear Location
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Currency Dropdown */}
              <div className={`topbar__item-button topbar__menu ${currencyMenuOpen ? 'topbar__menu--open' : ''}`}>
                <button
                  className="topbar__button topbar__button--has-arrow topbar__menu-button"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrencyMenuOpen(!currencyMenuOpen);
                    setLocationMenuOpen(false);
                    setLanguageMenuOpen(false);
                  }}
                >
                  <span className="topbar__button-label">Currency:</span>
                  <span className="topbar__button-title">USD</span>
                  <span className="topbar__button-arrow">
                    <svg width="7px" height="5px">
                      <path d="M0.280,0.282 C0.645,-0.084 1.238,-0.077 1.596,0.297 L3.504,2.310 L5.413,0.297 C5.770,-0.077 6.363,-0.084 6.728,0.282 C7.080,0.634 7.088,1.203 6.746,1.565 L3.504,5.007 L0.262,1.565 C-0.080,1.203 -0.072,0.634 0.280,0.282 Z"></path>
                    </svg>
                  </span>
                </button>
                {currencyMenuOpen && (
                  <div 
                    className="topbar__menu-body"
                    style={{
                      display: 'block',
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      zIndex: 1000,
                      minWidth: '150px'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a className="topbar__menu-item" href="#" onClick={(e) => e.preventDefault()}>€ Euro</a>
                    <a className="topbar__menu-item" href="#" onClick={(e) => e.preventDefault()}>£ Pound Sterling</a>
                    <a className="topbar__menu-item" href="#" onClick={(e) => e.preventDefault()}>$ US Dollar</a>
                    <a className="topbar__menu-item" href="#" onClick={(e) => e.preventDefault()}>₽ Russian Ruble</a>
                  </div>
                )}
              </div>

              {/* Language Dropdown */}
              <div className={`topbar__menu ${languageMenuOpen ? 'topbar__menu--open' : ''}`}>
                <button
                  className="topbar__button topbar__button--has-arrow topbar__menu-button"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setLanguageMenuOpen(!languageMenuOpen);
                    setLocationMenuOpen(false);
                    setCurrencyMenuOpen(false);
                  }}
                >
                  <span className="topbar__button-label">Language:</span>
                  <span className="topbar__button-title">EN</span>
                  <span className="topbar__button-arrow">
                    <svg width="7px" height="5px">
                      <path d="M0.280,0.282 C0.645,-0.084 1.238,-0.077 1.596,0.297 L3.504,2.310 L5.413,0.297 C5.770,-0.077 6.363,-0.084 6.728,0.282 C7.080,0.634 7.088,1.203 6.746,1.565 L3.504,5.007 L0.262,1.565 C-0.080,1.203 -0.072,0.634 0.280,0.282 Z"></path>
                    </svg>
                  </span>
                </button>
                {languageMenuOpen && (
                  <div 
                    className="topbar__menu-body"
                    style={{
                      display: 'block',
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      zIndex: 1000,
                      minWidth: '150px'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a className="topbar__menu-item" href="#" onClick={(e) => e.preventDefault()}>
                      <span>English</span>
                    </a>
                    <a className="topbar__menu-item" href="#" onClick={(e) => e.preventDefault()}>
                      <span>French</span>
                    </a>
                    <a className="topbar__menu-item" href="#" onClick={(e) => e.preventDefault()}>
                      <span>German</span>
                    </a>
                    <a className="topbar__menu-item" href="#" onClick={(e) => e.preventDefault()}>
                      <span>Russian</span>
                    </a>
                    <a className="topbar__menu-item" href="#" onClick={(e) => e.preventDefault()}>
                      <span>Italian</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="header__logo">
            <a href="#" className="logo">
              <div className="logo__slogan">Truck Tyres  Uniform Shirts</div>
              <div className="logo__image">
                <img
                  width={240}
                  height={30}
                  src={logo}
                  alt="QT Wholesales logo"
                />
              </div>
            </a>
          </div>

          <HeaderIndicators />

          <div className="header__navbar">
            <div className="header__navbar-menu">
              <div className="main-menu">
                <ul className="main-menu__list">
                  <li className="main-menu__item main-menu__item--submenu--menu main-menu__item--has-submenu">
                    <Link to="/home" className="main-menu__link">
                      Home
                    </Link>
                  </li>
                  <li className="main-menu__item main-menu__item--submenu--menu main-menu__item--has-submenu">
                    <Link to="ecommerce/products" className="main-menu__link">
                      All Products
                    </Link>
                  </li>
                  <li className="main-menu__item main-menu__item--submenu--menu main-menu__item--has-submenu">
                    <Link to="/about" className="main-menu__link">
                      About Us
                    </Link>
                  </li>
                  <li className="main-menu__item main-menu__item--submenu--menu main-menu__item--has-submenu">
                    <Link to="/contactus" className="main-menu__link">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={mobileView} mobileView />
    </>
  );
};

export default Header;