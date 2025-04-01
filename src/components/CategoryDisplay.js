import React, { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';

const CategoryDisplay = ({ products, categories }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200 });
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedGender, setSelectedGender] = useState('All');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [mobilePriceFilterOpen, setMobilePriceFilterOpen] = useState(false);
  const [mobileSizeFilterOpen, setMobileSizeFilterOpen] = useState(false);
  const [mobileGenderFilterOpen, setMobileGenderFilterOpen] = useState(false);
  const dropdownRef = useRef(null);
  const priceFilterRef = useRef(null);
  const sizeFilterRef = useRef(null);
  const genderFilterRef = useRef(null);

  // Get all available sizes from products
  const allSizes = [...new Set(
    products
      .filter(product => product.sizes)
      .flatMap(product => product.sizes)
  )].sort();

  // Get all available genders from products
  const allGenders = ['All', ...new Set(
    products
      .filter(product => product.gender)
      .map(product => product.gender)
  )].sort();

  // Find min and max price from products
  const minProductPrice = Math.floor(Math.min(...products.map(product => product.price)));
  const maxProductPrice = Math.ceil(Math.max(...products.map(product => product.price)));

  // Initialize price range on component mount
  useEffect(() => {
    setPriceRange({ min: minProductPrice, max: maxProductPrice });
  }, [minProductPrice, maxProductPrice]);

  // Filter products based on all selected filters
  useEffect(() => {
    let filtered = [...products];
    
    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );
    
    // Filter by size if any sizes are selected
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product => 
        product.sizes && selectedSizes.some(size => product.sizes.includes(size))
      );
    }
    
    // Filter by gender
    if (selectedGender !== 'All') {
      filtered = filtered.filter(product => 
        product.gender === selectedGender
      );
    }
    
    setFilteredProducts(filtered);
  }, [selectedCategory, priceRange, selectedSizes, selectedGender, products]);

  // Handle size selection toggle
  const toggleSizeSelection = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size) 
        : [...prev, size]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory('All');
    setPriceRange({ min: minProductPrice, max: maxProductPrice });
    setSelectedSizes([]);
    setSelectedGender('All');
  };

  // Handle outside clicks to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMobileDropdownOpen(false);
      }
      if (priceFilterRef.current && !priceFilterRef.current.contains(event.target)) {
        setMobilePriceFilterOpen(false);
      }
      if (sizeFilterRef.current && !sizeFilterRef.current.contains(event.target)) {
        setMobileSizeFilterOpen(false);
      }
      if (genderFilterRef.current && !genderFilterRef.current.contains(event.target)) {
        setMobileGenderFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-8 text-center">Shop by Category</h2>
      
      <div className="flex flex-col md:flex-row">
        {/* Filters sidebar - Desktop */}
        <div className="w-full md:w-1/4 md:pr-6 mb-6 md:mb-0">
          <div className="hidden md:block">
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-4 border-b">
                <h3 className="font-bold text-lg">Categories</h3>
              </div>
              <div className="p-2">
                <ul>
                  <li>
                    <button
                      onClick={() => setSelectedCategory('All')}
                      className={`flex items-center w-full p-2 rounded-md ${
                        selectedCategory === 'All' 
                          ? 'bg-gray-100 text-primary font-medium' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                      All Products
                    </button>
                  </li>
                  {categories && categories.filter(cat => cat !== 'All').map(category => (
                    <li key={category}>
                      <button
                        onClick={() => setSelectedCategory(category)}
                        className={`flex items-center w-full p-2 rounded-md ${
                          selectedCategory === category 
                            ? 'bg-gray-100 text-primary font-medium' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Gender Filter - Desktop */}
            {allGenders.length > 1 && (
              <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-4 border-b">
                  <h3 className="font-bold text-lg">Gender</h3>
                </div>
                <div className="p-2">
                  <ul>
                    {allGenders.map(gender => (
                      <li key={gender}>
                        <button
                          onClick={() => setSelectedGender(gender)}
                          className={`flex items-center w-full p-2 rounded-md ${
                            selectedGender === gender 
                              ? 'bg-gray-100 text-primary font-medium' 
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {gender}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Price Filter - Desktop */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-4 border-b">
                <h3 className="font-bold text-lg">Price Range</h3>
              </div>
              <div className="p-4">
                <div className="mb-4 flex justify-between">
                  <span>${priceRange.min}</span>
                  <span>${priceRange.max}</span>
                </div>
                <div className="mb-4">
                  <input 
                    type="range" 
                    min={minProductPrice} 
                    max={maxProductPrice} 
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                  <input 
                    type="range" 
                    min={minProductPrice} 
                    max={maxProductPrice} 
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <span className="mr-2">$</span>
                    <input 
                      type="number" 
                      min={minProductPrice} 
                      max={priceRange.max} 
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                      className="w-20 p-1 border rounded-md"
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">$</span>
                    <input 
                      type="number" 
                      min={priceRange.min} 
                      max={maxProductPrice} 
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                      className="w-20 p-1 border rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Size Filter - Desktop */}
            {allSizes.length > 0 && (
              <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-4 border-b">
                  <h3 className="font-bold text-lg">Size</h3>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {allSizes.map(size => (
                      <button
                        key={size}
                        onClick={() => toggleSizeSelection(size)}
                        className={`px-3 py-1 border rounded-md ${
                          selectedSizes.includes(size)
                            ? 'bg-gray-800 text-white border-gray-800'
                            : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Reset Filters - Desktop */}
            <button
              onClick={resetFilters}
              className="bg-gray-200 text-gray-800 w-full p-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
          
          {/* Mobile Filters */}
          <div className="md:hidden space-y-4">
            {/* Categories Dropdown - Mobile */}
            <div ref={dropdownRef}>
              <button
                onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                className="flex items-center justify-between w-full p-3 bg-white border border-gray-300 rounded-md shadow"
              >
                <span className="font-medium">Category: {selectedCategory}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transition-transform ${mobileDropdownOpen ? 'transform rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {mobileDropdownOpen && (
                <div className="mt-2 p-2 bg-white border border-gray-300 rounded-md shadow-lg absolute z-10 w-4/5">
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setMobileDropdownOpen(false);
                    }}
                    className={`flex items-center w-full p-2 rounded-md ${
                      selectedCategory === 'All' ? 'bg-gray-100 text-primary font-medium' : ''
                    }`}
                  >
                    All Products
                  </button>
                  {categories && categories.filter(cat => cat !== 'All').map(category => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setMobileDropdownOpen(false);
                      }}
                      className={`flex items-center w-full p-2 rounded-md ${
                        selectedCategory === category ? 'bg-gray-100 text-primary font-medium' : ''
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Gender Filter - Mobile */}
            {allGenders.length > 1 && (
              <div ref={genderFilterRef}>
                <button
                  onClick={() => setMobileGenderFilterOpen(!mobileGenderFilterOpen)}
                  className="flex items-center justify-between w-full p-3 bg-white border border-gray-300 rounded-md shadow"
                >
                  <span className="font-medium">Gender: {selectedGender}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transition-transform ${mobileGenderFilterOpen ? 'transform rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {mobileGenderFilterOpen && (
                  <div className="mt-2 p-2 bg-white border border-gray-300 rounded-md shadow-lg absolute z-10 w-4/5">
                    {allGenders.map(gender => (
                      <button
                        key={gender}
                        onClick={() => {
                          setSelectedGender(gender);
                          setMobileGenderFilterOpen(false);
                        }}
                        className={`flex items-center w-full p-2 rounded-md ${
                          selectedGender === gender ? 'bg-gray-100 text-primary font-medium' : ''
                        }`}
                      >
                        {gender}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Price Filter - Mobile */}
            <div ref={priceFilterRef}>
              <button
                onClick={() => setMobilePriceFilterOpen(!mobilePriceFilterOpen)}
                className="flex items-center justify-between w-full p-3 bg-white border border-gray-300 rounded-md shadow"
              >
                <span className="font-medium">Price: ${priceRange.min} - ${priceRange.max}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transition-transform ${mobilePriceFilterOpen ? 'transform rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {mobilePriceFilterOpen && (
                <div className="mt-2 p-4 bg-white border border-gray-300 rounded-md shadow-lg absolute z-10 w-4/5">
                  <div className="mb-4 flex justify-between">
                    <span>${priceRange.min}</span>
                    <span>${priceRange.max}</span>
                  </div>
                  <div className="mb-4">
                    <input 
                      type="range" 
                      min={minProductPrice} 
                      max={maxProductPrice} 
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                    <input 
                      type="range" 
                      min={minProductPrice} 
                      max={maxProductPrice} 
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <span className="mr-2">$</span>
                      <input 
                        type="number" 
                        min={minProductPrice} 
                        max={priceRange.max} 
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                        className="w-16 p-1 border rounded-md"
                      />
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">$</span>
                      <input 
                        type="number" 
                        min={priceRange.min} 
                        max={maxProductPrice} 
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                        className="w-16 p-1 border rounded-md"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setMobilePriceFilterOpen(false)}
                    className="mt-4 bg-gray-800 text-white w-full p-2 rounded-md"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Size Filter - Mobile */}
            {allSizes.length > 0 && (
              <div ref={sizeFilterRef}>
                <button
                  onClick={() => setMobileSizeFilterOpen(!mobileSizeFilterOpen)}
                  className="flex items-center justify-between w-full p-3 bg-white border border-gray-300 rounded-md shadow"
                >
                  <span className="font-medium">
                    Size: {selectedSizes.length > 0 ? selectedSizes.join(', ') : 'All'}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transition-transform ${mobileSizeFilterOpen ? 'transform rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {mobileSizeFilterOpen && (
                  <div className="mt-2 p-4 bg-white border border-gray-300 rounded-md shadow-lg absolute z-10 w-4/5">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {allSizes.map(size => (
                        <button
                          key={size}
                          onClick={() => toggleSizeSelection(size)}
                          className={`px-3 py-1 border rounded-md ${
                            selectedSizes.includes(size)
                              ? 'bg-gray-800 text-white border-gray-800'
                              : 'bg-white text-gray-800 border-gray-300'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setMobileSizeFilterOpen(false)}
                      className="bg-gray-800 text-white w-full p-2 rounded-md"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Reset Filters - Mobile */}
            <button
              onClick={resetFilters}
              className="bg-gray-200 text-gray-800 w-full p-2 rounded-md"
            >
              Reset All Filters
            </button>
          </div>
        </div>
        
        {/* Products display */}
        <div className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-lg">
              {selectedCategory} Products
              {selectedGender !== 'All' && ` • ${selectedGender}`}
              {selectedSizes.length > 0 && ` • Size: ${selectedSizes.join(', ')}`}
            </h3>
            <span className="text-sm text-gray-600">{filteredProducts.length} products</span>
          </div>
          
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-lg shadow">
              <p className="text-gray-500">No products found with the selected filters</p>
              <button 
                onClick={resetFilters}
                className="mt-4 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryDisplay;