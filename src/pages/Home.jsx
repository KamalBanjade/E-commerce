import { useEffect, useState } from 'react';
import { fetchProducts } from '../services/api';
import { Link } from 'react-router-dom';
import { FaSearch, FaSort } from 'react-icons/fa';
import './Home.css';

function Home() {
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === 'lowToHigh') {
      return a.price - b.price;
    } else if (sortOrder === 'highToLow') {
      return b.price - a.price;
    }
    return 0;
  });

  const filteredProducts = sortedProducts.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home-container">
      <h1 className="page-title">Discover Amazing Products</h1>
      <div className="search-sort-container">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="sort-box">
          <FaSort className="sort-icon" />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="sort-select"
          >
            <option value="">Sort by Price</option>
            <option value="lowToHigh">Low to High</option>
            <option value="highToLow">High to Low</option>
          </select>
        </div>
      </div>
      <div className="product-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <Link to={`/products/${product.id}`} className="product-link">
              <div className="product-image-container">
                <img src={product.image} alt={product.title} className="product-image" />
              </div>
              <div className="product-info">
                <h2 className="product-title">{product.title}</h2>
                <p className="product-price">${product.price.toFixed(2)}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
