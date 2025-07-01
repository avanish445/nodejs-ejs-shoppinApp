const Sequalizer = require('sequelize');
const sequalizer = require('../utils/database');
const OrderItem = sequalizer.define('orderItem', {
    id: {
        type: Sequalizer.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: {
        type: Sequalizer.INTEGER
    }
})
module.exports = OrderItem