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

  return (
    <div className="card group">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden h-64">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
          />
          {product.featured && (
            <div className="absolute top-0 right-0 bg-secondary text-gray-900 px-3 py-1 text-sm font-semibold">
              Featured
            </div>
          )}
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
            <span className="text-sm font-medium text-gray-500">{product.category}</span>
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