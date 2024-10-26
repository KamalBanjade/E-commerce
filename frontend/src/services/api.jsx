import axios from 'axios';

const API_URL = 'https://fakestoreapi.com';
const LOCAL_API_URL = 'http://localhost:8009/api'; // Assuming your local backend runs on port 8009
export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch products:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Fetch product by ID
export const fetchProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch product (ID: ${id}):`, error.response ? error.response.data : error.message);
    throw error;
  }
};

// Fetch all categories
export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/products/categories`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch categories:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Fetch products by a specific category
export const fetchProductsByCategory = async (category) => {
  try {
    const response = await axios.get(`${API_URL}/products/category/${category}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch products for category: ${category}`, error.response ? error.response.data : error.message);
    throw error;
  }
};

// Add a review for a product (from your local backend)
// Add a review for a product (from your local backend)
export const addReviewForProduct = async (productId, reviewData) => {
  try {
    const response = await axios.post(`${LOCAL_API_URL}/products/${productId}/reviews`, reviewData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to add review:', error.response ? error.response.data : error.message);
    throw error;
  }
};


// Fetch reviews for a product (from your local backend)
export const fetchReviewsForProduct = async (id) => {
  try {
    const response = await axios.get(`${LOCAL_API_URL}/products/${id}/reviews`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch reviews for product ID: ${id}`, error.response ? error.response.data : error.message);
    throw error;
  }
};