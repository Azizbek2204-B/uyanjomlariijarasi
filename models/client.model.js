const sequelize = require("../config/db")

const {DataTypes} = require("sequelize")

const Clients = sequelize.define("clients",{
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
    first_name:{
        type:DataTypes.STRING
    },
    last_name:{
        type:DataTypes.STRING
    },
    passport:{
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
    hash_token:{
        type:DataTypes.STRING
    },
    refresh_token:{
        type:DataTypes.STRING
    },
    activation_link:{
        type:DataTypes.STRING
    },
    is_active:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
})

module.exports = Clients