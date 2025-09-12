import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: JSON.parse(localStorage.getItem('cart')) || [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    getCartItems: (state) => {
      const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
      state.items = storedCart;
    },
    addItemToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...newItem, quantity: 1 });
      }

      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    decreaseItemQuantity: (state, action) => {
     
      const id = action.payload.id;
    
      const existingItem = state.items.find(item => item.id === id);

      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
        } else {
          state.items = state.items.filter(item => item.id !== id);
        }
        localStorage.setItem('cart', JSON.stringify(state.items));
      }
    },
    updateCartItem: (state, action) => {
      const { id, ...rest } = action.payload;
      const index = state.items.findIndex(item => item.id === id);
      if (index !== -1) {
        state.items[index] = { id, ...rest };
        localStorage.setItem('cart', JSON.stringify(state.items));
      }
    },
    removeItemFromCart: (state, action) => {
      const id = action.payload.id;
      state.items = state.items.filter(item => item.id !== id);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cart');
    },
  },
});

export const {
  getCartItems,
  addItemToCart,
  decreaseItemQuantity,
  updateCartItem,
  removeItemFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
