import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../services/api'
import { toast } from 'react-toastify'
import { Package } from 'lucide-react'

const ProfilePage = () => {
    const { user } = useSelector((state) => state.auth)
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders/my-orders')
                setOrders(data)
            } catch (error) {
                toast.error('Failed to fetch orders')
            } finally {
                setIsLoading(false)
            }
        }

        if (user) {
            fetchOrders()
        }
    }, [user])

    if (!user) {
        return <p>Please login first</p>
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>

            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <h2 className="text-xl font-semibold mb-4">Account Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <span className="text-gray-600 block">Name:</span>
                        <span className="font-medium">{user.name}</span>
                    </div>
                    <div>
                        <span className="text-gray-600 block">Email:</span>
                        <span className="font-medium">{user.email}</span>
                    </div>
                    <div>
                        <span className="text-gray-600 block">Role:</span>
                        <span className="font-medium capitalize">{user.role}</span>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-4">Order History</h2>
            {isLoading ? (
                <p>Loading orders...</p>
            ) : orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white p-6 rounded-lg shadow-sm border">
                            <div className="flex justify-between items-center mb-4 border-b pb-2">
                                <div>
                                    <p className="font-bold">Order ID: <span className="text-gray-500 font-normal text-sm">{order._id}</span></p>
                                    <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">${order.total_price.toFixed(2)}</p>
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${order.order_status === 'paid' || order.order_status === 'delivered'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {order.order_status.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex items-center">
                                        <Package size={16} className="mr-2 text-gray-400" />
                                        <span className="flex-grow">{item.name}</span>
                                        <span className="text-gray-600">x{item.quantity}</span>
                                        <span className="ml-4 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ProfilePage
