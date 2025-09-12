import React from 'react';
import { Box, inputBaseClasses, lighten } from '@mui/material';
import { Fonts } from '@crema/constants/AppEnums';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import PropTypes from 'prop-types';

export const SearchWrapper = ({ iconPosition, children }) => {
  return (
    <Box
      sx={{
        borderRadius: (theme) => theme.cardRadius,
        display: 'block',
        cursor: 'pointer',
        '& .searchRoot .MuiInputBase-input': {
          paddingLeft: iconPosition === 'right' ? 5 : 'calc(1em + 28px)',
          paddingRight: iconPosition === 'right' ? 'calc(1em + 28px)' : 5,
        },
      }}
    >
      {children}
    </Box>
  );
};
SearchWrapper.propTypes = {
  iconPosition: PropTypes.string,
  children: PropTypes.node,
};

export const SearchInputBase = styled(InputBase)(({ theme }) => ({
  fontWeight: Fonts.MEDIUM,

  [`& .${inputBaseClasses.root}`]: {
    color: 'inherit',
    width: '100%',
  },
  [`& .${inputBaseClasses.input}`]: {
    border: '0 none',
    backgroundColor: lighten(theme.palette.background.default, 0.25),
    color: theme.palette.text.primary,
    borderRadius: 30,
    padding: theme.spacing(2, 2, 2, 0),
    paddingLeft: `calc(1em + ${theme.spacing(6)})`,
    transition: theme.transitions.create('width'),
    width: 200,
    height: 40,
    boxSizing: 'border-box',
    [theme.breakpoints.down('md')]: {
      width: '100%', // Full width on mobile
      height: 48, // Taller for better touch targets
      fontSize: '16px', // Larger font for mobile
    },
    '&:focus': {
      backgroundColor: lighten(theme.palette.background.default, 0.25),
      width: 240,
      [theme.breakpoints.down('md')]: {
        width: '100%', // Stay full width on mobile when focused
      },
    },
    '&:hover': {
      backgroundColor: lighten(theme.palette.background.default, 0.2),
      [theme.breakpoints.down('md')]: {
        backgroundColor: lighten(theme.palette.background.default, 0.25),
      },
    },
  },
}));

export const SearchIconBox = styled('div')((props) => ({
  position: 'relative',
  marginLeft: props.align === 'right' ? 'auto' : 0,
  '& .searchIconBox': {
    position: 'relative',
    '& $inputInput': {
      width: 220,
      borderRadius: 50,
      paddingLeft: 27,
      '&:focus': {
        width: 235,
        borderRadius: 50,
        paddingLeft: `calc(1em + ${props.theme.spacing(4)})`,
      },
    },
  },
  '&.hs-disableFocus': {
    '& .MuiInputBase-root': {
      width: '100%',
    },
    '& .MuiInputBase-input': {
      width: '100%',
      '&:focus': {
        width: '100%',
      },
    },
  },
}));
export const SearchIconWrapper = styled('div')(({ theme }) => ({
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 12,
  zIndex: 1,
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    left: 16, // Adjust icon position for mobile
    '& svg': {
      fontSize: '24px', // Larger icon for mobile
    },
  },
  '&.right': {
    left: 'auto',
    right: 12,
    [theme.breakpoints.down('md')]: {
      right: 16, // Adjust right icon position for mobile
    },
    '& + $inputRoot $inputInput': {
      paddingLeft: theme.spacing(5),
      paddingRight: `calc(1em + ${theme.spacing(7)})`,
    },
  },
}));