import React from 'react';
import { RoutePermittedRole } from '@crema/constants/AppEnums';

const Customize = React.lazy(() =>
    import('../../../modules/samplePages/Customize'),
  );

export const customizeConfig = [
    {
      permittedRole: RoutePermittedRole.User,
      path: '/customize/:variantId',
      element: <Customize />,
    },
]