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
      workType: { type: DataTypes.STRING, allowNull: false },
      payment: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 250 },
      status: { type: DataTypes.STRING, defaultValue: "Available" },
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