const { DataTypes } = require("sequelize")
const sequelize = require("../config/db")
const Product = require("./product.model")

const ProductImage = sequelize.define("product_images", {
    image_url: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    is_primary: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    uploaded_at: {
        type: DataTypes.DATE,
        allowNull:false,
    },
    refresh_token: {
        type: DataTypes.STRING,
        allowNull: true
    }
},{
    underscored:true
})

Product.hasMany(ProductImage)
ProductImage.belongsTo(Product)

module.exports = ProductImage