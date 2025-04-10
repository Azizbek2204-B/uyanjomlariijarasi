const { DataTypes } = require("sequelize")
const sequelize = require("../config/db")

const Admins = sequelize.define("admins", {
    username:{
        type:DataTypes.STRING(30),
        allowNull:false
    },
    password_hash:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    is_active:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
    last_login:{
        type:DataTypes.DATE,
        allowNull:false
    },
    refresh_token:{
        type:DataTypes.TEXT
    },
    activation_link:{
        type:DataTypes.STRING
    },
    is_creator: {
        type: DataTypes.BOOLEAN,
        defaultValue:false
    },
})

module.exports = Admins