const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Owners = require("./owner.model");
const Categories = require("./categories.model");

const Product = sequelize.define("products", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    is_available: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    rent_price: {
        type: DataTypes.DECIMAL,
        allowNull: false
    }
}, {
    timestamps: true,
    underscored: true
});


Owners.hasMany(Product)
Product.belongsTo(Owners)

Categories.hasMany(Product)
Product.belongsTo(Categories)

module.exports = Product;