// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import { productApiSlice } from '@crema/Slices/productsSlice';
import { orderApiSlice } from '@crema/Slices/orderSlice';
import { addressApiSlice } from '@crema/Slices/addressSlice';
import { customizationApiSlice } from '@crema/Slices/customizationApiSlice';
import { cancellationReasonApiSlice } from '@crema/Slices/cancellationReasonApiSlice';

import { productVariantApiSlice } from '@crema/Slices/productVariantSlice';
import cartReducer from '@crema/Slices/cartSlice'; // Adjust the import
import wishlistReducer from '../src/@crema/Slices/wishlistSlice';



export const store = configureStore({
  reducer: {
    [productApiSlice.reducerPath]: productApiSlice.reducer,
    [customizationApiSlice.reducerPath]: customizationApiSlice.reducer,
    [orderApiSlice.reducerPath]: orderApiSlice.reducer,
    [addressApiSlice.reducerPath]: addressApiSlice.reducer,
    [productVariantApiSlice.reducerPath]: productVariantApiSlice.reducer,
    [cancellationReasonApiSlice.reducerPath]: cancellationReasonApiSlice.reducer,
    cart: cartReducer, // Use cartReducer directly for the cart slice
    wishlist: wishlistReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productApiSlice.middleware,
      orderApiSlice.middleware,
      addressApiSlice.middleware,
      productVariantApiSlice.middleware,
      customizationApiSlice.middleware,
      cancellationReasonApiSlice.middleware,
    ),
  devTools: process.env.NODE_ENV !== 'production',
});
