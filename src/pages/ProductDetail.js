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

  useEffect(() => {
    // Find the product based on the ID
    const foundProduct = products.find(p => p.id === parseInt(id));
    
    if (!foundProduct) {
      navigate('/');
      return;
    }
    
    setProduct(foundProduct);
    
    // Find related products (same category)
    const related = products
      .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
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
    // Add product with the selected quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    navigate('/cart');
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

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
            {product.featured && (
              <div className="absolute top-4 right-4 bg-secondary text-gray-900 px-3 py-1 text-sm font-semibold">
                Featured
              </div>
            )}
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
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                {product.category}
              </span>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Seller Information</h2>
              <p className="text-gray-700 mb-1"><span className="font-medium">Seller:</span> {product.seller.name}</p>
              <p className="text-gray-700"><span className="font-medium">Contact via:</span> {product.seller.method}</p>
            </div>
            
            <div className="mb-8 flex items-center space-x-4">
              <div className="w-24">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="input py-1"
                />
              </div>
              <button 
                onClick={handleAddToCart} 
                className="btn-primary py-3 px-8 text-base mt-auto"
              >
                Add to Cart
              </button>
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