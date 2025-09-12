// This function checks if a user has the necessary permission to access a route.
// It compares the user's role(s) with the required role(s) for a given route.
export const checkPermission = (routeRole, userRole) => {
  
  // If there is no role specified for the route or the user, grant access.
  if (!routeRole || !userRole) {
    return true;
  }

  // If the user has multiple roles and the route requires a single role,
  // check if any of the user's roles match the required route role.
  if (userRole && Array.isArray(userRole) && !Array.isArray(routeRole)) {
    return userRole.indexOf(routeRole) >= 0;
  }

  // If the route doesn't require any specific role,
  // allow access if the user doesn't have any roles.
  if (routeRole.length === 0) {
    return !userRole || userRole.length === 0;
  }

  // If both the route and the user have multiple roles,
  // check if there's any overlap between the two sets of roles.
  if (userRole && Array.isArray(userRole) && Array.isArray(routeRole)) {
    return routeRole.some((r) => userRole.indexOf(r) >= 0);
  }

  // If both the route and the user have single roles, check if they match.
  return routeRole.indexOf(userRole) >= 0;
};

