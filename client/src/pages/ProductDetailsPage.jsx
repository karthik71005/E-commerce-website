import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate, Link } from 'react-router-dom'

import { getProduct, reset } from '../features/products/productSlice'
import { addToCart } from '../features/cart/cartSlice'
import { toast } from 'react-toastify'

const ProductDetailsPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [qty, setQty] = useState(1)

    const { product, isLoading, isError, message } = useSelector(
        (state) => state.products
    )

    useEffect(() => {
        if (isError) {
            toast.error(message)
        }
        dispatch(getProduct(id))

        return () => {
            dispatch(reset())
        }
    }, [dispatch, id, isError, message])

    const handleAddToCart = () => {
        if (product) {
            dispatch(addToCart({
                product_id: product._id,
                name: product.name,
                price: product.price,
                image: product.images.length > 0 ? product.images[0] : '',
                stock: product.stock,
                quantity: Number(qty)
            }))
            toast.success('Added to cart')
            navigate('/cart')
        }
    }

    if (isLoading) {
        return <div className="text-center mt-20">Loading product details...</div>
    }

    if (!product) {
        return <div className="text-center mt-20">Product not found</div>
    }

    return (
        <div className="max-w-6xl mx-auto">
            <Link to="/products" className="btn-secondary inline-block mb-6">
                &larr; Back to Products
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <img
                        src={product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/600'}
                        alt={product.name}
                        className="w-full h-auto rounded-lg object-cover"
                    />
                </div>

                <div className="space-y-6">
                    <h1 className="text-3xl font-bold">{product.name}</h1>
                    <p className="text-2xl font-bold text-primary">${product.price}</p>
                    <p className="text-gray-600 leading-relaxed">{product.description}</p>

                    <div className="border-t border-b py-4">
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-semibold">Status:</span>
                            <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                                {product.stock > 0 ? "In Stock" : "Out of Stock"}
                            </span>
                        </div>

                        {product.stock > 0 && (
                            <div className="flex items-center justify-between">
                                <span className="font-semibold">Quantity:</span>
                                <select
                                    value={qty}
                                    onChange={(e) => setQty(e.target.value)}
                                    className="border rounded px-2 py-1"
                                >
                                    {[...Array(product.stock).keys()].slice(0, 10).map((x) => (
                                        <option key={x + 1} value={x + 1}>
                                            {x + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className={`w-full py-3 rounded-lg font-bold text-white transition ${product.stock > 0 ? 'bg-primary hover:bg-opacity-90' : 'bg-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductDetailsPage
