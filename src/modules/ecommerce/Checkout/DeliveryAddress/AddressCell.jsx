import React from 'react';
import { Box, Button, TextField, Typography, Grid, useMediaQuery, useTheme } from '@mui/material';
import { Fonts } from '@crema/constants/AppEnums';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';

import { useLayoutActionsContext } from '@crema/context/AppContextProvider/LayoutContextProvider';

const AddressCell = ({ address, handleOpen }) => {
  const { setSelectedAddress } = useLayoutActionsContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  setSelectedAddress(address);

  const isActive = true; // Assuming isActive is true for demonstration purposes

  return (
    <Box
      onClick={() => setSelectedAddress(address)}
      className='item-hover'
      sx={{
        px: { xs: 2, md: 4 },
        py: { xs: 2, md: 3 },
        mt: { xs: 0, md: -10 }, // Remove negative margin on mobile
        borderRadius: 2,
        backgroundColor: '#ffffff',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: 16, md: 18 },
            fontWeight: Fonts.MEDIUM,
            color: '#333',
            flexGrow: 1,
          }}
        >
          Shipping Address
        </Typography>
        {isActive && (
          <IconButton
            size='small'
            onClick={(e) => {
              e.stopPropagation();
              handleOpen(address);
            }}
            sx={{
              color: '#666',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.04)'
              }
            }}
          >
            <EditOutlinedIcon />
          </IconButton>
        )}
      </Box>

      <Grid container spacing={isMobile ? 2 : 3}>
        {/* Left Column (4 fields) */}
        <Grid item xs={12} md={6}>
          {/* Full Name */}
          <Typography variant="body2" sx={{ fontSize: 14, fontWeight: Fonts.MEDIUM, color: '#333', mb: 1 }}>
            Full Name*
          </Typography>
          <TextField
            fullWidth
            value={address?.fullName || ''}
            placeholder="Enter your full name"
            variant="outlined"
            size="small"
            InputProps={{ 
              readOnly: true, 
              sx: { borderRadius: "5px", width: "100%" } // Full width on mobile
            }}
          />

          {/* Email */}
          <Box mt={2}>
            <Typography variant="body2" sx={{ fontSize: 14, fontWeight: Fonts.MEDIUM, color: '#333', mb: 1 }}>
              Email Address*
            </Typography>
            <TextField
              fullWidth
              value={address?.email || ''}
              placeholder="Enter your email address"
              variant="outlined"
              size="small"
              InputProps={{ 
                readOnly: true, 
                sx: { borderRadius: "5px", width: "100%" } // Full width on mobile
              }}
            />
          </Box>

          {/* Confirmation Email */}
          <Box mt={2}>
            <Typography variant="body2" sx={{ fontSize: 14, fontWeight: Fonts.MEDIUM, color: '#333', mb: 1 }}>
              Confirmation Email*
            </Typography>
            <TextField
              fullWidth
              value={address?.confirmEmail || ''}
              placeholder="Enter your confirmation email"
              variant="outlined"
              size="small"
              InputProps={{ 
                readOnly: true, 
                sx: { borderRadius: "5px", width: "100%" } // Full width on mobile
              }}
            />
          </Box>

          {/* Phone Number */}
          <Box mt={2}>
            <Typography variant="body2" sx={{ fontSize: 14, fontWeight: Fonts.MEDIUM, color: '#333', mb: 1 }}>
              Phone Number*
            </Typography>
            <TextField
              fullWidth
              value={address?.phoneNumber || ''}
              placeholder="Enter your phone number"
              variant="outlined"
              size="small"
              InputProps={{ 
                readOnly: true, 
                sx: { borderRadius: "5px", width: "100%" } // Full width on mobile
              }}
            />
          </Box>
        </Grid>

        {/* Right Column (3 fields) */}
        <Grid item xs={12} md={6}>
          {/* House Number and Street */}
          <Typography variant="body2" sx={{ fontSize: 14, fontWeight: Fonts.MEDIUM, color: '#333', mb: 1 }}>
            Street Name*
          </Typography>
          <TextField
            fullWidth
            value={address?.addressLine1 || ''}
            placeholder="Enter your street name"
            variant="outlined"
            size="small"
            InputProps={{ 
              readOnly: true, 
              sx: { borderRadius: "5px", width: "100%" } // Full width on mobile
            }}
          />

          {/* City */}
          <Box mt={2}>
            <Typography variant="body2" sx={{ fontSize: 14, fontWeight: Fonts.MEDIUM, color: '#333', mb: 1 }}>
              City*
            </Typography>
            <TextField
              fullWidth
              value={address?.city || ''}
              placeholder="City"
              variant="outlined"
              size="small"
              InputProps={{ 
                readOnly: true, 
                sx: { borderRadius: "5px", width: "100%" } // Full width on mobile
              }}
            />
          </Box>

          {/* Postal Code */}
          <Box mt={2}>
            <Typography variant="body2" sx={{ fontSize: 14, fontWeight: Fonts.MEDIUM, color: '#333', mb: 1 }}>
              Postal Code*
            </Typography>
            <TextField
              fullWidth
              value={address?.postalCode || ''}
              placeholder="Enter your postal code"
              variant="outlined"
              size="small"
              InputProps={{ 
                readOnly: true, 
                sx: { borderRadius: "5px", width: "100%" } // Full width on mobile
              }}
            />
          </Box>
          {/* State */}
          <Box mt={2}>
            <Typography variant="body2" sx={{ fontSize: 14, fontWeight: Fonts.MEDIUM, color: '#333', mb: 1 }}>
              State*
            </Typography>
            <TextField
              fullWidth
              value={address?.state || ''}
              placeholder="Enter your state"
              variant="outlined"
              size="small"
              InputProps={{ 
                readOnly: true, 
                sx: { borderRadius: "5px", width: "100%" } // Full width on mobile
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddressCell;

AddressCell.propTypes = {
  address: PropTypes.object.isRequired,
  selectedAddress: PropTypes.object.isRequired,
  setSelectAddress: PropTypes.func.isRequired,
  handleOpen: PropTypes.func.isRequired,
};