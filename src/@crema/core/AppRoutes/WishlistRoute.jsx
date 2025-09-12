import React from 'react';
import { RoutePermittedRole } from '@crema/constants/AppEnums';

const Wishlist = React.lazy(() =>
    import('../../../modules/Wishlist/wishlist'),
  );

export const wishlistConfig = [
    {
      permittedRole: RoutePermittedRole.User,
      path: '/wishlist',
      element: <Wishlist/>,
    },
]