import { createSlice } from '@reduxjs/toolkit';

// Function to get wishlist from local storage
const getWishlistFromLocalStorage = () => {
  const wishlist = localStorage.getItem('wishlist');
  return wishlist ? JSON.parse(wishlist) : { items: [] };
};

// Function to save wishlist to local storage
const saveWishlistToLocalStorage = (wishlist) => {
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
};

// Define the initial state of the wishlist, fetched from local storage
const initialState = getWishlistFromLocalStorage();

// Create the wishlist slice
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addItemToWishlist: (state, action) => {
      // Check if the item already exists in the wishlist
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      
      if (!existingItem) {
        state.items.push(action.payload); // Add the item if it doesn't exist
      }

      saveWishlistToLocalStorage(state); // Save updated wishlist to local storage
    },
    
    removeItemFromWishlist: (state, action) => {
      // Remove the item by id from the wishlist
      state.items = state.items.filter((item) => item.id !== action.payload.id);
      
      saveWishlistToLocalStorage(state); // Save updated wishlist to local storage
    },
    
    clearWishlist: (state) => {
      state.items = [];
      saveWishlistToLocalStorage(state); // Save updated wishlist to local storage
    },
  },
});

export const { addItemToWishlist, removeItemFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
