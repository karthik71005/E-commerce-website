import { createSlice } from '@reduxjs/toolkit'

const cartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []

const initialState = {
    cartItems: cartItems,
    shippingInfo: localStorage.getItem('shippingInfo') ? JSON.parse(localStorage.getItem('shippingInfo')) : {},
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload
            const existItem = state.cartItems.find((x) => x.product_id === item.product_id)

            if (existItem) {
                state.cartItems = state.cartItems.map((x) =>
                    x.product_id === existItem.product_id ? item : x
                )
            } else {
                state.cartItems = [...state.cartItems, item]
            }
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((x) => x.product_id !== action.payload)
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
        },
        saveShippingInfo: (state, action) => {
            state.shippingInfo = action.payload
            localStorage.setItem('shippingInfo', JSON.stringify(state.shippingInfo))
        },
        clearCart: (state) => {
            state.cartItems = []
            localStorage.removeItem('cartItems')
        },
    },
})

export const { addToCart, removeFromCart, saveShippingInfo, clearCart } = cartSlice.actions
export default cartSlice.reducer
