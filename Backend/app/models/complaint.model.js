module.exports = (sequelize, DataTypes) => {
  return sequelize.define("complaint", {
    userType: { type: DataTypes.STRING, allowNull: false },
    userEmail: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: "Pending" }
  });
};