import React from 'react';
import Slider from '@mui/material/Slider';
import { Box } from '@mui/material';
import { Fonts } from '@crema/constants/AppEnums';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

const iOSBoxShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';
const PriceSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.primary.main,
  height: 8,
  padding: '10px 0',
  '& .MuiSlider-thumb': {
    height: 20,
    width: 20,
    backgroundColor: '#fff',
    boxShadow: iOSBoxShadow,
    '&:focus, &:hover, &.Mui-active': {
      boxShadow:
        '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: iOSBoxShadow,
      },
    },
  },
  '& .MuiSlider-valueLabel': {
    fontSize: 12,
    fontWeight: 'normal',
    top: -6,
    backgroundColor: 'unset',
    color: theme.palette.text.primary,
    '&:before': {
      display: 'none',
    },
    '& *': {
      background: 'transparent',
      color: theme.palette.mode === 'dark' ? '#fff' : '#000',
    },
  },
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-rail': {
    opacity: 0.5,
    backgroundColor: '#bfbfbf',
  },
  '& .MuiSlider-mark': {
    backgroundColor: '#bfbfbf',
    height: 8,
    width: 1,
    '&.MuiSlider-markActive': {
      opacity: 1,
      backgroundColor: 'currentColor',
    },
  },
}));

const PriceSelector = ({ value, onChange, maxValue }) => {
  const handleChange = (event, newValue) => {
    if (onChange) {
      onChange(event, newValue); // Ensure `onChange` is called only if it's defined
    }
  };

  return (
    <>
      <PriceSlider value={value} max={maxValue} onChange={handleChange} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ fontWeight: Fonts.MEDIUM }}>$ {value[0]}</Box>
        <Box sx={{ fontWeight: Fonts.MEDIUM }}>$ {value[1]}</Box>
      </Box>
    </>
  );
};

PriceSelector.propTypes = {
  value: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PriceSelector;
