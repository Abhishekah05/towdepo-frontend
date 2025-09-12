import React from 'react';
import { RoutePermittedRole } from '@crema/constants/AppEnums';

const Home = React.lazy(() =>
    import('../../../modules/homepage/Home'),
  );

export const homeConfig = [
    {
     permittedRole: RoutePermittedRole.User,
      path: '/Home',
      element: <Home />,
    },
]

