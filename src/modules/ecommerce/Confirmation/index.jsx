import React from 'react';
import { Box } from '@mui/material';
import AppAnimate from '@crema/components/AppAnimate';
import { useGetDataApi } from '@crema/hooks/APIHooks';
import OrderPlaced from './OrderPlaced';
import AddressInfo from './AddressInfo';
import ItemsList from './ItemsList';
import { addresses } from '@crema/mockapi/fakedb/ecommerce/ecommerceData';
import AppLoader from '@crema/components/AppLoader';
import { useParams } from 'react-router-dom';
import { useGetOrderByIdQuery } from '@crema/Slices/orderSlice';

const Confirmation = () => {
  // Fetch data from API

  const {id} = useParams();
   // Fetch the order details by ID using the RTK Query hook
   const { data: order, error, isLoading } = useGetOrderByIdQuery(id);

   if (isLoading) return <AppLoader />;
     
  if (!Array.isArray(order?.items) || order?.items?.length === 0) {
    return <div>No orders found.</div>;
  }

  //Sort orders by date to get the most recent one
  // const sortedOrderItems = order.items.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  // const mostRecentOrder = sortedOrderItems[0];
  // console.log(mostRecentOrder);
  
  return (
    <>
      {isLoading && order ? (
        <AppLoader />
      ) : (
        <AppAnimate animation='transition.slideUpIn' delay={200}>
          <Box>
            <OrderPlaced order={order} />
            
            <ItemsList order={order} />
          </Box>
        </AppAnimate>
      )}
    </>
  );
};

export default Confirmation;
