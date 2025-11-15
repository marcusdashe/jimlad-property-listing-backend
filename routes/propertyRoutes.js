
const express = require('express');
const router = express.Router();
const {
  getAllProperties,
  getPropertyById,
  createProperty,
  deleteProperty,
  searchProperties
} = require('../controllers/propertyController');
const upload = require('../middleware/upload');

// GET /properties/search - Search properties (must be before /:id route)
router.get('/search', searchProperties);

// GET /properties - Get all properties (with optional filters)
router.get('/', getAllProperties);

// GET /properties/:id - Get single property
router.get('/:id', getPropertyById);

// POST /properties - Create new property (with optional image upload)
router.post('/', upload.single('image'), createProperty);

// DELETE /properties/:id - Delete property
router.delete('/:id', deleteProperty);

module.exports = router;