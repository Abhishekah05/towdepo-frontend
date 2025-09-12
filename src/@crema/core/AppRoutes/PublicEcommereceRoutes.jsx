import React from 'react';

const Home = React.lazy(() => import('../../../modules/homepage/Home'));
const Products = React.lazy(() => import('../../../modules/ecommerce/Products'));
const ProductDetail = React.lazy(() => import('../../../modules/ecommerce/ProductDetail'));
const ProductView = React.lazy(() => import('../../../modules/samplePages/productView'));

export const publicEcommerceConfig = [
  {
    path: '/home',
    element: <Home />,
    
  },
  {
    path: '/ecommerce/products',
    element: <Products />,
  },
  {
        path: ['/ecommerce/product_detail/', '/ecommerce/product_detail/:id'],
    element: <ProductDetail />,
  },

  {
     path: '/ecommerce/product-view/:id',
    element: <ProductView />,
  
  },

];




