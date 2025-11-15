
const { Property } = require('../models');
const { ValidationError, Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Get all properties with search and filter
const getAllProperties = async (req, res) => {
  try {
    const { location, minPrice, maxPrice, search } = req.query;
    
    // Build where clause for filtering
    const whereClause = {};
    
    // Location filter (case-insensitive partial match)
    if (location) {
      whereClause.location = {
        [Op.iLike]: `%${location}%`
      };
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) {
        whereClause.price[Op.gte] = parseFloat(minPrice);
      }
      if (maxPrice) {
        whereClause.price[Op.lte] = parseFloat(maxPrice);
      }
    }
    
    // General search (searches in title, location, and description)
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    const properties = await Property.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      count: properties.length,
      filters: { location, minPrice, maxPrice, search },
      data: properties
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch properties'
    });
  }
};

// Get single property by ID
const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const property = await Property.findByPk(id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: property
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch property'
    });
  }
};

// Create new property
const createProperty = async (req, res) => {
  try {
    const { title, location, price, description, imageUrl } = req.body;
    
    // Additional validation
    if (!title || !location || price === undefined) {
      // Clean up uploaded file if validation fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, location, and price are required'
      });
    }
    
    // Use uploaded image if available, otherwise use imageUrl from body
    let finalImageUrl = imageUrl;
    if (req.file) {
      // Generate URL for uploaded image
      finalImageUrl = `${req.protocol}://${req.get('host')}/uploads/properties/${req.file.filename}`;
    }
    
    const property = await Property.create({
      title,
      location,
      price,
      description,
      imageUrl: finalImageUrl
    });
    
    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: property
    });
  } catch (error) {
    console.error('Error creating property:', error);
    
    // Clean up uploaded file if property creation fails
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    if (error instanceof ValidationError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(e => ({
          field: e.path,
          message: e.message
        }))
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create property'
    });
  }
};

// Delete property
const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    
    const property = await Property.findByPk(id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    // Delete associated image file if it exists and is stored locally
    if (property.imageUrl && property.imageUrl.includes('/uploads/properties/')) {
      const filename = property.imageUrl.split('/uploads/properties/')[1];
      const filepath = path.join(__dirname, '..', 'uploads', 'properties', filename);
      
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }
    
    await property.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete property'
    });
  }
};

// Search properties (dedicated search endpoint)
const searchProperties = async (req, res) => {
  try {
    const { q, location, minPrice, maxPrice } = req.query;
    
    if (!q && !location && !minPrice && !maxPrice) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one search parameter (q, location, minPrice, or maxPrice)'
      });
    }
    
    const whereClause = {};
    
    // General search query
    if (q) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${q}%` } },
        { location: { [Op.iLike]: `%${q}%` } },
        { description: { [Op.iLike]: `%${q}%` } }
      ];
    }
    
    // Location-specific search
    if (location) {
      whereClause.location = {
        [Op.iLike]: `%${location}%`
      };
    }
    
    // Price range
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) {
        whereClause.price[Op.gte] = parseFloat(minPrice);
      }
      if (maxPrice) {
        whereClause.price[Op.lte] = parseFloat(maxPrice);
      }
    }
    
    const properties = await Property.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      count: properties.length,
      searchParams: { q, location, minPrice, maxPrice },
      data: properties
    });
  } catch (error) {
    console.error('Error searching properties:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search properties'
    });
  }
};

module.exports = {
  getAllProperties,
  getPropertyById,
  createProperty,
  deleteProperty,
  searchProperties
};