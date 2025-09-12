import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from "@crema/constants/AppConst.jsx";

export const orderApiSlice = createApi({
  reducerPath: 'orderApi',
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
  tagTypes: ['Orders'],
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: ({ page = 1, limit = 10 }) => `/order?page=${page}&limit=${limit}`,
     
      transformResponse: (response) => ({
        orders: response.results,
        currentPage: response.page,
        totalPages: response.totalPages,
        totalResults: response.totalResults,
      }),
      providesTags: ['Orders'],
    }),
    getOrderById: builder.query({
      query: (id) => `/order/${id}`,
      providesTags: (result, error, id) => [{ type: 'Orders', id }],
    }),
    getOrderStatus: builder.query({
      query: () => '/order/order-status', // Correct the endpoint path here
      transformResponse: (response) => response.orderStatusEnum, // Only returning the enum values
    }),
    createOrder: builder.mutation({
      query: (newOrder) => ({
        url: '/order',
        method: 'POST',
        body: newOrder,
      }),
      // Pick out data and prevent nested properties in a hook or selector
      transformResponse: (response, meta, arg) => response.data,
      invalidatesTags: ['Orders'],
    }),
    updateOrder: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/order/${id}`,
        method: 'PUT',
        body: rest,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Orders', id }, 'Orders'],
    }),
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/order/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Orders'],
    }),
    cancelOrder: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/order/${id}/cancel`,
        method: 'PATCH',
        body: { cancellationReason: reason }
      }),
      // Invalidate and refetch related queries
      invalidatesTags: (result, error, { id }) => [
        { type: 'Orders', id },
        'Orders'
      ]
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useGetOrderStatusQuery,
  useCancelOrderMutation
} = orderApiSlice;