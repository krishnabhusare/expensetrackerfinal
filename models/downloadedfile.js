const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const DownloadedFile = sequelize.define('downloadedfile',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    fileurl:Sequelize.STRING,
    userId:Sequelize.INTEGER,
    filename:Sequelize.STRING
});

module.exports = DownloadedFile;