const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define(
    "admin",
    {
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
    },
    { timestamps: false }
  );

  Admin.prototype.comparePassword = async function comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };

  return Admin;
};