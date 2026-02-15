import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { getProducts, reset } from '../features/products/productSlice'

const ProductPage = () => {
    const dispatch = useDispatch()
    const { products, isLoading, isError, message } = useSelector(
        (state) => state.products
    )

    useEffect(() => {
        if (isError) {
            console.error(message)
        }
    }, [isError, message])

    useEffect(() => {
        dispatch(getProducts())

        return () => {
            dispatch(reset())
        }
    }, [dispatch])

    if (isLoading) {
        return <div className="text-center mt-20">Loading products...</div>
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Latest Products</h1>

            {products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                            <Link to={`/products/${product._id}`}>
                                <img
                                    src={product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/300'}
                                    alt={product.name}
                                    className="w-full h-48 object-cover"
                                />
                            </Link>
                            <div className="p-4">
                                <Link to={`/products/${product._id}`}>
                                    <h2 className="text-lg font-semibold mb-2 hover:text-primary truncate">{product.name}</h2>
                                </Link>
                                <p className="text-gray-600 mb-2 truncate">{product.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold">Rs.{product.price}</span>
                                    <Link to={`/products/${product._id}`} className="text-primary hover:underline font-medium">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ProductPage
