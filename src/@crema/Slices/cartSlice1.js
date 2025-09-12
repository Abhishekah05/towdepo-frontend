import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { baseUrl } from "@crema/constants/AppConst.jsx";

export const cartApiSlice = createApi({
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('token'); // or use another method to get the token
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    }
  }),
  endpoints: (builder) => ({
    getCartItems: builder.query({
      query: () => '/cart',
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }),
    addItemToCart: builder.mutation({
      query: (item) => ({
        url: '/cart',
        method: 'POST',
        body: item,
      }),
    }),
    updateCartItem: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/cart/${id}`,
        method: 'PUT',
        body: rest,
      }),
    }),
    removeItemFromCart: builder.mutation({
      query: (id) => ({
        url: `/cart/${id}`,
        method: 'DELETE',
      }),
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: '/cart',
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetCartItemsQuery,
  useAddItemToCartMutation,
  useUpdateCartItemMutation,
  useRemoveItemFromCartMutation,
  useClearCartMutation,
} = cartApiSlice;
