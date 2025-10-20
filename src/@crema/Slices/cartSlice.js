import { createSlice } from '@reduxjs/toolkit';

// Function to get cart from local storage
const getCartFromLocalStorage = () => {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : { items: [], totalQuantity: 0, totalPrice: 0 };
};

// Function to save cart to local storage
const saveCartToLocalStorage = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

// Utility function to recalculate totals
const recalculateTotals = (state) => {
  state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
  state.totalPrice = state.items.reduce((total, item) => total + item.totalPrice, 0);
  saveCartToLocalStorage(state);
};

// Define the initial state of the cart, fetched from local storage
const initialState = getCartFromLocalStorage();

// Create the cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart(state, action) {
      const newItem = action.payload;
      console.log('Adding item to cart:', newItem);

      // Validate price and quantity
      const price = isNaN(newItem.price) || newItem.price <= 0 ? 0 : newItem.price;
      const quantity = isNaN(newItem.quantity) || newItem.quantity <= 0 ? 1 : newItem.quantity;
      
      // Get stock quantity from the variant
      const stockQuantity = newItem.stockQuantity || 0;

      // Validate store information
      const storeInfo = {
        storeId: newItem.storeId || newItem.store?.id,
        storeName: newItem.store?.storeName || newItem.store?.name,
        storeLocation: newItem.store?.storeLocation || newItem.store?.location,
        deliveryRadius: newItem.store?.deliveryRadius || 10
      };

      if (price <= 0) {
        console.warn(`Item ${newItem.sku} has no valid price, cannot add to cart.`);
        return;
      }

      // Check if storeId is present
      if (!storeInfo.storeId) {
        console.warn(`Item ${newItem.sku} has no store information, cannot add to cart.`);
        return;
      }

      const existingItem = state.items.find(
        (item) => item.id === newItem.id && item.variantId === newItem.variantId && item.storeId === storeInfo.storeId
      );

      if (!existingItem) {
        // Check if requested quantity exceeds stock
        const finalQuantity = Math.min(quantity, stockQuantity);
        
        if (finalQuantity <= 0) {
          console.warn(`Item ${newItem.sku} is out of stock.`);
          return;
        }
        
        if (finalQuantity < quantity) {
          console.warn(`Only ${finalQuantity} items available for ${newItem.sku}. Added maximum available.`);
        }
        
        state.items.push({
          ...newItem,
          quantity: finalQuantity,
          discount: newItem.discount,
          totalPrice: price * finalQuantity,
          price,
          stockQuantity, // Store stock information in cart item
          // Store information
          storeId: storeInfo.storeId,
          storeName: storeInfo.storeName,
          storeLocation: storeInfo.storeLocation,
          deliveryRadius: storeInfo.deliveryRadius
        });
      } else {
        // Check if increasing would exceed stock
        const potentialNewQuantity = existingItem.quantity + quantity;
        
        if (potentialNewQuantity <= stockQuantity) {
          existingItem.quantity = potentialNewQuantity;
        } else {
          // Set to maximum available
          if (existingItem.quantity < stockQuantity) {
            console.warn(`Only ${stockQuantity} items available for ${newItem.sku}. Added maximum available.`);
            existingItem.quantity = stockQuantity;
          } else {
            console.warn(`Maximum stock of ${stockQuantity} already in cart for ${newItem.sku}.`);
            return; // No change needed, already at max
          }
        }
        
        existingItem.totalPrice = existingItem.price * existingItem.quantity;
      }

      recalculateTotals(state);
    },

    decreaseItemQuantity(state, action) {
      const { id, variantId, storeId } = action.payload;
      const existingItem = state.items.find(item => 
        item.id === id && item.variantId === variantId && item.storeId === storeId
      );

      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
          existingItem.totalPrice = existingItem.price * existingItem.quantity;
        } else {
          state.items = state.items.filter(item => 
            !(item.id === id && item.variantId === variantId && item.storeId === storeId)
          );
        }

        recalculateTotals(state);
      }
    },

    increaseItemQuantity(state, action) {
      const { id, variantId, storeId } = action.payload;
      const existingItem = state.items.find(item => 
        item.id === id && item.variantId === variantId && item.storeId === storeId
      );

      if (existingItem) {
        // Check if increasing would exceed stock
        if (existingItem.quantity < existingItem.stockQuantity) {
          existingItem.quantity += 1;
          existingItem.totalPrice = existingItem.price * existingItem.quantity;
          recalculateTotals(state);
        } else {
          console.warn(`Cannot add more of this item. Maximum stock of ${existingItem.stockQuantity} already in cart.`);
        }
      }
    },

    removeItemFromCart(state, action) {
      const { id, variantId, storeId } = action.payload;

      state.items = state.items.filter(item => 
        !(item.id === id && item.variantId === variantId && item.storeId === storeId)
      );

      recalculateTotals(state);
    },

    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;

      saveCartToLocalStorage(state);
    },

    getCartItems(state) {
      const storedCart = getCartFromLocalStorage();
      state.items = storedCart.items;
      state.totalQuantity = storedCart.totalQuantity;
      state.totalPrice = storedCart.totalPrice;
    },
    
    // New action to update stock quantity if it changes in the backend
    updateItemStock(state, action) {
      const { id, variantId, storeId, stockQuantity } = action.payload;
      const existingItem = state.items.find(item => 
        item.id === id && item.variantId === variantId && item.storeId === storeId
      );
      
      if (existingItem) {
        existingItem.stockQuantity = stockQuantity;
        
        // If current quantity exceeds new stock, adjust down
        if (existingItem.quantity > stockQuantity) {
          existingItem.quantity = stockQuantity;
          existingItem.totalPrice = existingItem.price * existingItem.quantity;
          recalculateTotals(state);
          console.warn(`Quantity adjusted to ${stockQuantity} due to stock update.`);
        }
      }
    },

    // New action to get store information from cart
    getCartStoreInfo(state) {
      if (state.items.length === 0) {
        return null;
      }
      
      // Get unique stores from cart items
      const stores = {};
      state.items.forEach(item => {
        if (item.storeId) {
          stores[item.storeId] = {
            storeId: item.storeId,
            storeName: item.storeName,
            storeLocation: item.storeLocation,
            deliveryRadius: item.deliveryRadius
          };
        }
      });
      
      return Object.values(stores);
    }
  },
});

// Export the cart actions
export const {
  getCartItems,
  addItemToCart,
  decreaseItemQuantity,
  removeItemFromCart,
  clearCart,
  increaseItemQuantity,
  updateItemStock,
  getCartStoreInfo,
} = cartSlice.actions;

// Export the cart reducer
export default cartSlice.reducer;