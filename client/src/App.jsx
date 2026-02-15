import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProductPage from './pages/ProductPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import ProfilePage from './pages/ProfilePage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import ProtectedRoute from './components/protected/ProtectedRoute'
import AdminRoute from './components/protected/AdminRoute'

function App() {
    return (
        <>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<HomePage />} />
                        <Route path="login" element={<LoginPage />} />
                        <Route path="register" element={<RegisterPage />} />
                        <Route path="products" element={<ProductPage />} />
                        <Route path="products/:id" element={<ProductDetailsPage />} />
                        <Route path="cart" element={<CartPage />} />

                        {/* Protected Routes */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="checkout" element={<CheckoutPage />} />
                            <Route path="profile" element={<ProfilePage />} />
                        </Route>

                        {/* Admin Routes */}
                        <Route element={<AdminRoute />}>
                            <Route path="admin" element={<AdminDashboardPage />} />
                        </Route>
                    </Route>
                </Routes>
            </Router>
            <ToastContainer position="bottom-right" />
        </>
    )
}

export default App
