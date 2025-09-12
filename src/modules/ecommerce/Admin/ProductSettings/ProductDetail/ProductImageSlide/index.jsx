import { useState } from 'react';
import { Button, Checkbox, Box, Grid, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useInfoViewActionsContext } from '@crema/context/AppContextProvider/InfoViewContextProvider';
import { postDataApi } from '@crema/hooks/APIHooks';
import { mediaUrl } from "@crema/constants/AppConst.jsx";

import { useSelector, useDispatch } from 'react-redux';
import { getCartItems, addItemToCart} from '@crema/Slices/cartSlice'; // Adjust the path as needed



const BrainHubSliderRoot = styled(Box)(() => {
  return {
    position: 'relative',
    display: 'flex',
  };
});

const MediaSlider = ({ children }) => {
  return (
    <Box
      sx={{
        width: '100%',
        '& .slick-slider': {
          pb: 5,
        },
        '& .slick-track': {
          display: 'flex',
          '& .slick-slide': {
            height: '500px',
            '& > div': {
              height: '100%',
            },
          },
        },
        '& .slick-slide img': {
          display: 'inline-block',
        },
        '& .slick-dots': {
          bottom: 0,
          '& li': {
            width: 10,
            height: 10,
            '& button': {
              width: 10,
              height: 10,
              padding: 0,
            },
            '& button:before': {
              fontSize: 0,
              width: 10,
              height: 10,
              borderRadius: '50%',
            },
          },
        },
      }}
    >
      {children}
    </Box>
  );
};

const ProductImageSlide = ({ product }) => {
  const [value, setValue] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const infoViewActionsContext = useInfoViewActionsContext();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const onChange = (value) => {
    setValue(value);
  };

  const onQuantityChange = (event) => {
    setQuantity(event.target.value);

    
    product = {quantity : event.target.value , ...product }

  };

  const onAddToCard = () => {

    
    dispatch(addItemToCart(product));
 
    infoViewActionsContext.showMessage(
      `${product.title} added to cart successfully`,
    );
};

  const onButNowToCard = () => {
    navigate('/ecommerce/cart');
  };

  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    autoplay: false,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Grid item sm={12} md={4}>
      <BrainHubSliderRoot>
        <MediaSlider>
          <div
            style={{
              height: 'auto',
              width: '100%',
              overflow: 'hidden',
            }}
          >
            <Slider {...settings}>
              {product.images.map((item, index) => (
                <Box key={index} sx={{ px: 3, py: 3, height: '100%' }}>
                  <img
                    src={`${mediaUrl}/product/${item.src}`}
                    alt='watch'
                    width={191}
                    height={259}
                    sizes='100vh'
                    style={{
                      objectFit: 'contain',
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </Box>
              ))}
            </Slider>
          </div>
        </MediaSlider>
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 2,
          }}
        >
          <Checkbox
            sx={{
              color: (theme) => theme.palette.warning.main,
              '&.Mui-checked': {
                color: (theme) => theme.palette.warning.main,
              },
            }}
            icon={<FavoriteBorderIcon />}
            checkedIcon={<FavoriteOutlinedIcon />}
          />
        </Box>
      </BrainHubSliderRoot>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 5,
        }}
      >
        <FormControl sx={{ mb: 2, width: 140 }}>
          <InputLabel>Quantity</InputLabel>
          <Select
            value={quantity}
            onChange={onQuantityChange}
            label='Quantity'
          >
            {[...Array(10).keys()].map((num) => (
              <MenuItem key={num + 1} value={num + 1}>
                {num + 1}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant='contained'
          color='primary'
          onClick={onAddToCard}
          style={{  width: 140 }}
        >
          Add to cart
        </Button>
     
      
      </Box>
    
    </Grid>
  );
};

export default ProductImageSlide;

ProductImageSlide.propTypes = {
  product: PropTypes.object,
};
