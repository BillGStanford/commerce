import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [selectedContactMethods, setSelectedContactMethods] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Toggle contact method selection
  const toggleContactMethod = (itemKey, method) => {
    setSelectedContactMethods(prev => ({
      ...prev,
      [itemKey]: method
    }));
    
    // Clear error for this product if exists
    if (errors[`contact_${itemKey}`]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[`contact_${itemKey}`];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Check if all products have a contact method selected
    cart.forEach(item => {
      const itemKey = getItemKey(item);
      if (!selectedContactMethods[itemKey]) {
        newErrors[`contact_${itemKey}`] = 'Please select a contact method';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitted(true);
    }
  };

  // Handle close of success message and navigate back to home
  const handleClose = () => {
    clearCart();
    navigate('/');
  };

  // Generate a unique key for cart items (considering size)
  const getItemKey = (item) => {
    return `${item.id}-${item.selectedSize || 'default'}`;
  };

  // Parse contact methods from seller data
  const parseContactMethods = (seller) => {
    // If the new contactDetails object exists, use its keys
    if (seller.contactDetails) {
      return Object.keys(seller.contactDetails);
    }
    
    // Fallback to the original method - split by "or" or comma
    return seller.method.split(/,\s*|\s+or\s+/).map(m => m.trim());
  };

  // Get contact info for the selected method
  const getContactInfo = (seller, method) => {
    // If the new contactDetails object exists, use it to get the contact info
    if (seller.contactDetails && seller.contactDetails[method]) {
      return seller.contactDetails[method];
    }
    
    // Fallback to the original contact field
    return seller.contact;
  };

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
        <h1 className="text-3xl font-bold mb-6">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">You haven't added any items to your cart yet.</p>
        <Link to="/" className="btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="container-custom py-16 max-w-3xl mx-auto">
        <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-10 w-10 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-green-800">Thank you for your purchase!</h3>
                <p className="text-green-700 mt-2">
                  Here's the contact information for your purchase:
                </p>
              </div>
            </div>
            <button 
              onClick={handleClose} 
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-6">
            <h4 className="font-semibold text-lg text-gray-800">Seller Contact Information:</h4>
            <ul className="mt-2 space-y-6">
              {cart.map(item => {
                const itemKey = getItemKey(item);
                const methodArray = parseContactMethods(item.seller);
                const selectedMethod = selectedContactMethods[itemKey];
                const contactInfo = getContactInfo(item.seller, selectedMethod);
                
                return (
                  <li key={itemKey} className="border-b pb-6">
                    <div className="flex items-center mb-4">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="ml-4">
                        <p className="font-medium">{item.name}</p>
                        <div className="flex items-center mt-1">
                          {renderGenderBadge(item.gender)}
                          <p className="text-gray-600">Seller: {item.seller.name}</p>
                        </div>
                        {item.selectedSize && (
                          <p className="text-gray-600">Size: {item.selectedSize}</p>
                        )}
                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="font-bold text-lg text-primary mb-2">
                        {selectedMethod}
                      </p>
                      <p className="text-xl font-bold mb-3">{contactInfo}</p>
                      
                      <p className="text-gray-700 font-medium mb-2">All available contact methods:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        {methodArray.map((method, index) => (
                          <li key={index} className="text-gray-600">
                            {method}: {getContactInfo(item.seller, method)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-yellow-800 font-medium">
              Please contact the sellers directly using the contact details above to arrange payment and delivery or pickup.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {cart.map(item => {
                  const itemKey = getItemKey(item);
                  return (
                    <div key={itemKey} className="flex justify-between items-center py-2">
                      <div className="flex items-center">
                        <div className="w-16 h-16 mr-4 overflow-hidden rounded-md">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <div className="flex items-center mt-1">
                            {renderGenderBadge(item.gender)}
                            <span className="text-gray-600 text-sm">{item.category}</span>
                          </div>
                          {item.selectedSize && (
                            <p className="text-gray-600 text-sm">Size: {item.selectedSize}</p>
                          )}
                          <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span className="font-medium">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2 text-gray-600">
                  <span>Handling Fee</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Checkout Form */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Choose Contact Methods</h2>
              <p className="mb-6 text-gray-600">
                Select how you'd like to be contacted by each seller. After completing your purchase, you'll receive their contact information to arrange delivery.
              </p>
              
              {cart.map(item => {
                const itemKey = getItemKey(item);
                const methodArray = parseContactMethods(item.seller);
                
                return (
                  <div key={itemKey} className="mb-6 pb-6 border-b">
                    <div className="flex items-center mb-4">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-12 h-12 object-cover rounded-md mr-4"
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <div className="flex items-center mt-1">
                          {renderGenderBadge(item.gender)}
                          <p className="text-gray-600 text-sm">Seller: {item.seller.name}</p>
                        </div>
                        {item.selectedSize && (
                          <p className="text-gray-600 text-sm">Size: {item.selectedSize}</p>
                        )}
                        <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    
                    <div className="ml-16">
                      <p className="font-medium mb-2">Preferred contact method:</p>
                      <div className="flex flex-wrap gap-3">
                        {methodArray.map((method, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => toggleContactMethod(itemKey, method)}
                            className={`px-4 py-2 rounded-full border ${
                              selectedContactMethods[itemKey] === method
                                ? 'bg-primary text-white border-primary'
                                : 'border-gray-300 hover:border-primary'
                            }`}
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                      {errors[`contact_${itemKey}`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`contact_${itemKey}`]}</p>
                      )}
                    </div>
                  </div>
                );
              })}
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                <p className="text-blue-800">
                  <span className="font-semibold">Note:</span> Once you complete your purchase, you'll receive the seller's contact information to arrange payment and delivery or pickup directly with them.
                </p>
              </div>
              
              <div className="flex justify-between items-center mt-8 pt-6 border-t">
                <Link to="/cart" className="btn-secondary">
                  Back to Cart
                </Link>
                <button type="submit" className="btn-primary">
                  Complete Purchase
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;