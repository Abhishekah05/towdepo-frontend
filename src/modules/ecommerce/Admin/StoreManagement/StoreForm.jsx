// components/Store/StoreForm.js
import React, { useState, useEffect } from 'react';
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
  IconButton,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Person as PersonIcon } from '@mui/icons-material';

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

    // Update coordinates in form data immediately
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

  
  const handleSubmit = async () => {
    // Validate owner data first
    if (!validateOwnerData()) {
      setActiveTab(0);
      return;
    }

    // Validate store data
    if (!validateStoreData()) {
      setActiveTab(1);
      return;
    }

    // Ensure coordinates are properly parsed
    const finalCoordinates = [
      parseFloat(locationManual.longitude) || 0,
      parseFloat(locationManual.latitude) || 0
    ];

    // Prepare owner data
    const ownerPayload = {
      name: ownerData.name,
      email: ownerData.email,
      phone: ownerData.phone,
      password: ownerData.password
    };

    // Prepare store data with owner and proper coordinates
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
      navigator.geolocation.getCurrentPosition(
        (position) => {
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
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get current location. Please enter manually.');
        }
      );
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };



  return (
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

              {/* Location Coordinates */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Location Coordinates
                </Typography>
                <Button
                  variant="outlined"
                  onClick={getCurrentLocation}
                  sx={{ mb: 2 }}
                >
                  Use Current Location
                </Button>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Longitude"
                  type="number"
                  value={locationManual.longitude}
                  onChange={(e) => handleLocationChange('longitude', e.target.value)}
                  placeholder="e.g., 77.5946"
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
  );
};

export default StoreForm;