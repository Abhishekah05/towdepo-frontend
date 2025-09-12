// import React from 'react';
import { Navigate } from 'react-router-dom';


import { authRouteConfig } from './AuthRoutes';
import Error403 from '../../../modules/errorPages/Error403';
import { errorPagesConfigs } from './ErrorPagesRoutes';
import { extraPagesConfigs } from './ExtraPagesRoutes';
import { ecommerceConfig } from './EcommerceRoutes';
import { userListConfig } from './UserListRoutes';
import { userPagesConfig } from './UserPagesRoutes';
// import { appsConfig } from './AppsRoutes';
import { accountPagesConfigs } from './AccountRoutes';
import { invoiceConfig } from './InvoiceRoutes';
import { homeConfig } from './HomeRoutes';
import { ecomadminconfig } from './EcommerceAdminRoutes';
import { customizeConfig } from './CustomizeRoutes';
import {aboutConfig} from './AboutRoutes'
import {contactusConfig} from './ContactUsRoutes';
import {wishlistConfig} from './WishlistRoute';
import {helpConfig} from './HelpRoutes';
import { privacyConfig } from './PrivacyRoutes';
import { publicEcommerceConfig } from './PublicEcommereceRoutes';





export const authorizedStructure = (loginUrl) => {
  return {
    fallbackPath: loginUrl,
    unAuthorizedComponent: <Error403 />,
    routes: [
      ...accountPagesConfigs,
      // ...appsConfig,
      ...helpConfig,
      ...customizeConfig,
      ...ecomadminconfig,
      ...extraPagesConfigs,
      ...privacyConfig,
      ...ecommerceConfig,
      ...userPagesConfig,
      ...userListConfig,
      ...invoiceConfig,

    ],
  };
};

export const publicStructure = (initialUrl) => {
  return {
    fallbackPath: initialUrl,
    routes: [
      ...authRouteConfig,
      // Public home page
      ...homeConfig,
      // Public informational pages
      ...aboutConfig,
      ...contactusConfig,
      // Publicly accessible wishlist
      ...wishlistConfig,
      // Publicly accessible ecommerce browsing routes
      ...publicEcommerceConfig,
      

      
      {
        path: '/',
        element: <Navigate to={'/home'} />,
      },
      {
        path: '*',
        element: <Navigate to='/error-pages/error-404' />,
      },
    ],
  };
};
export const anonymousStructure = (initialUrl) => {
  return {
    routes: errorPagesConfigs.concat([
      {
        path: '/',
        element: <Navigate to={initialUrl} />,
      },
      {
        path: '*',
        element: <Navigate to='/error-pages/error-404' />,
      },
    ]),
  };
};