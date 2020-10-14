const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

const port = process.env.PORT || 5000;

// Encoding the request body using body parser
app.use(bodyParser.urlencoded({ extended: false }));

// Add Product page
app.get('/addProduct', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'addProduct.html'));
});

// Process the post request
app.post('/addProduct', (req, res) => {
  // Initialize the product object
  const product = {
    name: req.body.name,
    brand: req.body.brand,
    price: req.body.price,
    desc: req.body.desc,
  };

  fs.readFile('products.json', 'utf8', (err, data) => {
    // If got error then just throw it
    if (err) throw err;

    // Parse the products.json and store it inside a variable products
    const products = JSON.parse(data);

    // Push the new Product we got
    products.push(product);

    // Convert products array to JSON
    const payload = JSON.stringify(products, null, 2) + '\n';

    console.log(payload);

    // Write the products Array to the products.json
    fs.writeFile('products.json', payload, (err) => {
      // If got error then just throw it
      if (err) throw err;

      res.status(201).json({
        success: true,
        product,
      });
    });
  });
});

// Sending JSON of products
app.get('/products', (_req, res) => {
  fs.readFile('products.json', 'utf8', (err, data) => {
    // If got error then just throw it
    if (err) throw err;

    // Return the products
    res.json(JSON.parse(data));
  });
});

// Showing Home Page
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Sending 404 on all routes
app.get('*', (_req, res) => {
  // Send the 404 status
  res.sendStatus(404);
});

app.listen(port);
