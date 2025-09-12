import React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import AppLogo from '@crema/components/AppLayout/components/AppLogo';

const AuthWrapper = ({ children }) => {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'column' }, // Column for mobile, keep existing for desktop
        justifyContent: 'center',
        alignItems: { xs: 'center', sm: 'flex-start' },
        p: 2,
        minHeight: '100vh',
        backgroundImage: {
          xs: 'none', // Remove background on mobile
          sm: `url('/assets/login-backgroundimg/login.png')`,
        },
        backgroundSize: '95% auto',
        backgroundPosition: 'right center',
        backgroundRepeat: 'no-repeat',
        marginRight: { xs: 0, sm: '80px' } // Remove margin on mobile
      }}
    >
      {/* Mobile Logo - Only visible on mobile screens */}
      <Box
        sx={{
          display: { xs: 'flex', sm: 'none' }, // Only show on mobile
          justifyContent: 'center',
          alignItems: 'center',
          mb: 4,
          mt: 2,
        }}
      >
        <AppLogo />
      </Box>

      <Card
        sx={{
          width: { xs: '100%', sm: 380 },
          maxWidth: { xs: 400, sm: 380 },
          minHeight: { xs: 'auto', sm: 430 },
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          boxShadow: { xs: 2, sm: 10 },
          p: { xs: 3, sm: 5 },
          ml: { xs: 0, sm: 108 },
          mt: { xs: 0, sm: 0 } // Remove top margin on mobile since logo is outside
        }}
      >
        <Box sx={{ width: '100%' }}>
          {/* Desktop Logo Section - Only visible on desktop */}
          <Box
            sx={{
              mb: 4,
              display: { xs: 'none', sm: 'flex' }, // Only show on desktop
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AppLogo />
          </Box>

          {/* Form Children */}
          {children}
        </Box>
      </Card>
    </Box>
  );
};

export default AuthWrapper;