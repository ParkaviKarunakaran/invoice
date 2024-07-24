const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres', 'Parkavi@19', {
    host: 'localhost',
    dialect: 'postgres'
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import the Item model
db.items = require('./item')(sequelize, Sequelize);

module.exports = db;
