// src/features/api/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { selectAuthToken } from './authSlice'; // Assume you have an auth slice
import { baseUrl } from "@crema/constants/AppConst.jsx";

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState }) => {
     
      const token = localStorage.getItem('token'); // or use another method to get the token

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({

    getProducts: builder.query({
      query: () => baseUrl+'product',
    }),
    getProductById: builder.query({
      query: (id) => `products/${id}`,
    }),
    createOrder: builder.mutation({
      query: (newOrder) => ({
        url: 'orders',
        method: 'POST',
        body: newOrder,
      }),
    }),
    getOrders: builder.query({
      query: () => 'orders',
    }),
    getOrderById: builder.query({
      query: (id) => `orders/${id}`,
    }),
    // Add other endpoints as needed
  }),
});

export const { 
  useGetProductsQuery, 
  useGetProductByIdQuery, 
  useCreateOrderMutation, 
  useGetOrdersQuery, 
  useGetOrderByIdQuery 
} = apiSlice;
