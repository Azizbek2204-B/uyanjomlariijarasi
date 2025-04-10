const { DataTypes } = require("sequelize")
const sequelize = require("../config/db")

const Categories = sequelize.define("categories", {
    name:{
        type:DataTypes.STRING(30),
        allowNull:false
    },
    description:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    is_active:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    }
})

module.exports = Categories