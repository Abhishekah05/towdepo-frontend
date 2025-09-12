import React from 'react';
import { RoutePermittedRole } from '@crema/constants/AppEnums';

const About = React.lazy(() =>
    import('../../../modules/About/about'),
  );

export const aboutConfig = [
    {
      permittedRole: RoutePermittedRole.User,
      path: '/about',
      element: <About />,
    },
]