const db = require("../models");
const Booking = db.Booking;
const Employer = db.Employer;
const Employee = db.Employee;

exports.getDashboardStats = async (req, res) => {
  try {
    const totalWorkers = await Employee.count();
    const totalCustomers = await Employer.count();
    const recentOrders = await Booking.count({
      where: {
        status: ['Pending', 'Processing', 'Approved', 'Finished', 'Completed']
      }
    });

    res.json({
      success: true,
      stats: {
        workers: totalWorkers,
        customers: totalCustomers,
        orders: recentOrders
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
