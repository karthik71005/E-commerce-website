import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { removeFromCart, clearCart } from '../features/cart/cartSlice'
import { Trash2 } from 'lucide-react'

const CartPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { cartItems } = useSelector((state) => state.cart)
    const { user } = useSelector((state) => state.auth)

    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)

    const handleCheckout = () => {
        if (user) {
            navigate('/checkout')
        } else {
            navigate('/login')
        }
    }

    if (cartItems.length === 0) {
        return (
            <div className="text-center mt-20">
                <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
                <Link to="/products" className="text-primary hover:underline">
                    Go Shopping
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left">Product</th>
                            <th className="px-6 py-3 text-left">Price</th>
                            <th className="px-6 py-3 text-left">Quantity</th>
                            <th className="px-6 py-3 text-left">Total</th>
                            <th className="px-6 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map((item) => (
                            <tr key={item.product_id} className="border-b">
                                <td className="px-6 py-4 flex items-center">
                                    <img src={item.image || 'https://via.placeholder.com/50'} alt={item.name} className="w-12 h-12 object-cover rounded mr-4" />
                                    <span>{item.name}</span>
                                </td>
                                <td className="px-6 py-4">${item.price}</td>
                                <td className="px-6 py-4">{item.quantity}</td>
                                <td className="px-6 py-4">${(item.price * item.quantity).toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <button onClick={() => dispatch(removeFromCart(item.product_id))} className="text-red-500 hover:text-red-700">
                                        <Trash2 size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-8 flex justify-between items-center">
                <button onClick={() => dispatch(clearCart())} className="text-gray-600 hover:text-red-500">
                    Clear Cart
                </button>
                <div className="text-right">
                    <h2 className="text-2xl font-bold mb-4">Total: ${total}</h2>
                    <button onClick={handleCheckout} className="btn-primary">
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CartPage
