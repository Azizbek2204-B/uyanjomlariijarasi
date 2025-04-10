const { DataTypes } = require("sequelize")
const sequelize = require("../config/db")
const Product = require("./product.model")
const Clients = require("./client.model")

const Review = sequelize.define("reviews", {
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
})

Product.hasMany(Review)
Review.belongsTo(Product)

Clients.hasMany(Review)
Review.belongsTo(Clients)

module.exports = Review