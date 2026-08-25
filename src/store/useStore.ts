import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '../types';

interface StoreState {
  cart: CartItem[];
  favorites: Product[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: string) => boolean;
  cartTotalItems: () => number;
  isCartOpen: boolean;
  setCartOpen: (isOpen: boolean) => void;
  language: "ES" | "EN" | "PT" | "ZH";
  setLanguage: (lang: "ES" | "EN" | "PT" | "ZH") => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      favorites: [],
      isCartOpen: false,
      language: "ES",
      
      setLanguage: (lang) => set({ language: lang }),
      
      addToCart: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.cart.find((item) => item.product.id === product.id);
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { product, quantity }] };
        });
      },
      
      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        }));
      },
      
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },
      
      clearCart: () => set({ cart: [] }),
      
      toggleFavorite: (product) => {
        set((state) => {
          const exists = state.favorites.some((p) => p.id === product.id);
          if (exists) {
            return {
              favorites: state.favorites.filter((p) => p.id !== product.id),
            };
          }
          return { favorites: [...state.favorites, product] };
        });
      },
      
      isFavorite: (productId) => {
        return get().favorites.some((p) => p.id === productId);
      },
      
      cartTotalItems: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0);
      },
      
      setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
    }),
    {
      name: 'prodelec-storage',
      partialize: (state) => ({ cart: state.cart, favorites: state.favorites, language: state.language }),
    }
  )
);
