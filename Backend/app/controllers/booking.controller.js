const db = require("../models");
const Booking = db.Booking;

exports.create = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [db.Employee, db.Employer, db.WorkType]
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.findByEmployer = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { employerId: req.params.employerId },
      include: [db.Employee, db.WorkType]
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.findByEmployee = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { employeeId: req.params.employeeId },
      include: [db.Employer, db.WorkType]
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    booking.status = req.body.status;
    await booking.save();

    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};