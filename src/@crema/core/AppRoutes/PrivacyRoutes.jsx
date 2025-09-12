import React from 'react';
import { RoutePermittedRole } from '@crema/constants/AppEnums';

const Privacy = React.lazy(() =>
    import('../../../modules/PrivacyPolicy/policy'),
  );

export const privacyConfig = [
    {
      permittedRole: RoutePermittedRole.User,
      path: '/privacy',
      element: <Privacy/>,
    },
]