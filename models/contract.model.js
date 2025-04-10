const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Clients = require("./client.model");
const Owners = require("./owner.model");
const Status = require("./status.model");
const Product = require("./product.model");

const Contract = sequelize.define("contracts", {
  begin_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: false
});

Clients.hasMany(Contract)
Contract.belongsTo(Clients)

Owners.hasMany(Contract)
Contract.belongsTo(Owners)

Status.hasMany(Contract)
Contract.belongsTo(Status)

Product.hasMany(Contract)
Contract.belongsTo(Product)

module.exports = Contract;