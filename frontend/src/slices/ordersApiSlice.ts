import { ORDERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";
import {
  type Order,
  type OrdersResponse,
  type OrderRequest,
  type OrderResponse,
} from "../../types/ordersApiSliceTypes";

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<Order, OrderRequest>({
      query: (order) => ({
        url: ORDERS_URL,
        method: "POST",
        body: order,
      }),
    }),
    getOrderDetails: builder.query<Order, string>({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
      }),
      keepUnusedDataFor: 7,
    }),
    payOrder: builder.mutation<Order, OrderResponse>({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/paid`,
        method: "PUT",
        body: details,
      }),
    }),
    getMyOrders: builder.query<OrdersResponse, { pageNumber: number }>({
      query: ({ pageNumber }) => ({
        url: `${ORDERS_URL}/myorders`,
        params: { pageNumber },
      }),
      keepUnusedDataFor: 7,
    }),
    getOrders: builder.query<OrdersResponse, { pageNumber: number }>({
      query: ({ pageNumber }) => ({
        url: ORDERS_URL,
        params: { pageNumber },
      }),
      keepUnusedDataFor: 7,
    }),
    deliverOrder: builder.mutation<Order, string>({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/delivered`,
        method: "PUT",
      }),
    }),
    // getSberClientId: builder.query({
    //   query: () => ({
    //     url: SBER_URL,
    //   }),
    //   keepUnusedDataFor: 7
    // }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useDeliverOrderMutation,
} = ordersApiSlice;
