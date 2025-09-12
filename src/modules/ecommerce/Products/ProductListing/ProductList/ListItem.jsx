import React from 'react';
import Card from '@mui/material/Card';
import { Checkbox } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import IntlMessages from '@crema/helpers/IntlMessages';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import { green } from '@mui/material/colors';
import { Fonts } from '@crema/constants/AppEnums';
import { useNavigate } from 'react-router-dom';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import { mediaUrl } from "@crema/constants/AppConst.jsx";

const ListItem = (props) => {
  const { item } = props;
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        p: 5,
        mb: 4,
        cursor: 'pointer',
      }}
      className='item-hover'
      onClick={() => {
        navigate('/ecommerce/product-view/' + item.id);
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Box
          sx={{
            pr: { xs: 0, sm: 4 },
            mb: { xs: 3, sm: 0 },
            maxWidth: '100%',
            textAlign: 'center',
            width: { sm: '8rem', xl: '10rem' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              mx: 2,
              maxHeight: { xs: 140, sm: 200, md: 260 },
              minHeight: { xs: 140, sm: 200, md: 260 },
              '& img': {
                maxHeight: '100%',
                maxWidth: '100%',
              },
            }}
          >
            <img src={`${mediaUrl}/product/${item.images?.[0]?.src}`} alt='Product Image' />
          </Box>
        </Box>

        <Box
          sx={{
            width: {
              xs: '100%',
              sm: 'calc(100% - 8rem)',
              xl: 'calc(100% - 10rem)',
            },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
              mt: -4,
            }}
          >
            <Box
              component='h3'
              sx={{
                fontWeight: Fonts.BOLD,
                fontSize: 16,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {item.title}
            </Box>

            <Checkbox
              icon={<FavoriteBorderIcon />}
              checkedIcon={<FavoriteOutlinedIcon />}
              sx={{ padding: 0 }}
            />
          </Box>

          <Box
            component='p'
            sx={{
              color: 'text.secondary',
              mb: 3,
              fontSize: 14,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {item.description}
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Box
              sx={{
                color: 'primary.contrastText',
                backgroundColor: green[500],
                pt: 1.5,
                pb: 1,
                px: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontWeight: Fonts.MEDIUM,
                borderRadius: 8,
                fontSize: 14,
              }}
            >
              <Box component='span' sx={{ pb: 1.25 }}>
                {item.rating}
              </Box>
              <Box
                component='span'
                sx={{
                  ml: 1,
                }}
              >
                <StarBorderIcon
                  sx={{
                    fontSize: 16,
                  }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                ml: 2,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <AddShoppingCartOutlinedIcon sx={{ fontSize: 16, mt: 1 }} />
              {/* <Box
                component='span'
                sx={{
                  fontSize: 14,
                  ml: 1,
                }}
              >
                <IntlMessages id='ecommerce.addToCart' />
              </Box> */}
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: { xs: 12, xl: 14 },
            }}
          >
            <Box>
              <Box
                component='span'
                sx={{
                  color: 'text.primary',
                  px: 1,
                }}
              >
                $ {+item.mrp - Math.round((+item.mrp * +item.discount) / 100)}
              </Box>
              <Box
                component='span'
                sx={{
                  color: 'text.disabled',
                  textDecoration: 'line-through',
                  px: 1,
                }}
              >
                ${item.mrp}
              </Box>
              <Box
                component='span'
                sx={{
                  color: green[500],
                  px: 1,
                }}
              >
                {item.discount}% <IntlMessages id='ecommerce.off' />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default ListItem;

ListItem.propTypes = {
  item: PropTypes.object.isRequired,
};
