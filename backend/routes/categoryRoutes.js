const express = require('express');
const router = express.Router();
const { 
  getCategories, 
  getCategoryById, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} = require('../controllers/categoryController');

// GET all categories and POST new category
router.route('/')
  .get(getCategories)
  .post(createCategory);

// GET, PUT, DELETE category by ID
router.route('/:id')
  .get(getCategoryById)
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router; 