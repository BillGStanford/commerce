import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CartContext from '../context/CartContext';
import { Search } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cart } = useContext(CartContext);
  
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Add scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Navigate to search results page or filter items
    console.log('Search for:', searchQuery);
    // Implementation would depend on your routing setup
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg py-2' : 'bg-white shadow-md py-4'
    }`}>
      <div className="container-custom">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-xl font-heading font-bold text-gray-900">NileMarket</span>
          </Link>



          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Home
            </Link>
            <a href="#featured" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Featured
            </a>
            <a href="#categories" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Categories
            </a>
            <a href="https://forms.gle/iEsu9KcAkTGZ7NGx8" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Sell Item
            </a>

            {/* Cart Icon */}
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="Shopping cart">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile: Cart and Menu buttons */}
          <div className="flex items-center md:hidden">
            <Link to="/cart" className="relative p-2 mr-2 text-gray-700 hover:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="Shopping cart">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="p-2 text-gray-700 hover:text-primary focus:outline-none"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-2 space-y-4">

            
            <Link 
              to="/" 
              className="block text-gray-700 hover:text-primary font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <a 
              href="#featured" 
              className="block text-gray-700 hover:text-primary font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Featured
            </a>
            <a 
              href="#categories" 
              className="block text-gray-700 hover:text-primary font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </a>
            <a 
              href="https://forms.gle/iEsu9KcAkTGZ7NGx8" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block text-gray-700 hover:text-primary font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Sell Item
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;