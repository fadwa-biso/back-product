import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  ShoppingCartIcon, 
  HeartIcon,
  EyeIcon 
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Button from '../Common/Button';
import toast from 'react-hot-toast';

const ProductCard = ({ product, onAddToWishlist, isInWishlist = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    setIsLoading(true);
    const result = await addToCart(product._id, 1);
    setIsLoading(false);
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    if (onAddToWishlist) {
      await onAddToWishlist(product._id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 card-hover group">
      <Link to={`/products/${product._id}`} className="block">
        {/* Product Image */}
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
              <button
                onClick={handleWishlistToggle}
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                {isInWishlist ? (
                  <HeartSolidIcon className="h-5 w-5 text-red-500" />
                ) : (
                  <HeartIcon className="h-5 w-5 text-gray-600" />
                )}
              </button>
              <Link
                to={`/products/${product._id}`}
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                title="View details"
              >
                <EyeIcon className="h-5 w-5 text-gray-600" />
              </Link>
            </div>
          </div>

          {/* Price Badge */}
          <div className="absolute top-2 right-2 bg-primary-600 text-white px-2 py-1 rounded-md text-sm font-semibold">
            ${product.price}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
          
          {product.description?.scientific_name && (
            <p className="text-sm text-gray-500 mb-2">
              {product.description.scientific_name}
            </p>
          )}

          {product.description?.belongs_to && (
            <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full mb-3">
              {product.description.belongs_to}
            </span>
          )}

          {/* Medical Uses */}
          {product.description?.medical_uses && product.description.medical_uses.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">Uses:</p>
              <p className="text-sm text-gray-700 line-clamp-2">
                {product.description.medical_uses.slice(0, 2).join(', ')}
                {product.description.medical_uses.length > 2 && '...'}
              </p>
            </div>
          )}
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          loading={isLoading}
          disabled={!isAuthenticated}
          className="w-full btn-hover"
          size="sm"
        >
          <ShoppingCartIcon className="h-4 w-4 mr-2" />
          {isAuthenticated ? 'Add to Cart' : 'Login to Buy'}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;