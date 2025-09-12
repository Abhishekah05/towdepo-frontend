import React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import { Fonts } from '@crema/constants/AppEnums';

import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share';
import PropTypes from 'prop-types';

const Header = ({ product }) => {
  const shareUrl = `https://cra.crema-mui.com/ecommerce/product_detail/${product.id}`;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: { xs: 'column', sm: 'row' },
        pb: 5,
        mb: 5,
        borderBottom: '1px solid #E5E4EA',
      }}
    >
      <Box
        sx={{
          flex: 1,
        }}
      >
        <Box
          component='h3'
          sx={{
            color: 'text.primary',
            fontWeight: Fonts.BOLD,
            fontSize: 16,
            mb: 1,
          }}
        >
          {product.title}
        </Box>
        <Box
          sx={{
            display: 'flex',
          }}
        >
          <Rating defaultValue={product.rating} size='small' readOnly />
          <Box
            sx={{
              ml: 2,
              mr: 4,
              color: 'text.secondary',
            }}
          >
            {product.reviews || 0 + ' reviews'}
          </Box>

          <Box>
            SKU :{' '}
            <Box
              component='span'
              sx={{
                ml: 2,
                color: 'text.secondary',
              }}
            >
              {product.SKU}
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          mt: { xs: 4, sm: 0 },
        }}
      >
    
      </Box>
    </Box>
  );
};

export default Header;

Header.propTypes = {
  product: PropTypes.object,
};
