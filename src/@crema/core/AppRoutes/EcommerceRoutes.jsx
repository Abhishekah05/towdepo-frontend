import React from 'react';
import { RoutePermittedRole } from '@crema/constants/AppEnums';

const Products = React.lazy(() =>
  import('../../../modules/ecommerce/Products'),
);
const ProductDetail = React.lazy(() =>
  import('../../../modules/ecommerce/ProductDetail'),
);
const OrderDetail = React.lazy(() =>
  import('../../../modules/ecommerce/Admin/Orders/OrderViewPage'),
);

const SafetyShirts = React.lazy(() =>
  import('../../../modules/ecommerce/ProductDetail/SafetyShirts'),
);
// src/modules/ecommerce/ProductDetail/SafetyShirts.jsx

const Customers = React.lazy(() =>
  import('../../../modules/ecommerce/Customers'),
);

const Checkout = React.lazy(() =>
  import('../../../modules/ecommerce/Checkout'),
);
const Carts = React.lazy(() => import('../../../modules/ecommerce/Carts'));
const Orders = React.lazy(() => import('../../../modules/ecommerce/Orders'));
const OrdersManagement = React.lazy(() => import('../../../modules/ecommerce/Admin/Orders'));
const ProductNew = React.lazy(() => import('../../../modules/samplePages'));
const Confirmation = React.lazy(() =>
  import('../../../modules/ecommerce/Confirmation'),
);
const Invoice1 = React.lazy(() =>
  import('../../../modules/ecommerce/Invoice1'),
);
const Invoice2 = React.lazy(() =>
  import('../../../modules/ecommerce/Invoice2'),
);

const ProductListing = React.lazy(() =>
  import('../../../modules/ecommerce/Admin/Listing'),
);
const AddProduct = React.lazy(() =>
  import('../../../modules/ecommerce/Admin/AddEditProduct'),
);
const EditProduct = React.lazy(() =>
  import('../../../modules/ecommerce/Admin/EditProduct'),
);

// const ProductSettings = React.lazy(() =>
//   import('../../../modules/ecommerce/Admin/productSettingsPage'),
// );




export const ecommerceConfig = [
  {
    permittedRole: RoutePermittedRole.SuperAdmin,

    path: '/ecommerce/invoice-1',
    element: <Invoice1 />,
  },
  {
    permittedRole: RoutePermittedRole.User,

    path: '/ecommerce/ss/:id',
    element: <SafetyShirts />,
  },

  {
    permittedRole: RoutePermittedRole.User,
    path: '/ecommerce/invoice-2',
    element: <Invoice2 />,
  },
  // {
  //   permittedRole: RoutePermittedRole.User,
  //   path: '/ecommerce/product-settings/:id',
  //   element: <ProductSettings />,
  // },

  {
    // permittedRole: RoutePermittedRole.Admin,
    permittedRole: RoutePermittedRole.User,
    path: '/ecommerce/products',
    element: <Products />,
  },

  {
    permittedRole: RoutePermittedRole.User,
    path: ['/ecommerce/product_detail/', '/ecommerce/product_detail/:id'],
    element: <ProductDetail />,
  },
  {
    permittedRole: [RoutePermittedRole.User,RoutePermittedRole.Admin],
    path: ['/ecommerce/order_detail/', '/ecommerce/order_detail/:id'],
    element: <OrderDetail />,
  },

  //
  {
    permittedRole: RoutePermittedRole.User,
    path: '/ecommerce/customers',
    element: <Customers />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/ecommerce/order-management',
    element: <OrdersManagement />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/ecommerce/product-new',
    element: <ProductNew />,
  },

  {
    permittedRole: RoutePermittedRole.User,
    path: '/ecommerce/checkout',
    element: <Checkout />,
  },

  {
    permittedRole: RoutePermittedRole.User,
    path: '/ecommerce/cart',
    element: <Carts />,
  },

  {
    permittedRole: RoutePermittedRole.User,
    path: '/ecommerce/orders',
    element: <Orders />,
  },

  {
    permittedRole: [RoutePermittedRole.User],
    path: '/ecommerce/confirmation/:id',
    element: <Confirmation />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/ecommerce/product-listing',
    element: <ProductListing />,
  },
  {
    permittedRole: RoutePermittedRole.Admin,
    path: '/ecommerce/add-products',
    element: <AddProduct />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/ecommerce/edit-products/:id',
    element: <EditProduct />,
  },
 
];
