const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define(
    "employee",
    {
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      contactNo: { type: DataTypes.STRING, allowNull: false },
      address: { type: DataTypes.STRING, allowNull: false },
      nic: { type: DataTypes.STRING, unique: true, allowNull: true },
      workType: { type: DataTypes.STRING, allowNull: false },
      payment: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 250 },
      status: { type: DataTypes.STRING, defaultValue: "Available" },
      lastSeen: { type: DataTypes.DATE, allowNull: true },
      averageRating: { type: DataTypes.FLOAT, defaultValue: 0 },
      congratulationsCount: { type: DataTypes.INTEGER, defaultValue: 0 },
      complaintsCount: { type: DataTypes.INTEGER, defaultValue: 0 },
      age: { type: DataTypes.INTEGER, allowNull: true },
      profileImage: { type: DataTypes.TEXT, allowNull: true },
    },
    { timestamps: false }
  );

  Employee.prototype.comparePassword = async function comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };

  return Employee;
};