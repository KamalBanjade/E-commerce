import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { fetchProducts, fetchProductsByCategory } from '../service/api';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      const fetchedProducts = category ? 
        await fetchProductsByCategory(category) : 
        await fetchProducts();
      setProducts(fetchedProducts);
    };
    loadProducts();
  }, [category]);

  const handleCategoryClick = (category) => {
    setCategory(category);
  };

  return (
    <div>
      <Navbar onCategoryClick={handleCategoryClick} />
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id}>
            <h3>{product.title}</h3>
            <p>{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
