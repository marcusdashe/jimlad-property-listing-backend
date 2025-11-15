
const { DataTypes, Model } = require('sequelize');

class Property extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: 'Title cannot be empty'
            },
            len: {
              args: [3, 255],
              msg: 'Title must be between 3 and 255 characters'
            }
          }
        },
        location: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: 'Location cannot be empty'
            }
          }
        },
        price: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: false,
          validate: {
            isDecimal: {
              msg: 'Price must be a valid number'
            },
            min: {
              args: [0],
              msg: 'Price must be greater than or equal to 0'
            }
          }
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        imageUrl: {
          type: DataTypes.STRING(500),
          allowNull: true,
          validate: {
            isUrlOrPath(value) {
              if (value && !value.startsWith('http') && !value.startsWith('/uploads')) {
                throw new Error('Image URL must be a valid URL or upload path');
              }
            }
          }
        },
        createdAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW
        },
        updatedAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW
        }
      },
      {
        sequelize,
        modelName: 'Property',
        tableName: 'properties',
        timestamps: true
      }
    );
  }
}

module.exports = Property;