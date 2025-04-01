import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import CartContext from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const ProductDetail = ({ products }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantityError, setQuantityError] = useState(null);

  useEffect(() => {
    // Find the product based on the ID
    const foundProduct = products.find(p => p.id === parseInt(id));
    
    if (!foundProduct) {
      navigate('/');
      return;
    }
    
    setProduct(foundProduct);
    
    // Set default selected size if sizes are available
    if (foundProduct.sizes && foundProduct.sizes.length > 0) {
      setSelectedSize(foundProduct.sizes[0]);
    }
    
    // Find related products (same category and gender if applicable)
    const related = products
      .filter(p => {
        // Match category
        const categoryMatch = p.category === foundProduct.category;
        
        // If both products have gender specified, match on gender too
        const genderMatch = 
          (!foundProduct.gender || !p.gender) || // No gender specified for one or both
          p.gender === foundProduct.gender || // Same gender
          p.gender === 'Unisex' || foundProduct.gender === 'Unisex'; // One is unisex
        
        return categoryMatch && genderMatch && p.id !== foundProduct.id;
      })
      .slice(0, 4);
    
    setRelatedProducts(related);
  }, [id, products, navigate]);

  if (!product) {
    return (
      <div className="container-custom py-16 text-center">
        <p className="text-xl">Loading product details...</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Check if quantity exceeds stock limit
    const stockLimit = product.stockLimit || Infinity;
    
    if (quantity > stockLimit) {
      setQuantityError(`Sorry, only ${stockLimit} items available in stock.`);
      return;
    }
    
    // Add product with the selected quantity and size
    addToCart(product, quantity, selectedSize);
    navigate('/cart');
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
      
      // Clear error message if quantity is valid
      const stockLimit = product.stockLimit || Infinity;
      if (value <= stockLimit) {
        setQuantityError(null);
      } else {
        setQuantityError(`Sorry, only ${stockLimit} items available in stock.`);
      }
    }
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  // Helper function to render gender badge with proper styling
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
      <span className={`inline-block ${badgeColor} rounded-full px-3 py-1 text-sm font-semibold mr-2`}>
        {product.gender}
      </span>
    );
  };

  // Check if product requires size selection
  const needsSizeSelection = product.sizes && product.sizes.length > 0;
  
  // Check if product has stock limit
  const hasStockLimit = product.stockLimit !== undefined;

  return (
    <div className="bg-white">
      <div className="container-custom py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex space-x-2 text-sm">
            <li>
              <Link to="/" className="text-primary hover:underline">Home</Link>
            </li>
            <li className="text-gray-500">/</li>
            <li>
              <span className="text-gray-500">{product.category}</span>
            </li>
            <li className="text-gray-500">/</li>
            <li>
              <span className="text-gray-500">{product.name}</span>
            </li>
          </ol>
        </nav>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative rounded-lg overflow-hidden shadow-lg">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-auto object-cover"
            />
            <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
              {product.featured && (
                <div className="bg-secondary text-gray-900 px-3 py-1 text-sm font-semibold">
                  Featured
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-2xl font-bold text-primary mb-6">${product.price.toFixed(2)}</p>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Category</h2>
              <div className="flex flex-wrap items-center">
                {renderGenderBadge()}
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                  {product.category}
                </span>
              </div>
            </div>

            {hasStockLimit && (
              <div className="mb-6">
                <span className="text-sm font-medium text-gray-700">
                  {product.stockLimit > 10 ? 
                    `In Stock (${product.stockLimit} available)` : 
                    product.stockLimit > 0 ? 
                      `Only ${product.stockLimit} left in stock!` : 
                      "Out of Stock"}
                </span>
              </div>
            )}

            {/* Size Selection */}
            {needsSizeSelection && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Select Size</h2>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => handleSizeChange(size)}
                      className={`px-4 py-2 border rounded ${
                        selectedSize === size 
                          ? 'border-primary bg-primary text-white' 
                          : 'border-gray-300 hover:border-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Seller Information</h2>
              <p className="text-gray-700 mb-1"><span className="font-medium">Seller:</span> {product.seller.name}</p>
              <p className="text-gray-700"><span className="font-medium">Contact via:</span> {product.seller.method}</p>
            </div>
            
            <div className="mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-24">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    max={product.stockLimit}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="input py-1"
                  />
                </div>
                <button 
                  onClick={handleAddToCart} 
                  className="btn-primary py-3 px-8 text-base mt-auto"
                  disabled={product.stockLimit === 0 || (needsSizeSelection && !selectedSize)}
                >
                  Add to Cart
                </button>
              </div>
              {quantityError && (
                <p className="text-red-500 text-sm mt-2">{quantityError}</p>
              )}
              {needsSizeSelection && !selectedSize && (
                <p className="text-red-500 text-sm mt-2">Please select a size</p>
              )}
              {product.stockLimit === 0 && (
                <p className="text-red-500 text-sm mt-2">This item is currently out of stock</p>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;