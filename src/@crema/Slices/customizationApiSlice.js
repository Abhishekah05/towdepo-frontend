import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { baseUrl } from "@crema/constants/AppConst.jsx";

export const customizationApiSlice = createApi({
  reducerPath: 'customizationApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl ,
    prepareHeaders: (headers, { getState }) => {
 
      const token = localStorage.getItem('token'); // or use another method to get the token
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
  
      return headers;
    }
    
  
  }),
  tagTypes: ['Customization'],
  endpoints: (builder) => ({
    createCustomization: builder.mutation({
      query: (data) => ({
        url: '/customization',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Customization'],
    }),
    getCustomization: builder.query({
      query: (customizationId) => `/customizations/${customizationId}`,
      providesTags: ['Customization'],
    }),
    updateCustomization: builder.mutation({
      query: ({ customizationId, data }) => ({
        url: `/customizations/${customizationId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Customization'],
    }),
    deleteCustomization: builder.mutation({
      query: (customizationId) => ({
        url: `/customizations/${customizationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Customization'],
    }),
  }),
});

export const {
  useCreateCustomizationMutation,
  useGetCustomizationQuery,
  useUpdateCustomizationMutation,
  useDeleteCustomizationMutation,
} = customizationApiSlice;

export default customizationApiSlice.reducer;
