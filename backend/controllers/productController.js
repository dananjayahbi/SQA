const Product = require('../models/Product');
const Category = require('../models/Category');
const fs = require('fs-extra');
const path = require('path');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category', 'name')
      .sort({ createdAt: -1 });
    
    res.status(200).json(products);
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json(product);
  } catch (error) {
    console.error('Error getting product:', error);
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, isActive } = req.body;
    
    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Invalid category' });
    }
    
    // Handle uploaded images
    const images = [];
    if (req.files && req.files.length > 0) {
      images.push(...req.files.map(file => `/assets/productImages/${file.filename}`));
    }
    
    // Create product
    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock: stock || 0,
      isActive: isActive !== undefined ? isActive : true,
      images
    });
    
    // Increment category product count
    await Category.findByIdAndUpdate(
      category,
      { $inc: { productCount: 1 } }
    );
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, price, category, stock, isActive } = req.body;
    
    // Find existing product
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if category is being changed
    if (category && existingProduct.category.toString() !== category) {
      // Check if new category exists
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: 'Invalid category' });
      }
      
      // Decrement old category count
      await Category.findByIdAndUpdate(
        existingProduct.category,
        { $inc: { productCount: -1 } }
      );
      
      // Increment new category count
      await Category.findByIdAndUpdate(
        category,
        { $inc: { productCount: 1 } }
      );
    }
    
    // Handle uploaded images
    let images = existingProduct.images;
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/assets/productImages/${file.filename}`);
      
      // If "keepExistingImages" is not true, remove old images
      if (req.body.keepExistingImages !== 'true') {
        // Delete old image files
        for (const oldImage of existingProduct.images) {
          const imagePath = path.join(__dirname, '..', oldImage);
          try {
            await fs.remove(imagePath);
          } catch (err) {
            console.error(`Error removing file ${imagePath}:`, err);
          }
        }
        images = newImages;
      } else {
        // Append new images to existing ones
        images = [...existingProduct.images, ...newImages];
      }
    }
    
    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        description,
        price,
        category,
        stock,
        isActive,
        images
      },
      { new: true, runValidators: true }
    ).populate('category', 'name');
    
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Find product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Delete associated image files
    for (const image of product.images) {
      const imagePath = path.join(__dirname, '..', image);
      try {
        await fs.remove(imagePath);
      } catch (err) {
        console.error(`Error removing file ${imagePath}:`, err);
      }
    }
    
    // Decrement category product count
    await Category.findByIdAndUpdate(
      product.category,
      { $inc: { productCount: -1 } }
    );
    
    // Delete product
    await Product.findByIdAndDelete(productId);
    
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
}; 