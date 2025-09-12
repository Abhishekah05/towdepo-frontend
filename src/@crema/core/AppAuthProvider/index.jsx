import React from 'react';
//import FirebaseAuthProvider from '@crema/services/auth/firebase/FirebaseAuthProvider';

import JWTAuthProvider from '@crema/services/auth/jwt-auth/JWTAuthProvider'

import PropTypes from 'prop-types';

const AppAuthProvider = ({ children }) => {
  return <JWTAuthProvider>{children}</JWTAuthProvider>;
};

AppAuthProvider.propTypes = {
  children: PropTypes.node,
};
export default AppAuthProvider;
