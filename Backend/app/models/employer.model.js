const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const Employer = sequelize.define(
    "employer",
    {
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      contactNo: { type: DataTypes.STRING, allowNull: false },
      address: { type: DataTypes.STRING, allowNull: false },
      nic: { type: DataTypes.STRING, unique: true, allowNull: true },
      age: { type: DataTypes.INTEGER, allowNull: true },
      profileImage: { type: DataTypes.TEXT, allowNull: true },
    },
    { timestamps: false }
  );

  Employer.prototype.comparePassword = async function comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };

  return Employer;
};