import React from 'react';
import { Box } from '@mui/material';
import { useThemeContext } from '@crema/context/AppContextProvider/ThemeContextProvider';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

import { alpha } from '@mui/material/styles';
import logo from '../../../../../../public/assets/paviimages/Logo.png'
//import  Logo  from '../../../../../assets/icon/logo.svg';
// import LogoText  from '../../../../../assets/icon/logo_text.svg';

const AppLogo = () => {
  const { theme } = useThemeContext();
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/home'); // Navigate to the products page
  };
  return (
    <Box
      sx={{
        height: { xs: 56, sm: 70 },
        padding: 2.5,
        display: 'flex',
        flexDirection: 'row',
        cursor: 'pointer',
        alignItems: 'start',
        justifyContent: 'flex-start',
        '& img': {
          height: { xs: 40, sm: 45 },
        },
      }}
      className='app-logo'
    >
      <img   onClick={handleHomeClick} src={logo} alt='logo' />
      <Box
        sx={{
          mt: 1,
          display: { xs: 'none', md: 'block' },
          '& img': {
            height: { xs: 25, sm: 30 },
          },
        }}
      >
          {/* <img src={LogoText} alt={LogoText}/> */}
      </Box>
    </Box>
  );
};

export default AppLogo;
