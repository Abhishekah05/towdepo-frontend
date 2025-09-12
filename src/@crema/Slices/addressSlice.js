// src/features/api/addressApiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from "@crema/constants/AppConst.jsx";


export const addressApiSlice = createApi({
  reducerPath: 'addressApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl  ,
    prepareHeaders: (headers, { getState }) => {
 
     const token = localStorage.getItem('token'); // or use another method to get the token
     if (token) {
       headers.set('Authorization', `Bearer ${token}`);
     }
 
     return headers;
   }
   
   }),
  endpoints: (builder) => ({
    getAddresses: builder.query({
      query: ({ page = 1, limit = 10 }) => `/address?page=${page}&limit=${limit}`,
      transformResponse: (response) => ({
        addresses: response.results,
        currentPage: response.page,
        totalPages: response.totalPages,
      }),
    }),
    getAddressById: builder.query({
      query: (id) => `/address/${id}`,
    }),
    createAddress: builder.mutation({
      query: (newAddress) => ({
        url: '/address',
        method: 'POST',
        body: newAddress,
      }),
    }),
    updateAddress: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/address/${id}`,
        method: 'PATCH',
        body: rest,
      }),
    }),
    deleteAddress: builder.mutation({
      query: (id) => ({
        url: `/address/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useGetAddressByIdQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressApiSlice;
