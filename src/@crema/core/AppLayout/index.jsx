import React, { useEffect, useState } from 'react';
import { useUrlSearchParams } from 'use-url-search-params';
import { useLocation, useNavigate } from 'react-router-dom';
import AppContentView from '@crema/components/AppContentView';
import generateRoutes from '@crema/helpers/RouteGenerator';
import { Layouts } from '@crema/components/AppLayout';
import { NavStyle } from '@crema/constants/AppEnums';
import { useAuthUser } from '@crema/hooks/AuthHooks';
import {
  useLayoutActionsContext,
  useLayoutContext,
} from '@crema/context/AppContextProvider/LayoutContextProvider';
import { useSidebarActionsContext } from '@crema/context/AppContextProvider/SidebarContextProvider';
import {
  anonymousStructure,
  authorizedStructure,
  publicStructure,
} from '../AppRoutes';
import { useRoutes } from 'react-router-dom';
import routesConfig from '../AppRoutes/routeConfig';
import { initialUrl } from '@crema/constants/AppConst';
import { getInitialUrlByRole } from '../../constants/AppConst';
import MiniSidebar from '@crema/components/AppLayout/MiniSidebar';
import { ecomadminconfig } from '../AppRoutes/EcommerceAdminRoutes';
import { useSelector } from 'react-redux'; // Import useSelector to access cart state

const AppLayout = () => {
  const { navStyle } = useLayoutContext();
  const { user: authUser, isAuthenticated, isLoading } = useAuthUser();
  const { updateNavStyle } = useLayoutActionsContext();
  const { updateMenuStyle, setSidebarBgImage } = useSidebarActionsContext();
  const [params] = useUrlSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get cart items from Redux store
  const cartItems = useSelector((state) => state.cart.items);
  
  const loginuser = authUser?.role?.[0];
  const roleBasedInitialUrl = getInitialUrlByRole(loginuser);
  const initURL = isAuthenticated
    ? (params?.redirect ? params?.redirect : roleBasedInitialUrl)
    : '/home';
  const loginUrl = `/signin`;

  // Check if current path is an auth page
  const isAuthPage = ['/signin', '/signup', '/forget-password', '/confirm-signup', '/reset-password']
    .includes(location.pathname);
  
  // Determine if the user is an admin
  const isAdmin = authUser?.role?.[0] === 'admin';

  // Check if the current route belongs to ecomadminconfig
  const isEcommAdminRoute = ecomadminconfig.some((route) =>
    window.location.pathname.startsWith(route.path)
  );

  // Determine the layout to use
  const SelectedLayout =
    isEcommAdminRoute || isAdmin ? MiniSidebar : (Layouts[navStyle] || Layouts[NavStyle.DEFAULT]);

  const generatedRoutes = generateRoutes({
    isAuthenticated,
    userRole: authUser?.role?.[0],
    anonymousStructure: anonymousStructure(initURL),
    authorizedStructure: authorizedStructure(loginUrl),
    publicStructure: publicStructure(initURL),
  });

  const routes = useRoutes(generatedRoutes);

  // Handle redirection after login
  useEffect(() => {
    // If user is authenticated and on an auth page, redirect to intended destination
    if (isAuthenticated && isAuthPage) {
      const searchParams = new URLSearchParams(location.search);
      let redirectUrl = searchParams.get('redirect');
      
      // If no specific redirect URL, check if there's a stored intended destination
      if (!redirectUrl) {
        // Check if there's a stored path from Dropcart
        const intendedDestination = localStorage.getItem('intendedDestination');
        if (intendedDestination) {
          redirectUrl = intendedDestination;
          localStorage.removeItem('intendedDestination');
        } else if (cartItems && cartItems.length > 0) {
          // If user has items in cart, redirect to checkout
          redirectUrl = '/ecommerce/checkout';
        } else {
          // Otherwise redirect to home or role-based URL
          redirectUrl = roleBasedInitialUrl;
        }
      }
      
      navigate(redirectUrl, { replace: true });
    }
  }, [isAuthenticated, isAuthPage, location.search, navigate, roleBasedInitialUrl, cartItems]);

  useEffect(() => {
    if (params.layout) updateNavStyle(params.layout);
    if (params.menuStyle) updateMenuStyle(params.menuStyle);
    if (params.sidebarImage) setSidebarBgImage(true);
  }, [
    params.layout,
    params.menuStyle,
    params.sidebarImage,
    updateNavStyle,
    updateMenuStyle,
    setSidebarBgImage,
  ]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // For auth pages, render without any layout (header/footer)
  if (isAuthPage) {
    return <AppContentView routes={routes} />;
  }

  // For all other pages, render with the appropriate layout
  return (
    <SelectedLayout routes={routes} routesConfig={routesConfig} />
  );
};

export default AppLayout;