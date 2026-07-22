module.exports = (sequelize, DataTypes) => {
  return sequelize.define("item", {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
    price: { type: DataTypes.FLOAT, allowNull: false },
    discountPrice: { type: DataTypes.FLOAT, allowNull: true },
    image: { type: DataTypes.TEXT('long'), allowNull: true },
    workTypeId: { type: DataTypes.INTEGER, allowNull: true }
  });
};
