import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';

const HomePage = ({ products, categories }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter products based on active category and search term
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get featured products
  const featuredProducts = products.filter(product => product.featured);

  return (
    <div className="pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
        <div className="container-custom">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Unique Products From Independent Sellers</h1>
            <p className="text-lg mb-8 text-white/90">Browse our curated selection of handpicked items from talented creators and sellers around the world. We negotiate on behalf of you. To get you the best prices and deals!</p>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 px-5 pr-12 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-light"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="featured" className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Main Products Section */}
      <section id="categories" className="py-16 bg-gray-100">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-8 text-center">Browse Products</h2>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center mb-8 gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  activeCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No products found. Try a different category or search term.</p>
            </div>
          )}
        </div>
      </section>

      {/* Sell with Us CTA */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Want to Sell Your Products?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our community of independent sellers and reach customers looking for unique products like yours.
          </p>
          <a 
            href="https://forms.gle/iEsu9KcAkTGZ7NGx8" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-primary text-lg py-3 px-8"
          >
            Become a Seller Today
          </a>
        </div>
      </section>
    </div>
  );
};

export default HomePage;