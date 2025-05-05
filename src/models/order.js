'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  order.init({
    userId:{
      type: DataTypes.STRING,
      allowNull: false
    },
    items: {
      type:DataTypes.JSON,
      allowNull: false
  },
    price: {
      type: DataTypes.STRING,
      allowNull: false
    },
    deliveryStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'order',
  });
  return order;
};