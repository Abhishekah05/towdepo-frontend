// src/features/api/productApiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from "@crema/constants/AppConst.jsx";



export const productApiSlice = createApi({
  reducerPath: 'productApi',
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
    getProducts: builder.query({
      query: () => `/product`,   // no ?page or ?limit
      transformResponse: (response) => ({
        products: response.results,
        totalResults: response.totalResults,
      }),
    }),
    getProductById: builder.query({
      query: (id) => `/product/${id}`,
    }),
    createProduct: builder.mutation({
      query: (newProduct) => ({
        url: '/product',
        method: 'POST',
        body: newProduct,
      }),
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/product/${id}`,
        method: 'PUT',
        body: rest,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/product/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApiSlice;
