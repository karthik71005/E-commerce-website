import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { ShoppingCart, User, Menu, X, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { logout, reset } from '../../features/auth/authSlice'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const dispatch = useDispatch()
    const location = useLocation()
    const { user } = useSelector((state) => state.auth)
    const { cartItems } = useSelector((state) => state.cart)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false)
    }, [location])

    const onLogout = () => {
        dispatch(logout())
        dispatch(reset())
    }

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/products' },
    ]

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 py-3'
                    : 'bg-transparent py-5'
            }`}
        >
            <div className="container mx-auto px-4 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl font-serif font-bold tracking-tight text-primary">
                    ShopEase<span className="text-accent">.</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`text-sm font-medium transition-colors hover:text-accent ${
                                location.pathname === link.path ? 'text-primary font-semibold' : 'text-secondary'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Icons & Actions */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link to="/cart" className="relative text-secondary hover:text-primary transition-colors">
                        <ShoppingCart size={22} />
                        {cartItems.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <div className="flex items-center space-x-4">
                            <Link to="/profile" className="text-secondary hover:text-primary transition-colors" title="Profile">
                                <User size={22} />
                            </Link>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="text-xs font-bold uppercase tracking-wider text-primary hover:text-accent border border-primary px-2 py-1 rounded">
                                    Admin
                                </Link>
                            )}
                            <button onClick={onLogout} className="text-secondary hover:text-red-500 transition-colors" title="Logout">
                                <LogOut size={22} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                             <Link to="/login" className="text-sm font-medium text-secondary hover:text-primary">
                                Login
                            </Link>
                            <Link to="/register" className="bg-primary text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-slate-800 transition-all shadow-lg shadow-primary/20">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-primary focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
                    >
                        <div className="container mx-auto px-4 py-6 flex flex-col space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="text-lg font-medium text-secondary hover:text-primary"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <hr className="border-gray-100" />
                            <Link to="/cart" className="flex items-center space-x-2 text-secondary hover:text-primary">
                                <ShoppingCart size={20} />
                                <span>Cart ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</span>
                            </Link>
                            {user ? (
                                <>
                                    <Link to="/profile" className="flex items-center space-x-2 text-secondary hover:text-primary">
                                        <User size={20} />
                                        <span>My Profile</span>
                                    </Link>
                                    {user.role === 'admin' && (
                                        <Link to="/admin" className="text-primary font-semibold">
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <button onClick={onLogout} className="flex items-center space-x-2 text-left text-red-500 hover:text-red-600">
                                        <LogOut size={20} />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col space-y-3 pt-2">
                                    <Link to="/login" className="text-center w-full py-2 text-secondary border border-gray-200 rounded-lg">
                                        Login
                                    </Link>
                                    <Link to="/register" className="text-center w-full py-2 bg-primary text-white rounded-lg shadow-lg shadow-primary/20">
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}

export default Navbar
