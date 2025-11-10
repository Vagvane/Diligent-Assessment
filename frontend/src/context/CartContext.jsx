import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

const CartContext = createContext(undefined);
const STORAGE_KEY = 'shopsphere.cart';

const initialState = {
  items: []
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE': {
      if (Array.isArray(action.payload?.items)) {
        return { items: action.payload.items };
      }
      return state;
    }
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      if (!product) return state;

      const id = product._id || product.id || product.slug;
      if (!id) return state;

      const mergedQuantity = Math.max(1, Number(quantity) || 1);
      const existing = state.items.find((item) => item.id === id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.min(999, item.quantity + mergedQuantity) }
              : item
          )
        };
      }

      return {
        items: [
          ...state.items,
          {
            id,
            name: product.name,
            price: product.price ?? 0,
            image: product.images?.[0] || product.image,
            quantity: Math.min(999, mergedQuantity),
            currency: product.currency || 'USD'
          }
        ]
      };
    }
    case 'REMOVE_ITEM': {
      const id = action.payload;
      return {
        items: state.items.filter((item) => item.id !== id)
      };
    }
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      const nextQuantity = Math.max(1, Number(quantity) || 1);
      return {
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity: Math.min(999, nextQuantity) } : item
        )
      };
    }
    case 'CLEAR_CART':
      return initialState;
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        dispatch({ type: 'HYDRATE', payload: parsed });
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: state.items }));
    } catch {
      // storage may be unavailable
    }
  }, [state.items]);

  const value = useMemo(() => {
    const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      items: state.items,
      totalItems,
      subtotal,
      addToCart: (product, quantity = 1) =>
        dispatch({ type: 'ADD_ITEM', payload: { product, quantity } }),
      removeFromCart: (id) => dispatch({ type: 'REMOVE_ITEM', payload: id }),
      updateQuantity: (id, quantity) =>
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } }),
      clearCart: () => dispatch({ type: 'CLEAR_CART' })
    };
  }, [state.items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Example: remove the next line if not needed, kept to illustrate optional exports
export default CartContext;

