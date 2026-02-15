import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../../features/auth/authSlice'
import { ShoppingCart, LogOut, User, Menu } from 'lucide-react'
import { useState } from 'react'

const Header = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const { cartItems } = useSelector((state) => state.cart)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const onLogout = () => {
        dispatch(logout())
        dispatch(reset())
        navigate('/')
    }

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-primary">ShopEase</Link>

                <nav className="hidden md:flex items-center space-x-6">
                    <Link to="/products" className="text-gray-600 hover:text-primary">Products</Link>

                    <Link to="/cart" className="relative text-gray-600 hover:text-primary">
                        <ShoppingCart size={24} />
                        {cartItems.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {cartItems.length}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <div className="flex items-center space-x-4">
                            <Link to="/profile" className="flex items-center text-gray-600 hover:text-primary">
                                <User size={20} className="mr-1" />
                                <span>{user.name}</span>
                            </Link>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="text-gray-600 hover:text-primary">Admin</Link>
                            )}
                            <button onClick={onLogout} className="flex items-center text-gray-600 hover:text-red-500">
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="flex items-center text-gray-600 hover:text-primary">
                                <User size={20} className="mr-1" /> Login
                            </Link>
                            <Link to="/register" className="btn-primary">Register</Link>
                        </>
                    )}
                </nav>

                {/* Mobile Menu Button */}
                <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <Menu />
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white px-4 py-2 border-t">
                    <Link to="/products" className="block py-2">Products</Link>
                    <Link to="/cart" className="block py-2">Cart ({cartItems.length})</Link>
                    {user ? (
                        <>
                            <Link to="/profile" className="block py-2">Profile</Link>
                            {user.role === 'admin' && <Link to="/admin" className="block py-2">Admin Dashboard</Link>}
                            <button onClick={onLogout} className="block w-full text-left py-2 text-red-500">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="block py-2">Login</Link>
                            <Link to="/register" className="block py-2">Register</Link>
                        </>
                    )}
                </div>
            )}
        </header>
    )
}

export default Header
