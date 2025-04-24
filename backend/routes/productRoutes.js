const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middlewares/upload');

// Get all products
router.get('/', productController.getAllProducts);

// Get product by ID
router.get('/:id', productController.getProductById);

// Create product with image upload
router.post('/', upload.array('images', 5), productController.createProduct);

// Update product with optional image upload
router.put('/:id', upload.array('images', 5), productController.updateProduct);

// Delete product
router.delete('/:id', productController.deleteProduct);

module.exports = router; 