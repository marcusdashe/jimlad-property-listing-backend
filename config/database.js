const fs = require('fs');
const path = require('path');

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'defaultdb',
  process.env.DB_USER || 'avnadmin',
  process.env.DB_PASSWORD || "AVNS_bl1dkf2uio_pSVCuSoN",
  {
    host: process.env.DB_HOST || 'pg-1e611303-marcusdashe-bc5b.c.aivencloud.com',
    port: process.env.DB_PORT || 24533,
    dialect: 'postgres',
    dialectOptions: {
    ssl: {
      require: true,
       ca: fs.readFileSync(path.join(__dirname, 'certs', 'ca.pem')).toString()
      }
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;