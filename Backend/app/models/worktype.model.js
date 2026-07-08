module.exports = (sequelize, DataTypes) => {
  return sequelize.define("worktype", {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
    price: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: "Active" }
  });
};