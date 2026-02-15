import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { clearCart } from '../features/cart/cartSlice'
import api from '../services/api'

const CheckoutPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { cartItems } = useSelector((state) => state.cart)
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [country, setCountry] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)

    const handlePlaceOrder = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // 1. Create Order
            const orderData = {
                items: cartItems.map(item => ({
                    product_id: item.product_id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image
                })),
                shipping_info: {
                    address,
                    city,
                    postalCode,
                    country
                }
            }

            const { data: order } = await api.post('/orders/', orderData)

            // 2. Create Stripe Session
            const { data: session } = await api.post(`/orders/${order._id}/checkout-session`)

            // Redirect to Stripe
            window.location.href = session.url

            // Optionally clear cart here, or wait for success webhook/redirect
            // dispatch(clearCart()) 

        } catch (error) {
            toast.error(error.message || 'Something went wrong')
            setIsLoading(false)
        }
    }

    if (cartItems.length === 0) {
        return <div className="text-center mt-20">Your cart is empty</div>
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                    <form onSubmit={handlePlaceOrder} className="space-y-4">
                        <div>
                            <label className="block mb-1">Address</label>
                            <input
                                type="text"
                                required
                                className="w-full border rounded px-3 py-2"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block mb-1">City</label>
                            <input
                                type="text"
                                required
                                className="w-full border rounded px-3 py-2"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Postal Code</label>
                            <input
                                type="text"
                                required
                                className="w-full border rounded px-3 py-2"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Country</label>
                            <input
                                type="text"
                                required
                                className="w-full border rounded px-3 py-2"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full mt-4"
                        >
                            {isLoading ? 'Processing...' : `Pay $${total}`}
                        </button>
                    </form>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                    <div className="bg-gray-100 p-6 rounded-lg">
                        {cartItems.map((item) => (
                            <div key={item.product_id} className="flex justify-between mb-2">
                                <span>{item.name} x {item.quantity}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>${total}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckoutPage
