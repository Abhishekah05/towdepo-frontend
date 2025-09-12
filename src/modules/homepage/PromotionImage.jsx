import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import {
  Instagram as InstagramIcon,
  Payment as PaymentIcon,
  AssignmentReturn as ReturnIcon,
  SupportAgent as SupportIcon,
} from '@mui/icons-material';

const FollowUs = () => {
  return (
    <Box sx={{ py: 8, width: '100%', marginTop: 15 }}>
      <Container maxWidth={false} sx={{ maxWidth: '95%' }}>
        {/* Follow Us Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{
              color: 'black',
              mb: 2,
              // fontFamily: 'Work Sans, sans-serif',
              fontWeight: 800,
              // fontStyle: 'normal',
              fontSize: '48px',
              lineHeight: '100%',
              letterSpacing: '0%',
              textAlign: 'center',
            }}
          >
            Follow Us
          </Typography>

          <br />
          {/* Towdepo with Instagram Icon */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4, mb: 4}}>
          <Box
          sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          bgcolor: '#f1640b',
          color: 'white',
          px: 2.5,
          py: 1,
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }
          }}
          >
          <InstagramIcon sx={{ fontSize: 28, color: 'white' }} />
          <Typography
           variant="h6"
           sx={{
           fontFamily: 'Syne, sans-serif',
           fontWeight: 600,
           fontStyle: 'normal',
           fontSize: '16px',
           lineHeight: '100%',
           letterSpacing: '0%',
          color: 'white',
            }}>
          Towd_Depo
          </Typography>

          </Box>
          </Box>
          </Box>
          <br />

        {/* Services Section */}
        <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
        <Box
        component="img"
        src="assets/homepageimages/Payment.png"
        alt="Payment Method"
        sx={{
        width: 60,
        height: 60,
        objectFit: "contain",
        backgroundColor: "#FFF4E7",
        mb: 13,
        borderRadius: "15px",
        p: 1
        }}/>
       <Typography
        variant="h5"
        sx={{
        // fontFamily: 'Syne, sans-serif',
        fontWeight: 600,
        fontStyle: 'normal',
        fontSize: '28px',
        lineHeight: '100%',
        letterSpacing: '0%',
        color: '#000000',
        mb: 10,
        }}>
        Payment Method
        </Typography>

        <Typography variant="body1" 
        sx={{
        fontFamily: 'Open Sans, sans-serif',
        fontWeight: 400,
        fontSize: '20px',
        lineHeight: '100%',
        letterSpacing: '0%',
        textAlign: 'center',
       color: '#000000',
        }}>
        We offer flexible payment
        </Typography>

        <Typography variant="body1" 
        sx={{
        fontFamily: 'Open Sans, sans-serif',
        fontWeight: 400,
        fontSize: '20px',
        lineHeight: '150%',
        letterSpacing: '0%',
        textAlign: 'center',
            color: '#000000',
        }}>
        options, to make easier.
        </Typography>
            
        </Box>
        </Grid>

        <Grid item xs={12} md={4}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box
        component="img"
        src="assets/homepageimages/Return.png"
        alt="Return"
        sx={{
        width: 60,
        height: 60,
        objectFit: "contain",
        backgroundColor: "#FFF4E7",
        mb: 13,
        borderRadius: "15px",
        p: 1
        }}/>

        <Typography
        variant="h5"
        sx={{
      
        fontWeight: 600,
        fontStyle: 'normal',
        fontSize: '28px',
        lineHeight: '100%',
        letterSpacing: '0%',
          color: '#000000',
        mb: 10,
        }}
        >
        Return policy
        </Typography>

        <Typography 
        variant="body1" 
        sx={{
        fontFamily: 'Open Sans, sans-serif',
        fontWeight: 400,
        fontSize: '20px',
        lineHeight: '100%',
        letterSpacing: '0%',
        textAlign: 'center',
         color: '#000000',
        }}>
        You can return a product
        </Typography>

        <Typography 
        variant="body1" 
        sx={{
        fontFamily: 'Open Sans, sans-serif',
        fontWeight: 400,
        fontSize: '20px',
        lineHeight: '150%',
        letterSpacing: '0%',
        textAlign: 'center',
         color: '#000000',
        }}>
        within 30 days.
        </Typography>
        
        </Box>
        </Grid>

        <Grid item xs={12} md={4}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box
        component="img"
        src="assets/homepageimages/Support.png"
        alt="Support"
        sx={{
        width: 60,
        height: 60,
      objectFit: "contain",
        backgroundColor: "#FFF4E7",
        mb: 13,
        borderRadius: "15px",
        p: 1
        }}/>

        <Typography
        variant="h5"
        sx={{
        
        fontWeight: 600,
        fontStyle: 'normal',
        fontSize: '28px',
        lineHeight: '100%',
        letterSpacing: '0%',
           color: '#000000',
        mb: 10,
        }}>
        Customer Support
        </Typography>

        <Typography 
        variant="body1" 
        sx={{
        fontFamily: 'Open Sans, sans-serif',
        fontWeight: 400,
        fontSize: '20px',
        lineHeight: '100%',
        letterSpacing: '0%',
        textAlign: 'center',
          color: '#000000',
        }}>
        Our customer support
        </Typography>

        <Typography 
        variant="body1" 
        sx={{
        fontFamily: 'Open Sans, sans-serif',
        fontWeight: 400,
        fontSize: '20px',
        lineHeight: '150%',
        letterSpacing: '0%',
        textAlign: 'center',
  color: '#000000',
        }}>
        is 24/7.
        </Typography>

        </Box>
        </Grid>
        </Grid>
        </Container>
        </Box>
        );
      };

      export default FollowUs;