import { PRODUCTS_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";
import {
  type Product,
  type ProductRequest,
  type ReviewRequest,
  type ProductsResponse,
  type CategoryResponse,
  type ProductFilter,
  type UploadProductImage,
} from "../../types/ordersApiSliceTypes";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, ProductFilter>({
      query: ({ keyword, pageNumber, category, price, rating, sort }) => ({
        url: PRODUCTS_URL,
        params: { keyword, pageNumber, category, price, rating, sort },
      }),
      keepUnusedDataFor: 5,
    }),
    getCategories: builder.query<CategoryResponse[], void>({
      query: () => ({
        url: `${PRODUCTS_URL}/categories`,
      }),
    }),
    getProductDetails: builder.query<Product, string>({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 7,
    }),
    createProduct: builder.mutation<{ message: string }, ProductRequest>({
      query: (data) => ({
        url: PRODUCTS_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation<Product, ProductRequest>({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    uploadProductImage: builder.mutation<UploadProductImage, FormData>({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    deleteProduct: builder.mutation<{ message: string }, string>({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: "DELETE",
      }),
    }),
    createReview: builder.mutation<{ message: string }, ReviewRequest>({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.id}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetCategoriesQuery,
} = productsApiSlice;
