
import "../../../styles/Homeslide.css";

import Productcarosel from './CryptoMarketActivity/Productcarosel';
import Brand from "./CryptoMarketActivity/Brand";
import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Divider, Box, Typography, Grid } from '@mui/material';

const Crypto = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12}>
          <Box sx={{ position: 'relative', maxWidth: '100%', height: 'auto' }}>
            <Carousel
              showThumbs={false}
              useKeyboardArrows
              showStatus={false}
              infiniteLoop
              autoPlay
              transitionTime={1000}
              swipeScrollTolerance={2}
            >
              <div>
                <img src="/assets/images/ecommerce/HomeSlide1.jpg" alt="Slide 1"  />
                {/* <Typography variant="h4" align="center" className="legend">QT Whole Sales</Typography> */}
              </div>
              <div>
                <img src="/assets/images/ecommerce/HomeSlide2.jpg" alt="Slide 2"  />
                {/* <Typography variant="h6" align="center" className="legend">Caption for Slide 2</Typography> */}
              </div>
              <div>
                <img src="/assets/images/ecommerce/HomeSlide3.jpg" alt="Slide 3"  />
                {/* <Typography variant="h6" align="center" className="legend">Caption for Slide 3</Typography> */}
              </div>
            </Carousel>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 4 }} />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h1" align="Left" sx={{ mb: 2 }}>
            Products
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ mb: 4 }} />
        </Grid>

        <Grid item xs={12}>
          < Productcarosel />

        </Grid>
      </Grid>
      <Grid item xs={12}>
          <Divider sx={{ my: 4 }} />
        </Grid>
      <Grid item xs={12}>
          <Typography variant="h1" align="Left" sx={{ mb: 2 }}>
            Shop by Brand
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ my: 4 }} />
        </Grid>
        <Grid item xs={6}>
        <Brand/>

        </Grid>
       
        <Grid item xs={12}>
          <Divider sx={{ my: 4 }} />
        </Grid>
    </Box>
  );
}

export default Crypto;
