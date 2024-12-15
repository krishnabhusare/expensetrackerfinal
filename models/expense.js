const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Expense = sequelize.define('expense',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    amount:Sequelize.INTEGER,
    category:Sequelize.STRING,
    description:Sequelize.STRING
});

module.exports = Expense;