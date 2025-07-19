import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  type ShippingAddress,
  type CartItem,
  type CartState,
} from "../../types/ordersApiSliceTypes";

const initialState: CartState =
  localStorage.getItem("cart") !== null
    ? JSON.parse(localStorage.getItem("cart") as string)
    : {
        cartItems: [],
        itemsPrice: 0,
        shippingPrice: 0,
        totalPrice: 0,
        shippingAddress: {},
        paymentMethod: "Наличный расчет",
      };

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

      state.itemsPrice = state.cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      state.shippingPrice = state.itemsPrice > 1000 ? 0 : 100;

      state.totalPrice = Number(state.itemsPrice) + Number(state.shippingPrice);
      localStorage.setItem("cart", JSON.stringify(state));
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.cartItems = state.cartItems.filter((x) => x.id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state));
    },
    saveShippingAddress(state, action: PayloadAction<ShippingAddress>) {
      state.shippingAddress = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },
    savePaymentMethod(state, action: PayloadAction<string>) {
      state.paymentMethod = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },
    clearCartItems(state) {
      state.cartItems = [];
      localStorage.setItem("cart", JSON.stringify(state));
    },
    resetCart() {
      return initialState;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
