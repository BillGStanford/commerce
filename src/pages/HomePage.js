import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import CategoryDisplay from '../components/CategoryDisplay';

const HomePage = ({ products, categories, searchTerm, onSearch }) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const autoplayRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    // Extract search query from URL state if available
    const searchQuery = location.state?.searchQuery || searchTerm || '';
    
    // Extract selected category from URL state if available
    const categoryFromUrl = location.state?.selectedCategory;
    
    // Update search term in parent component if it came from the URL
    if (location.state?.searchQuery && onSearch) {
      onSearch(location.state.searchQuery);
    }
    
    // Filter products based on search query
    if (searchQuery) {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
    
    // Get featured products for the featured section
    const featured = products.filter(product => product.featured);
    setFeaturedProducts(featured);
  }, [products, searchTerm, location.state, onSearch]);

  // Slideshow autoplay logic
  useEffect(() => {
    if (autoplay && featuredProducts.length > 1) {
      autoplayRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % featuredProducts.length);
      }, 5000);
    }
    
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [autoplay, featuredProducts.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
    resetAutoplay();
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
    resetAutoplay();
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    resetAutoplay();
  };

  const resetAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
    
    if (autoplay) {
      autoplayRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % featuredProducts.length);
      }, 5000);
    }
  };

  // Function to truncate description
  const truncateDescription = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // If search results should be displayed
  if (searchTerm || location.state?.searchQuery) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">
          Search Results for "{searchTerm || location.state?.searchQuery}"
        </h2>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-lg text-gray-600">No products found matching your search</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Featured Products Slideshow (replacing Hero Banner) */}
      {featuredProducts.length > 0 && (
        <section className="relative bg-gradient-to-r from-gray-100 to-gray-200 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6 text-center" id='featured'>Featured Products</h2>
            
            <div className="relative overflow-hidden rounded-lg shadow-xl">
              {/* Slides */}
              <div className="relative h-96 md:h-[500px] bg-white">
                {featuredProducts.map((product, index) => (
                  <div 
                    key={product.id} 
                    className={`absolute inset-0 transition-opacity duration-500 flex flex-col md:flex-row ${
                      index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                  >
                    <div className="md:w-1/2 h-full overflow-hidden bg-gray-100">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-contain object-center p-4"
                      />
                    </div>
                    <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                      <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                      <p className="text-lg font-medium text-blue-600 mb-2">${product.price.toFixed(2)}</p>
                      <p className="text-gray-600 mb-4">{truncateDescription(product.description)}</p>
                      <div className="flex space-x-4">
                        <a 
                          href={`/product/${product.id}`} 
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition-colors"
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Navigation Arrows */}
              <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-2 rounded-full shadow-md text-gray-800 hover:text-blue-600 transition-colors"
                aria-label="Previous slide"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-2 rounded-full shadow-md text-gray-800 hover:text-blue-600 transition-colors"
                aria-label="Next slide"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
                {featuredProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentSlide ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Grid (keeps the existing featured section) */}


      {/* Categories Section */}
      <div id="categories" className="py-12">
        <CategoryDisplay products={products} categories={categories} />
      </div>
    </div>
  );
};

export default HomePage;