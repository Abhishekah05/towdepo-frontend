import React from 'react';
import { RoutePermittedRole } from '@crema/constants/AppEnums';

const ProductListing = React.lazy(() =>
  import('../../../modules/ecommerce/Admin/Listing'),
);
const AddProduct = React.lazy(() =>
  import('../../../modules/ecommerce/Admin/AddEditProduct'),
);
const EditProduct = React.lazy(() =>
  import('../../../modules/ecommerce/Admin/EditProduct'),
);

const ProductView = React.lazy(() =>
  import('../../../modules/samplePages/productView'),
);

const OrdersManagement = React.lazy(() => import('../../../modules/ecommerce/Admin/Orders'));

const StoreManagement = React.lazy(() => import('../../../modules/ecommerce/Admin/StoreManagement/Store'));

const ProductSettings = React.lazy(() =>
  import('../../../modules/ecommerce/Admin/productSettingsPage'),
);


export const ecomadminconfig = [
  {
    permittedRole: [RoutePermittedRole.SuperAdmin,RoutePermittedRole.Admin ],
    path: '/ecommerce/product-listing',
    element: <ProductListing />,
  },

  {
    permittedRole: RoutePermittedRole.Admin,
    path: '/ecommerce/add-products',
    element: <AddProduct />,
  },
  {
    permittedRole: RoutePermittedRole.Admin,
    path: '/ecommerce/edit-products/:id' ,
    element: <EditProduct />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/ecommerce/product-view/:id',
    element: <ProductView />,
  },
  {
    permittedRole: RoutePermittedRole.Admin,
    path: '/ecommerce/order-management',
    element: <OrdersManagement />,
  },
   {
    permittedRole:[RoutePermittedRole.SuperAdmin,RoutePermittedRole.Admin ] ,
    path: '/ecommerce/store-management',
    element: <StoreManagement />,
  },
  {
    permittedRole: RoutePermittedRole.Admin,
    path: '/ecommerce/product-settings/:id',
    element: <ProductSettings />,
  },
]