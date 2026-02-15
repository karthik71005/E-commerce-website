const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 py-12 mt-12 border-t border-slate-800">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-1">
                        <h2 className="text-2xl font-serif font-bold text-white mb-4">ShopEase<span className="text-accent">.</span></h2>
                        <p className="text-sm leading-relaxed text-slate-400">
                            Curating the finest products for your lifestyle. Quality, elegance, and service in every order.
                        </p>
                    </div>
                    
                    <div>
                        <h3 className="text-white font-semibold mb-4">Shop</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/products" className="hover:text-white transition-colors">All Products</a></li>
                            <li><a href="/products?category=Electronics" className="hover:text-white transition-colors">Electronics</a></li>
                            <li><a href="/products?category=Fashion" className="hover:text-white transition-colors">Fashion</a></li>
                            <li><a href="/products?category=Home" className="hover:text-white transition-colors">Home & Living</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="text-white font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="text-white font-semibold mb-4">Newsletter</h3>
                        <p className="text-sm text-slate-400 mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
                        <div className="flex">
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                className="bg-slate-800 border-none text-white px-4 py-2 rounded-l-md w-full focus:ring-1 focus:ring-accent outline-none text-sm"
                            />
                            <button className="bg-accent text-slate-900 px-4 py-2 rounded-r-md font-medium text-sm hover:bg-yellow-600 transition-colors">
                                Join
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
                    <p>&copy; {new Date().getFullYear()} ShopEase Inc. All rights reserved.</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <span className="cursor-pointer hover:text-white transition-colors">Twitter</span>
                        <span className="cursor-pointer hover:text-white transition-colors">Instagram</span>
                        <span className="cursor-pointer hover:text-white transition-colors">Facebook</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
