import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { product } from 'types/product.type'

export const productApi = createApi({
  reducerPath: 'productApi',
  tagTypes: ['product'],
  // keepUnusedDataFor: 100,
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API }),
  refetchOnReconnect: true,
  endpoints: (build) => ({
    getProduct: build.query<product[], void>({
      query: () => 'products',
      // keepUnusedDataFor: 100,
      providesTags: (result) => {
        if (result) {
          const response = [
            ...result?.map(({ _id }) => ({ type: 'product' as const, _id })),
            { type: 'product' as const, _id: 'LIST' }
          ]
          return response
        }

        return [{ type: 'product' as const, _id: 'LIST' }]
      }
    }),
    addProduct: build.mutation<product, Omit<product, '_id'>>({
      query: (body) => {
        return {
          url: 'products',
          method: 'POST',
          body
        }
      },
      invalidatesTags: (result, error, body) => (error ? [] : [{ type: 'product' as const, _id: 'LIST' }])
    }),
    updateProduct: build.mutation<product, { body: Omit<product, '_id'>; _id: string }>({
      query: (data) => {
        return {
          url: `products/${data._id}`,
          method: 'PUT',
          body: data.body
        }
      },
      invalidatesTags: (result, error, data) => (error ? [] : [{ type: 'product' as const, _id: data._id }])
    }),
    deleteProduct: build.mutation<{}, string>({
      query: (id) => {
        return {
          url: `products/${id}`,
          method: 'DELETE'
        }
      },
      invalidatesTags: (result, error, body) => [{ type: 'product' as const, _id: body }]
    }),
    getOneProduct: build.query<product, string | void>({
      query: (id) => `products/${id}`
    })
  })
})

export const {
  useGetProductQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetOneProductQuery
} = productApi
