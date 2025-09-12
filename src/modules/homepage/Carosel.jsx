import React from 'react';
import { Box, Typography, Container, Button, Grid, useMediaQuery } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#FF6B35',
    },
  },
  typography: {
    h2: {
      fontWeight: 700,
      fontSize: '3rem',
      letterSpacing: '0.1em',
      lineHeight: 1.2,
      '@media (max-width: 768px)': {
        fontSize: '2.2rem',
      },
      '@media (max-width: 480px)': {
        fontSize: '1.8rem',
      },
    },
    h4: {
      fontWeight: 400,
      fontSize: '1.6rem',
      letterSpacing: '0.2em',
      '@media (max-width: 768px)': {
        fontSize: '1.4rem',
      },
      '@media (max-width: 480px)': {
        fontSize: '1.1rem',
        letterSpacing: '0.1em',
      },
    },
  },
});

const OriginalityYouWear = () => {
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const isMediumScreen = useMediaQuery('(max-width:960px)');

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: isSmallScreen ? '50vh' : '35vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          p: isSmallScreen ? 1 : 2,
          pt: 1,
          pb: isSmallScreen ? 3 : 5,
     
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
            paddingLeft: { xs: '12px', sm: '24px', md: '0px' },
            paddingRight: { xs: '12px', sm: '24px', md: '0px' },
            width: '100%',
            maxWidth: { xs: '100%', md: 'lg' }
          }}
        >
          {/* Main title */}
          <Typography
            variant="h2"
            component="h1"
            sx={{
               fontFamily: `'Outfit', 'Outfit Fallback', sans-serif`,
              fontWeight: 500, 
              fontSize: {
                xs: '1.875rem', 
                sm: '3rem',     
                md: '3.5rem',
                lg: '4rem'
              },
              lineHeight: 1.2, 
              letterSpacing: 0,
              mb: { xs: 2, sm: 3, md: 4, lg: 5 },
              textAlign: 'center',
              color:'black',
              px: { xs: '4px', sm: 0 },
            }}
          >
            Gear Up for Work & the Road
          </Typography>

          {/* Buttons */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              mb: { xs: 3, sm: 4 },
              flexWrap: 'wrap',
              flexDirection: isSmallScreen ? 'column' : 'row',
              alignItems: 'center',
              width: '100%',
              paddingLeft: { xs: '8px', sm: 0 },
              paddingRight: { xs: '8px', sm: 0 },
            }}
          >
            <Button
              variant="contained"
              sx={{
                borderRadius: '5px',
                height: 45,
                px: 4,
                py: 1.5,
                width: isSmallScreen ? '100%' : 'auto',
                maxWidth: isSmallScreen ? '280px' : 'none',
                backgroundColor: 'secondary.main',
                '&:hover': { backgroundColor: '#E55A2B' },
              }}
            >
              Shop Now
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderRadius: '5px',
                height: 45,
                px: 4,
                py: 1.5,
                width: isSmallScreen ? '100%' : 'auto',
                maxWidth: isSmallScreen ? '280px' : 'none',
                borderColor: '#FD7E14',
                color: '#FD7E14',
                '&:hover': {
                  backgroundColor: '#F5F5F5',
                  borderColor: '#FD7E14',
                },
              }}
            >
              Flash Sales
            </Button>
          </Box>

          {/* Product images - Adjusted spacing */}
          <Grid
            container
            spacing={3} 
            justifyContent="center"
            sx={{
              mb: isSmallScreen ? 2 : 4,
              marginLeft: '0 !important',
              marginRight: '0 !important',
              width: '100%'
            }}
          >
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                paddingLeft: { xs: '4px', sm: '12px', md: '16px' },
                paddingRight: { xs: '4px', sm: '12px', md: '16px' }
              }}
            >
              <Box
                component="img"
                src="../../../assets/homepageimages/homeimage1.png"
                alt="Product 1"
                sx={{
                  width: isSmallScreen ? 200 : isMediumScreen ? 280 : 340,
                  height: isSmallScreen ? 200 : isMediumScreen ? 280 : 340,
                  objectFit: 'contain',
                  transform: 'rotate(-5deg)',
                  filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.1))',
                }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                paddingLeft: { xs: '4px', sm: '12px', md: '16px' },
                paddingRight: { xs: '4px', sm: '12px', md: '16px' }
              }}
            >
              <Box
                component="img"
                src="../../../assets/homepageimages/homeimage2.png"
                alt="Product 2"
                sx={{
                  width: isSmallScreen ? 200 : isMediumScreen ? 280 : 340,
                  height: isSmallScreen ? 200 : isMediumScreen ? 280 : 340,
                  objectFit: 'contain',
                  transform: 'rotate(3deg)',
                  filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.1))',
                }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                paddingLeft: { xs: '4px', sm: '12px', md: '16px' },
                paddingRight: { xs: '4px', sm: '12px', md: '16px' }
              }}
            >
              <Box
                component="img"
                src="../../../assets/homepageimages/homeimage3.png"
                alt="Product 3"
                sx={{
                  width: isSmallScreen ? 200 : isMediumScreen ? 280 : 340,
                  height: isSmallScreen ? 200 : isMediumScreen ? 280 : 340,
                  objectFit: 'contain',
                  transform: 'rotate(7deg)',
                  filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.1))',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default OriginalityYouWear;