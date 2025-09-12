import React from 'react';
import { RoutePermittedRole } from '@crema/constants/AppEnums';

const ContactUS = React.lazy(() =>
    import('../../../modules/Contact/index'),
  );

export const contactusConfig = [
    {
      permittedRole: RoutePermittedRole.User,
      path: '/contactus',
      element: <ContactUS/>,
    },
]