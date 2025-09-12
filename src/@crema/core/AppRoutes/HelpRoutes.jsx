import React from 'react';
import { RoutePermittedRole } from '@crema/constants/AppEnums';

const Help = React.lazy(() =>
    import('../../../modules/Help/help'),
  );

export const helpConfig = [
    {
      permittedRole: RoutePermittedRole.User,
      path: '/help',
      element: <Help />,
    },
]