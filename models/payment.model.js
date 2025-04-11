const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Contract = require("./contract.model");
const Status = require("./status.model");

const Payment = sequelize.define("payments", {
  amount: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  payment_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: false
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false
});

Contract.hasMany(Payment)
Payment.belongsTo(Contract)

Status.hasMany(Payment)
Payment.belongsTo(Status)

module.exports = Payment;