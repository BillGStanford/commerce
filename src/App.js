import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import listingsData from './data/listings.json';
import CartContext from './context/CartContext';

function App() {
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('All');

  // Get available genders from products
  const genders = ['All', ...new Set(
    listingsData.products
      .filter(product => product.gender)
      .map(product => product.gender)
  )];

  // Calculate cart total whenever cart changes
  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartTotal(total);
  }, [cart]);

  const addToCart = (product, quantity = 1, selectedSize = null) => {
    setCart(prevCart => {
      // Check if product already exists in cart with the same size
      const existingItemIndex = prevCart.findIndex(item => 
        item.id === product.id && 
        (selectedSize ? item.selectedSize === selectedSize : !item.selectedSize)
      );
      
      if (existingItemIndex >= 0) {
        // Get the existing item
        const existingItem = prevCart[existingItemIndex];
        
        // Check if adding would exceed stock limit
        const productInData = listingsData.products.find(p => p.id === product.id);
        const stockLimit = productInData?.stockLimit || Infinity;
        
        if (existingItem.quantity + quantity > stockLimit) {
          // If it would exceed, set to maximum available
          const newCart = [...prevCart];
          newCart[existingItemIndex] = { 
            ...existingItem, 
            quantity: stockLimit,
            exceededLimit: true
          };
          return newCart;
        }
        
        // Increment quantity if product already in cart
        const newCart = [...prevCart];
        newCart[existingItemIndex] = { 
          ...existingItem, 
          quantity: existingItem.quantity + quantity,
          exceededLimit: false
        };
        return newCart;
      } else {
        // Check stock limit for new item
        const productInData = listingsData.products.find(p => p.id === product.id);
        const stockLimit = productInData?.stockLimit || Infinity;
        
        if (quantity > stockLimit) {
          // Add new product to cart with max quantity
          return [...prevCart, { 
            ...product, 
            quantity: stockLimit, 
            selectedSize: selectedSize,
            exceededLimit: true
          }];
        }
        
        // Add new product to cart with specified quantity
        return [...prevCart, { 
          ...product, 
          quantity: quantity, 
          selectedSize: selectedSize,
          exceededLimit: false
        }];
      }
    });
  };

  const removeFromCart = (productId, selectedSize = null) => {
    setCart(prevCart => prevCart.filter(item => 
      !(item.id === productId && 
        (selectedSize ? item.selectedSize === selectedSize : !item.selectedSize))
    ));
  };

  const updateQuantity = (productId, newQuantity, selectedSize = null) => {
    if (newQuantity < 1) return;
    
    setCart(prevCart => {
      return prevCart.map(item => {
        // Check if this is the item to update
        if (item.id === productId && 
            (selectedSize ? item.selectedSize === selectedSize : !item.selectedSize)) {
          
          // Get product from data to check stock limit
          const productInData = listingsData.products.find(p => p.id === productId);
          const stockLimit = productInData?.stockLimit || Infinity;
          
          // Limit quantity to stock available
          const adjustedQuantity = Math.min(newQuantity, stockLimit);
          
          return { 
            ...item, 
            quantity: adjustedQuantity,
            exceededLimit: newQuantity > stockLimit
          };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleGenderFilter = (gender) => {
    setGenderFilter(gender);
  };

  const cartContextValue = {
    cart,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <Router>
      <CartContext.Provider value={cartContextValue}>
        <div className="min-h-screen flex flex-col">
          <Navbar 
            categories={listingsData.categories} 
            genders={genders}
            onSearch={handleSearch} 
            onGenderFilter={handleGenderFilter}
          />
          <main className="flex-grow">
            <Routes>
              <Route 
                path="/" 
                element={
                  <HomePage 
                    products={listingsData.products} 
                    categories={listingsData.categories}
                    genders={genders}
                    searchTerm={searchTerm}
                    genderFilter={genderFilter}
                    onSearch={handleSearch}
                    onGenderFilter={handleGenderFilter}
                  />
                } 
              />
              {/* Add the new route with slug parameter */}
              <Route path="/product/:id/:slug" element={<ProductDetail products={listingsData.products} />} />
              {/* Keep the old route for backward compatibility */}
              <Route path="/product/:id" element={<ProductDetail products={listingsData.products} />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartContext.Provider>
    </Router>
  );
}

export default App;