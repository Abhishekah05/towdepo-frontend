import React from 'react';
import { Navigate } from 'react-router-dom';
import { authRole } from '@crema/constants/AppConst';
import { RoutePermittedRole } from '@crema/constants/AppEnums';
import { checkPermission } from './RouteHelper';

const generateRoutes = (structure) => {
  const {
    isAuthenticated = false,
    anonymousStructure = {},
    authorizedStructure = {},
    publicStructure = {},
    userRole = authRole.User,
  } = structure || {};

  let dynamicRoutes = [];

  // First, process public routes (accessible to everyone)
  if (publicStructure) {
    dynamicRoutes.push(
      ...routesGenerator(isAuthenticated, publicStructure, 'public'),
    );
  }

  // Then process authorized routes (require authentication)
  if (authorizedStructure) {
    dynamicRoutes.push(
      ...routesGenerator(
        isAuthenticated,
        authorizedStructure,
        'authorized',
        isAuthenticated ? userRole : null,
      ),
    );
  }

  // Finally process anonymous routes
  if (anonymousStructure) {
    dynamicRoutes.push(
      ...routesGenerator(isAuthenticated, anonymousStructure, 'anonymous'),
    );
  }

  return dynamicRoutes;
};

const routesGenerator = (
  isAuthenticated = false,
  routeSet = {},
  type = 'anonymous',
  userRole,
) => {
  const generatedRoutes = [];
  const { fallbackPath = '' } = routeSet || {};

  const isAnonymous = type === 'anonymous';
  const isAuthorized = type === 'authorized';
  const isPublic = type === 'public';

  if (routeSet?.routes) {
    const { routes } = routeSet;
    if (Array.isArray(routes) && routes.length > 0) {
      routes.forEach((route) => {
        const {
          path = '',
          permittedRole = RoutePermittedRole.User,
          redirectPath = '',
          showRouteIf = true,
        } = route || {};

        // Show Route only if this prop is true
        if (showRouteIf && path) {
          // For public routes - always add them regardless of authentication
          if (isPublic) {
            if (Array.isArray(route.path)) {
              route.path.forEach((path) => {
                generatedRoutes.push({
                  element: route.element,
                  path: path,
                  permittedRole: route.permittedRole,
                });
              });
            } else {
              generatedRoutes.push(route);
            }
            return;
          }

          // For authorized routes - only add if authenticated and has permission
          if (isAuthorized) {
            const renderCondition = isAuthenticated;

            if (renderCondition) {
              if (checkPermission(permittedRole, userRole)) {
                if (Array.isArray(route.path)) {
                  route.path.forEach((path) => {
                    generatedRoutes.push({
                      element: route.element,
                      path: path,
                      permittedRole: route.permittedRole,
                    });
                  });
                } else {
                  generatedRoutes.push(route);
                }
              } else {
                // User doesn't have permission
                if (Array.isArray(route.path)) {
                  route.path.forEach((path) => {
                    generatedRoutes.push({
                      path: path,
                      element: routeSet.unAuthorizedComponent || <Error403 />,
                    });
                  });
                } else {
                  generatedRoutes.push({
                    path: route.path,
                    element: routeSet.unAuthorizedComponent || <Error403 />,
                  });
                }
              }
            } else {
              // User not authenticated - redirect to login
              if (Array.isArray(route.path)) {
                route.path.forEach((path) => {
                  generatedRoutes.push({
                    path: path,
                    element: <Navigate to={redirectPath || fallbackPath} replace />,
                  });
                });
              } else {
                generatedRoutes.push({
                  path: route.path,
                  element: <Navigate to={redirectPath || fallbackPath} replace />,
                });
              }
            }
            return;
          }

          // For anonymous routes
          if (isAnonymous) {
            if (Array.isArray(route.path)) {
              route.path.forEach((path) => {
                generatedRoutes.push({
                  element: route.element,
                  path: path,
                  permittedRole: route.permittedRole,
                });
              });
            } else {
              generatedRoutes.push(route);
            }
          }
        }
      });
    }
  }
  return generatedRoutes;
};

export default generateRoutes;