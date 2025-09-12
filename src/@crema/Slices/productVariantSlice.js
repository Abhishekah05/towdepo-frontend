// src/features/api/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from "@crema/constants/AppConst.jsx";

export const productVariantApiSlice = createApi({
  reducerPath: 'productVariantApiSlice',
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ['ProductVariant', 'Product'],
  endpoints: (builder) => ({
    getProductVariants: builder.query({
      query: () => 'productVariant',
      transformResponse: (response) => {
        // Ensure the response is mapped correctly
        return {
          variants: response.results || [],
          currentPage: response.page || 1,
          totalPages: response.totalPages || 1,
          totalResults: response.totalResults || 0,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.variants.map(({ id }) => ({ type: 'ProductVariant', id })),
              { type: 'ProductVariant', id: 'LIST' },
            ]
          : [{ type: 'ProductVariant', id: 'LIST' }],
    }),
    addProductVariant: builder.mutation({
      query: (newVariant) => ({
        url: 'productVariant',
        method: 'POST',
        body: newVariant,
      }),
      invalidatesTags: [{ type: 'ProductVariant', id: 'LIST' }, { type: 'Product', id: 'LIST' }],
    }),
    updateProductVariant: builder.mutation({
      query: ({ id, body }) => {
        // Log the payload being sent
        console.log('Update payload:', body);
        return {
          url: `productVariant/${id}`,
          method: 'PUT',
          body: body,
        };
      },
      // Invalidate both the specific variant and the list
      invalidatesTags: (result, error, { id }) => [
        { type: 'ProductVariant', id },
        { type: 'ProductVariant', id: 'LIST' },
        { type: 'Product', id: 'LIST' },
      ],
      transformResponse: (response) => {
        // Log the response from the backend
        console.log('Update response:', response);
        return response;
      },
      transformErrorResponse: (response) => {
        // Log any errors
        console.error('Update error:', response);
        return response;
      },
    }),
    deleteProductVariant: builder.mutation({
      query: (id) => ({
        url: `productVariant/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'ProductVariant', id: 'LIST' }, { type: 'Product', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetProductVariantsQuery,
  useAddProductVariantMutation,
  useUpdateProductVariantMutation,
  useDeleteProductVariantMutation,
} = productVariantApiSlice;