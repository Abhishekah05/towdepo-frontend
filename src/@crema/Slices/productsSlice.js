// src/features/api/productApiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from "@crema/constants/AppConst.jsx";

export const productApiSlice = createApi({
  reducerPath: 'productApi',
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
  tagTypes: ['Product', 'StoreProducts'], // Add tag types for cache invalidation

  endpoints: (builder) => ({
    // Get all products
    getProducts: builder.query({
      query: () => `/product`,
      transformResponse: (response) => ({
        products: response.results,
        totalResults: response.totalResults,
      }),
      providesTags: ['Product'],
    }),

    // Get products by store ID
    getProductsByStore: builder.query({
      query: (storeId) => `/store/${storeId}/products`,
      transformResponse: (response) => ({
        products: response.results,
        totalResults: response.totalResults,
      }),
      providesTags: ['StoreProducts'],
    }),

    // Get products by owner ID (NEW)
    getProductsByOwner: builder.query({
      query: (ownerId) => `/store/owner/${ownerId}/products`,
      transformResponse: (response) => ({
        products: response.results,
        totalResults: response.totalResults,
      }),
      providesTags: ['StoreProducts'],
    }),

    // Get products by owner ID with pagination and filters
    getProductsByOwnerWithFilters: builder.query({
      query: ({ ownerId, page = 1, limit = 10, filters = {} }) => {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);
        
        // Add optional filters
        if (filters.category) params.append('category', filters.category);
        if (filters.inStock !== undefined) params.append('inStock', filters.inStock);
        if (filters.name) params.append('name', filters.name);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);

        return `/store/owner/${ownerId}/products?${params.toString()}`;
      },
      transformResponse: (response) => ({
        products: response.results,
        totalResults: response.totalResults,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      }),
      providesTags: ['StoreProducts'],
    }),

    // Get product by ID
    getProductById: builder.query({
      query: (id) => `/product/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    // Create product
    createProduct: builder.mutation({
      query: (newProduct) => ({
        url: '/product',
        method: 'POST',
        body: newProduct,
      }),
      invalidatesTags: ['Product', 'StoreProducts'],
    }),

    // Update product
    updateProduct: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/product/${id}`,
        method: 'PUT',
        body: rest,
      }),
      invalidatesTags: (result, error, { id }) => [
        'Product',
        'StoreProducts',
        { type: 'Product', id }
      ],
    }),

    // Delete product
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/product/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product', 'StoreProducts'],
    }),

    // Get stores by owner ID
    getStoresByOwner: builder.query({
      query: (ownerId) => `/store/owner/${ownerId}`,
      transformResponse: (response) => ({
        stores: response.results,
        totalResults: response.totalResults,
      }),
    }),

    // Search products by name
    searchProducts: builder.query({
      query: (searchTerm) => `/product?name=${encodeURIComponent(searchTerm)}`,
      transformResponse: (response) => ({
        products: response.results,
        totalResults: response.totalResults,
      }),
    }),

    // Get products with pagination and filters
    getProductsWithFilters: builder.query({
      query: ({ page = 1, limit = 10, filters = {} }) => {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);
        
        // Add optional filters
        if (filters.category) params.append('category', filters.category);
        if (filters.inStock !== undefined) params.append('inStock', filters.inStock);
        if (filters.name) params.append('name', filters.name);
        if (filters.store) params.append('store', filters.store);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);

        return `/product?${params.toString()}`;
      },
      transformResponse: (response) => ({
        products: response.results,
        totalResults: response.totalResults,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      }),
      providesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductsByStoreQuery,
  useGetProductsByOwnerQuery,
  useGetProductsByOwnerWithFiltersQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetStoresByOwnerQuery,
  useSearchProductsQuery,
  useGetProductsWithFiltersQuery,
} = productApiSlice;