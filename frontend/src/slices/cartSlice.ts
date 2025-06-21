import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Product } from "../../types/index";

export type CartItem = Product & {
  quantity: number;
};

type CartState = {
  cartItems: CartItem[];
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
};

const initialState: CartState =
  localStorage.getItem("cart") !== null
    ? JSON.parse(localStorage.getItem("cart") as string)
    : { cartItems: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;

      const existItem = state.cartItems.find((x) => x.id === item.id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.id === existItem.id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      // Рассчитать цену товаров
      state.itemsPrice = state.cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      // Рассчитать цену доставки товаров
      state.shippingPrice = state.itemsPrice > 1000 ? 0 : 100;

      // Рассчитать общую цену на товары
      state.totalPrice = Number(state.itemsPrice) + Number(state.shippingPrice);
      localStorage.setItem("cart", JSON.stringify(state));
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.cartItems = state.cartItems.filter((x) => x.id !== action.payload);

      localStorage.setItem("cart", JSON.stringify(state));
    },
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;

export default cartSlice.reducer;
