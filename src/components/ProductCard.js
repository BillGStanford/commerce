import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import CartContext from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  // Helper function to display gender badge
  const renderGenderBadge = () => {
    if (!product.gender) return null;
    
    let badgeColor = '';
    switch (product.gender) {
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
      <span className={`text-xs ${badgeColor} px-2 py-1 rounded-full mr-2`}>
        {product.gender}
      </span>
    );
  };

  return (
    <div className="card group">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden h-64">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-0 right-0 flex flex-col items-end gap-1 p-1">
            {product.featured && (
              <div className="bg-secondary text-gray-900 px-3 py-1 text-sm font-semibold">
                Featured
              </div>
            )}
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <span className="font-bold text-primary">${product.price.toFixed(2)}</span>
          </div>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {renderGenderBadge()}
              <span className="text-sm font-medium text-gray-500">{product.category}</span>
            </div>
            <button 
              onClick={handleAddToCart} 
              className="btn-primary py-1 px-3 text-sm"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;