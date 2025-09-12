import React from 'react';
import { Box,Typography ,Button  } from '@mui/material';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import DateRangeIcon from '@mui/icons-material/DateRange';

const AvailableOffers = () => {
  return (
    <Box
      sx={{
        mb: 5,
      }}
    >
      <Box
        component='h3'
        sx={{
          color: 'text.primary',
          fontSize: 16,
          mb: 3,
        }}
      >
        Available offers
      </Box>

      {/* <Box
        sx={{
          fontSize: 14,
          display: 'flex',
          alignItems: 'center',
          color: 'primary.main',
        }}
      >
        <LocalOfferOutlinedIcon style={{ fontSize: 18 }} />
        <Box
          component='span'
          sx={{
            color: 'text.primary',
            mx: 3,
          }}
        >
          Special PriceGet extra ₹598 off (price inclusive of discount)
          <Box
            component='span'
            sx={{
              color: 'primary.main',
              ml: 2,
            }}
          >
            T&C
          </Box>
        </Box>
      </Box> */}

      {/* <Box

        sx={{
          fontSize: 14,
          my: 3,
          display: 'flex',
          alignItems: 'center',
          color: 'primary.main',
        }}
      >
        <DateRangeIcon style={{ fontSize: 18 }} />
        <Box
          component='span'
          sx={{
            color: 'text.primary',
            mx: 3,
          }}
        >
          No cost EMI ₹1,368/month. Standard EMI also available
          <Box
            component='span'
            sx={{
              color: 'primary.main',
            }}
          >
            View Plans
          </Box>
        </Box>
      </Box> */}

        {/* Special Price Offer */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
        <LocalOfferOutlinedIcon sx={{ color: 'primary.main', mr: 2, mt: 4 , fontSize:20}} />
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
              Special Price
            </Typography>
            <Typography variant="body1">
              Get extra ₹598 off (price inclusive of discount)
            </Typography>
            <Button sx={{ ml: 1, color: 'primary.main', textTransform: 'none' }}>
              T&C
            </Button>
          </Box>
        </Box>
      </Box>

      {/* EMI Offer */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
        <DateRangeIcon sx={{ color: 'primary.main', mr: 2, mt: 4, fontSize:22}} />
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ mr: 1 }}>
              No cost EMI ₹1,368/month. Standard EMI also available
            </Typography>
            <Button sx={{ color: 'primary.main', textTransform: 'none' }}>
              View Plans
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AvailableOffers;
