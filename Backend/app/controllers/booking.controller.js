const db = require("../models");
const Booking = db.Booking;
const Sentiment = require('sentiment');
const sentimentAnalyzer = new Sentiment();

exports.create = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    if (req.io && req.body.employeeId) {
      req.io.to(`user_${req.body.employeeId}`).emit('new_booking_request', booking);
    }
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

    if (req.io && booking.employerId) {
      req.io.to(`user_${booking.employerId}`).emit('booking_status_updated', booking);
    }

    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.submitReview = async (req, res) => {
  try {
    const { rating, reviewText } = req.body;
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    booking.rating = rating;
    booking.reviewText = reviewText;
    await booking.save();

    // Update employee statistics
    const employee = await db.Employee.findByPk(booking.employeeId);
    if (employee) {
      const allBookings = await Booking.findAll({ where: { employeeId: employee.id, rating: { [db.Sequelize.Op.ne]: null } } });
      const totalRatings = allBookings.reduce((sum, b) => sum + b.rating, 0);
      let baseAverage = totalRatings / allBookings.length;
      
      const sentimentResult = sentimentAnalyzer.analyze(reviewText || '');
      let sentimentAdjustment = 0;
      if (sentimentResult.score >= 3) sentimentAdjustment = 0.5;
      if (sentimentResult.score <= -2) sentimentAdjustment = -0.5;

      employee.averageRating = Math.min(5, Math.max(1, baseAverage + sentimentAdjustment));
      
      if (rating >= 4 || sentimentResult.score >= 3) {
        employee.congratulationsCount += 1;
      }
      await employee.save();
    }

    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.markAsPaid = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    booking.isPaid = true;
    await booking.save();

    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};