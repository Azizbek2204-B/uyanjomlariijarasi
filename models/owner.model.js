const sequelize = require("../config/db")

const {DataTypes} = require("sequelize")

const Owners = sequelize.define("owners",{
    username:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password_hash:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        unique:true
    },
    company_name:{
        type:DataTypes.STRING
    },
    contact_phone:{
        type:DataTypes.STRING
    },
    joined_date:{
        type:DataTypes.DATE
    },
    is_verified:{
        type:DataTypes.BOOLEAN
    },
    refresh_token:{
        type:DataTypes.TEXT
    },
    is_active:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
    activation_link:{
        type:DataTypes.STRING
    },
})

module.exports = Owners