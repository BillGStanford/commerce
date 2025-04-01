import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);

  // Helper function to render gender badge
  const renderGenderBadge = (gender) => {
    if (!gender) return null;
    
    let badgeColor = '';
    switch (gender) {
      case 'Men':
        badgeColor = 'bg-blue-100 text-blue-800';
        break;
      case 'Women':
        badgeColor = 'bg-pink-100 text-pink-800';
        break;
      case 'Unisex':
        badgeColor = 'bg-purple-100 text-purple-800';
        break;
      default:
        return null;
    }
    
    return (
      <span className={`inline-block ${badgeColor} rounded-full px-2 py-1 text-xs font-semibold mr-2`}>
        {gender}
      </span>
    );
  };

  if (cart.length === 0) {
    return (
      <div className="container-custom py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
          <Link to="/" className="btn-primary py-2 px-6">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-16">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {cart.map((item, index) => (
                <li key={`${item.id}-${item.selectedSize || 'default'}-${index}`} className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-24 sm:h-24 h-20 w-20 flex-shrink-0 overflow-hidden rounded-md mb-4 sm:mb-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover object-center"
                      />
                    </div>

                    <div className="sm:ml-6 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            <Link to={`/product/${item.id}`} className="hover:text-primary">
                              {item.name}
                            </Link>
                          </h3>
                          <div className="mt-1 flex items-center">
                            {renderGenderBadge(item.gender)}
                            <span className="text-sm text-gray-500">{item.category}</span>
                          </div>
                          {item.selectedSize && (
                            <p className="mt-1 text-sm text-gray-700">
                              <span className="font-medium">Size:</span> {item.selectedSize}
                            </p>
                          )}
                        </div>
                        <p className="text-lg font-medium text-gray-900">${item.price.toFixed(2)}</p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex flex-col">
                          <div className="flex items-center border rounded-md">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize)}
                              disabled={item.quantity <= 1}
                              className="px-2 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                            <span className="px-4 py-1 text-gray-900">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize)}
                              className="px-2 py-1 text-gray-600 hover:text-gray-900"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                          {item.exceededLimit && (
                            <span className="text-xs text-red-600 mt-1">
                              Maximum available quantity reached
                            </span>
                          )}
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id, item.selectedSize)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="p-4 sm:p-6 border-t border-gray-200">
              <button 
                onClick={clearCart}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="text-gray-600">Subtotal</p>
                <p className="text-gray-900 font-medium">${cartTotal.toFixed(2)}</p>
              </div>
              
              <div className="flex justify-between">
                <p className="text-gray-600">Shipping</p>
                <p className="text-gray-900 font-medium">Contact seller</p>
              </div>
              
              <div className="border-t pt-4 flex justify-between">
                <p className="text-lg font-medium text-gray-900">Total</p>
                <p className="text-lg font-bold text-primary">${cartTotal.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <button 
                onClick={() => navigate('/checkout')}
                className="btn-primary w-full py-3 text-base"
              >
                Proceed to Checkout
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-4 text-center">
              You'll be able to contact the seller directly after checkout.
            </p>
          </div>
          
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">We Accept</h2>
            <div className="flex flex-wrap gap-2">
              <div className="bg-gray-100 rounded p-2">
                <svg className="h-8 w-auto" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="32" height="20" rx="4" fill="#016FD0"/>
                  <path d="M14.5 6H17.5L16 10.5L14.5 6Z" fill="white"/>
                  <path d="M11 14L12.5 6H15L13.5 14H11Z" fill="white"/>
                  <path d="M21 6H23.5L22 14H19.5L21 6Z" fill="white"/>
                  <path d="M9 6H6L4.5 10.5L3 6H0.5L3 14H5.5L9 6Z" fill="white"/>
                  <path d="M23 10.5H31.5" stroke="white"/>
                </svg>
              </div>
              <div className="bg-gray-100 rounded p-2">
                <svg className="h-8 w-auto" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="32" height="20" rx="4" fill="#EB001B"/>
                  <circle cx="12" cy="10" r="7" fill="#F79E1B"/>
                  <path d="M16 10C16 7.79086 17.7909 6 20 6C22.2091 6 24 7.79086 24 10C24 12.2091 22.2091 14 20 14C17.7909 14 16 12.2091 16 10Z" fill="#FF5F00"/>
                </svg>
              </div>
              <div className="bg-gray-100 rounded p-2">
                <svg className="h-8 w-auto" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="32" height="20" rx="4" fill="#1434CB"/>
                  <path d="M21.1797, 4L17.5, 16H14.5L18.1797, 4H21.1797Z" fill="white"/>
                  <path d="M12, 4C10.3, 4 9, 5.3 9, 7C9, 10 12, 11 12, 13C12, 14 11, 15 10, 15H7L6.5, 16H10C12, 16 14, 14.5 14, 12C14, 9 11, 8 11, 6C11, 5 12, 4 13, 4H15.5L16, 4H12Z" fill="white"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;