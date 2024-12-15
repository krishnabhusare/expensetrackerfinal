const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('user',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    name:Sequelize.STRING,
    email:{
        type:Sequelize.STRING,
        unique:true,

    },
    password:Sequelize.STRING,
    ispremiumuser:Sequelize.BOOLEAN,
    totalexpense:{
        type:Sequelize.INTEGER,
        defaultValue:0
    }
});

module.exports = User;