import { Link } from 'react-router-dom'

const HomePage = () => {
    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <section className="bg-primary text-white py-20 rounded-xl px-8 text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to ShopEase</h1>
                <p className="text-xl mb-8">Discover the best products at unbeatable prices.</p>
                <Link to="/products" className="bg-white text-primary px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition">
                    Shop Now
                </Link>
            </section>

            {/* Featured Categories */}
            <section>
                <h2 className="text-3xl font-bold mb-6 text-center">Featured Categories</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-gray-100 p-8 rounded-lg text-center hover:shadow-lg transition">
                        <h3 className="text-xl font-bold mb-2">Electronics</h3>
                        <Link to="/products?category=Electronics" className="text-primary hover:underline">View All</Link>
                    </div>
                    <div className="bg-gray-100 p-8 rounded-lg text-center hover:shadow-lg transition">
                        <h3 className="text-xl font-bold mb-2">Fashion</h3>
                        <Link to="/products?category=Fashion" className="text-primary hover:underline">View All</Link>
                    </div>
                    <div className="bg-gray-100 p-8 rounded-lg text-center hover:shadow-lg transition">
                        <h3 className="text-xl font-bold mb-2">Home</h3>
                        <Link to="/products?category=Home" className="text-primary hover:underline">View All</Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HomePage
