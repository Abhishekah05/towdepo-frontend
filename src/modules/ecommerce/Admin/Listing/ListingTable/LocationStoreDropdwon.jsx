// components/LocationFilterDropdown.jsx
import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography
} from '@mui/material';
import { LocationOn, Store } from '@mui/icons-material';

const LocationFilterDropdown = ({ 
  locations = [], 
  selectedLocation, 
  onLocationChange,
  label = "Filter by Store"
}) => {
  return (
    <FormControl size="small" sx={{ minWidth: 200, mr: 2 }}>
      <InputLabel>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Store fontSize="small" />
          {label}
        </Box>
      </InputLabel>
      <Select
        value={selectedLocation || ''}
        onChange={(e) => onLocationChange(e.target.value)}
        label={label}
        renderValue={(selected) => {
          if (!selected) return 'All Stores';
          const location = locations.find(loc => loc._id === selected || loc.id === selected);
          return location ? location.name : 'Select Store';
        }}
      >
        <MenuItem value="">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Store fontSize="small" />
            <Typography variant="body2">All Stores</Typography>
          </Box>
        </MenuItem>
        
        {locations.map((location) => (
          <MenuItem key={location._id || location.id} value={location._id || location.id}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn color="primary" fontSize="small" />
              <Box>
                <Typography variant="body2">
                  {location.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {location.radius}km radius
                </Typography>
              </Box>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LocationFilterDropdown;