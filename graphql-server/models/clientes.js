"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Clientes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Clientes.hasMany(models.Pedidos);
    }
  }
  Clientes.init(
    {
      nome: DataTypes.STRING,
      email: DataTypes.STRING,
      cpf: DataTypes.STRING,
      nascimento: DataTypes.DATE,
      rua: DataTypes.STRING,
      bairro: DataTypes.STRING,
      cidade: DataTypes.STRING,
      estado: DataTypes.STRING,
      pais: DataTypes.STRING,
      cep: DataTypes.STRING,
      numero: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Clientes",
    }
  );
  return Clientes;
};
