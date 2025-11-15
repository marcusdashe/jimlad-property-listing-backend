
const sequelize = require('../config/database');
const Property = require('./property');

// Initialize models
Property.init(sequelize);

module.exports = {
  sequelize,
  Property
};