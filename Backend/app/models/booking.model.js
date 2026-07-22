module.exports = (sequelize, DataTypes) => {
  return sequelize.define("booking", {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
    bookingDate: { type: DataTypes.DATE, allowNull: false },
    bookingTime: { type: DataTypes.STRING, allowNull: true },
    endTime: { type: DataTypes.STRING, allowNull: true },
    endDate: { type: DataTypes.DATE, allowNull: true },
    price: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: "Pending" },
    reviewText: { type: DataTypes.TEXT, allowNull: true },
    rating: { type: DataTypes.INTEGER, allowNull: true },
    isPaid: { type: DataTypes.BOOLEAN, defaultValue: false },
    isOffer: { type: DataTypes.BOOLEAN, defaultValue: false },
    offerDetails: { type: DataTypes.TEXT, allowNull: true },
    employeeId: { type: DataTypes.INTEGER, allowNull: false },
    employerId: { type: DataTypes.INTEGER, allowNull: false },
    workTypeId: { type: DataTypes.INTEGER, allowNull: false }
  });
};