const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.SQL_NAME,process.env.SQL_USERNAME,process.env.SQL_PASSWORD,{
    dialect:'mysql',
    host:process.env.SQL_HOST
    
});

module.exports = sequelize;