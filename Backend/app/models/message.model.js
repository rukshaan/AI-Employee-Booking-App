module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    "message",
    {
      senderId: { type: DataTypes.INTEGER, allowNull: false },
      senderType: { type: DataTypes.STRING, allowNull: false }, // 'employer' or 'employee'
      receiverId: { type: DataTypes.INTEGER, allowNull: false },
      text: { type: DataTypes.TEXT, allowNull: false },
      bookingId: { type: DataTypes.INTEGER, allowNull: true },
    },
    { timestamps: true }
  );
  return Message;
};
