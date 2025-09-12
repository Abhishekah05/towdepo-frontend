import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from "@crema/constants/AppConst.jsx";

export const cancellationReasonApiSlice = createApi({
  reducerPath: 'cancellationReasonApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['CancellationReasons'],
  endpoints: (builder) => ({
    getCancellationReasons: builder.query({
      query: ({ page = 1, limit = 10, isActive }) => {
        let url = `/ordercancel?page=${page}&limit=${limit}`;
        if (isActive !== undefined) {
          url += `&isActive=${isActive}`;
        }
        return url;
      },
      transformResponse: (response) => ({
        data: response.data,
        currentPage: response.data.page,
        totalPages: response.data.totalPages,
        totalResults: response.data.totalResults,
      }),
      providesTags: ['CancellationReasons'],
    }),
    
    getCancellationReasonById: builder.query({
      query: (id) => `/ordercancel/${id}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: 'CancellationReasons', id }],
    }),
    
    createCancellationReason: builder.mutation({
      query: (newReason) => ({
        url: '/ordercancel',
        method: 'POST',
        body: newReason,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ['CancellationReasons'],
    }),
    
    updateCancellationReason: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/ordercancel/${id}`,
        method: 'PUT',
        body: rest,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, { id }) => [
        { type: 'CancellationReasons', id }, 
        'CancellationReasons'
      ],
    }),
    
    deleteCancellationReason: builder.mutation({
      query: (id) => ({
        url: `/ordercancel/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CancellationReasons'],
    }),
    
    toggleCancellationReasonStatus: builder.mutation({
      query: ({ id, isActive }) => ({
        url: `/ordercancel/${id}`,
        method: 'PUT',
        body: { isActive },
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, { id }) => [
        { type: 'CancellationReasons', id }, 
        'CancellationReasons'
      ],
    }),
  }),
});

export const {
  useGetCancellationReasonsQuery,
  useGetCancellationReasonByIdQuery,
  useCreateCancellationReasonMutation,
  useUpdateCancellationReasonMutation,
  useDeleteCancellationReasonMutation,
  useToggleCancellationReasonStatusMutation
} = cancellationReasonApiSlice;