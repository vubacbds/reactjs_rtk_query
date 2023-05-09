import { product } from 'types/product.type'
import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import http from 'utils/http'

interface productState {
  productUpdate: product | null
}
const initalState: productState = {
  productUpdate: null
}

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>

type PendingAction = ReturnType<GenericAsyncThunk['pending']>
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>

const productSlice = createSlice({
  name: 'product',
  initialState: initalState,
  reducers: {
    startUpdateProduct: (state, action: PayloadAction<product>) => {
      state.productUpdate = action.payload
    },
    cancelUpdateProduct: (state) => {
      state.productUpdate = null
    }
  }
})

export const { startUpdateProduct, cancelUpdateProduct } = productSlice.actions
const productReducer = productSlice.reducer
export default productReducer
