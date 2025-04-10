const { DataTypes } = require("sequelize")
const sequelize = require("../config/db")

const Status = sequelize.define("status", {
    name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: {
            len: [3, 30]
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    category: {
        type: DataTypes.ENUM("contract", "payment", "delivery", "other"),
        allowNull: false
    }
})

module.exports = Status