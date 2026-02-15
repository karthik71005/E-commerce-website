import { useState, useEffect } from 'react'
import api from '../services/api'
import { toast } from 'react-toastify'
import { Plus, Trash2, Edit } from 'lucide-react'

const AdminDashboardPage = () => {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [editId, setEditId] = useState(null)

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        stock: '',
        image: ''
    })

    // Fetch Products
    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products/?limit=100')
            setProducts(data)
        } catch (error) {
            toast.error('Failed to fetch products')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const productData = { ...formData, price: Number(formData.price), stock: Number(formData.stock), images: [formData.image] }

            if (isEditing) {
                await api.put(`/products/${editId}`, productData)
                toast.success('Product updated successfully')
            } else {
                await api.post('/products/', productData)
                toast.success('Product created successfully')
            }

            // Reset Form
            setFormData({ name: '', price: '', description: '', category: '', stock: '', image: '' })
            setIsEditing(false)
            setEditId(null)
            fetchProducts()

        } catch (error) {
            toast.error('Operation failed')
        }
    }

    const handleEdit = (product) => {
        setIsEditing(true)
        setEditId(product._id)
        setFormData({
            name: product.name,
            price: product.price,
            description: product.description,
            category: product.category,
            stock: product.stock,
            image: product.images[0] || ''
        })
    }

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`)
                toast.success('Product deleted')
                fetchProducts()
            } catch (error) {
                toast.error('Failed to delete product')
            }
        }
    }

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Product Form */}
                <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-sm h-fit sticky top-4">
                    <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Product' : 'Create Product'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Price</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Stock</label>
                            <input type="number" name="stock" value={formData.stock} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <input type="text" name="category" value={formData.category} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Image URL</label>
                            <input type="text" name="image" value={formData.image} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="https://..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} required className="w-full border rounded px-3 py-2" rows="3"></textarea>
                        </div>

                        <button type="submit" className="w-full btn-primary flex justify-center items-center">
                            {isEditing ? <Edit size={16} className="mr-2" /> : <Plus size={16} className="mr-2" />}
                            {isEditing ? 'Update Product' : 'Create Product'}
                        </button>

                        {isEditing && (
                            <button type="button" onClick={() => { setIsEditing(false); setFormData({ name: '', price: '', description: '', category: '', stock: '', image: '' }) }} className="w-full text-gray-500 mt-2">
                                Cancel
                            </button>
                        )}
                    </form>
                </div>

                {/* Product List */}
                <div className="md:col-span-2 space-y-4">
                    <h2 className="text-xl font-semibold mb-4">Product Management</h2>
                    {isLoading ? <p>Loading...</p> : (
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Product</th>
                                        <th className="px-4 py-2 text-left">Price</th>
                                        <th className="px-4 py-2 text-left">Stock</th>
                                        <th className="px-4 py-2 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product._id} className="border-b">
                                            <td className="px-4 py-3">
                                                <div className="font-medium">{product.name}</div>
                                                <div className="text-xs text-gray-500">{product.category}</div>
                                            </td>
                                            <td className="px-4 py-3">${product.price}</td>
                                            <td className="px-4 py-3">{product.stock}</td>
                                            <td className="px-4 py-3 flex space-x-2">
                                                <button onClick={() => handleEdit(product)} className="text-blue-500 hover:text-blue-700">
                                                    <Edit size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(product._id)} className="text-red-500 hover:text-red-700">
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminDashboardPage
