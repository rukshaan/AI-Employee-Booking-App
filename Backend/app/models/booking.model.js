module.exports = (sequelize, DataTypes) => {
  return sequelize.define("booking", {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
    bookingDate: { type: DataTypes.DATE, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: "Pending" },
    employeeId: { type: DataTypes.INTEGER, allowNull: false },
    employerId: { type: DataTypes.INTEGER, allowNull: false },
    workTypeId: { type: DataTypes.INTEGER, allowNull: false }
  });
};