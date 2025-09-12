import React from 'react';
import PropTypes from 'prop-types';
import AppLoader from '../AppLoader';

const AppSuspense = ({children , loadingProps = {
  delay: 300,
} }) => {
  return (
    <React.Suspense fallback={<AppLoader />}>{children}</React.Suspense>
  );
};

AppSuspense.propTypes = {
  loadingProps: PropTypes.object,
};



export default AppSuspense;

AppSuspense.propTypes = {
  children: PropTypes.node.isRequired,
};
