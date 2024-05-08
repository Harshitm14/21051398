const express = require('express');
const axios = require('axios');
const app = express();

// Route to fetch top products
app.get('/categories/:categoryName/products', async (req, res) => {
  try {
    const { categoryName } = req.params;
    let { top, minPrice, maxPrice, page, sortBy, company } = req.query;

    // Validate and sanitize query parameters
    top = parseInt(top) || 10; // Default to top 10 if not provided or invalid
    minPrice = parseFloat(minPrice) || 0;
    maxPrice = parseFloat(maxPrice) || Number.MAX_SAFE_INTEGER;
    page = parseInt(page) || 1; // Default to first page if not provided or invalid
    sortBy = ['rating', 'price', 'company', 'discount'].includes(sortBy) ? sortBy : 'rating'; // Default sorting by rating
    company = company || 'AMZ'; // Default to AMZ if company not provided

    // Make request to test server with pagination and sorting parameters
    const response = await axios.get(`http://20.244.56.144/test/companies/${company}/categories/${categoryName}/products`, {
      params: {
        top,
        minPrice,
        maxPrice,
        page,
        sortBy
      }
    });

    const products = response.data;

    // Print required details
    console.log(`Fetched top ${top} products for category ${categoryName} from ${company}:`);
    products.forEach((product, index) => {
      console.log(`${index + 1}. Product Name: ${product.productName}, Price: ${product.price}, Rating: ${product.rating}, Discount: ${product.discount}, Availability: ${product.availability}`);
    });

    res.json(products);
  } catch (error) {
    console.error('Error fetching top products:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to fetch product details
app.get('/categories/:categoryName/products/:productId', async (req, res) => {
  try {
    const { categoryName, productId } = req.params;
    const { company } = req.query;

    // Make request to test server to get product details by ID
    const response = await axios.get(`http://20.244.56.144/test/companies/${company}/categories/${categoryName}/products/${productId}`);

    const product = response.data;

    // Print required details
    console.log(`Fetched product details for product ID ${productId} in category ${categoryName} from ${company}:`);
    console.log(`Product Name: ${product.productName}, Price: ${product.price}, Rating: ${product.rating}, Discount: ${product.discount}, Availability: ${product.availability}`);

    res.json(product);
  } catch (error) {
    console.error('Error fetching product details:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
