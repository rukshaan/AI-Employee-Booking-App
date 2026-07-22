const db = require("../models");
const Message = db.Message;

exports.getMessages = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const messages = await Message.findAll({
      where: { bookingId },
      order: [['createdAt', 'ASC']]
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
