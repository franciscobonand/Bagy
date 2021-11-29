"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Pedidos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Pedidos.belongsTo(models.Clientes, { foreignKey: "clienteId" });
    }
  }
  Pedidos.init(
    {
      produtos: DataTypes.STRING,
      parcelas: DataTypes.INTEGER,
      clienteId: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Pedidos",
    }
  );
  return Pedidos;
};
