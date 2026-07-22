module.exports = app => {
    const employees = require('../controllers/employee.controller.js');
    const employers = require('../controllers/employer.controller.js');
    const admin = require('../controllers/admin.controller.js');
    const worktypes = require('../controllers/worktype.controller.js');
    const bookings = require('../controllers/booking.controller.js');
    const complaints = require('../controllers/complaint.controller.js');
    const analytics = require('../controllers/analytics.controller.js');
    const payment = require('../controllers/payment.controller.js');
    const chat = require('../controllers/chat.controller.js');

    const express = require('express');
    const router = express.Router();

    router.post("/employees", employees.create);
    router.get("/employees", employees.findAll);
    router.post("/employers", employers.create);
    router.get("/employers", employers.findAll);

    router.post("/employees/signin", employees.signin);
    router.post("/employers/signin", employers.signin);
    router.post("/admin/signin", admin.signin);

    router.put("/employees/:id", employees.update);
    router.put("/employees/:id/status", employees.updateStatus);
    router.put("/employees/:id/password", employees.updatePassword);
    router.put("/employers/:id", employers.update);
    router.put("/employers/:id/password", employers.updatePassword);

    router.post("/worktypes", worktypes.create);
    router.get("/worktypes", worktypes.findAll);
    router.put("/worktypes/:id", worktypes.update);
    router.delete("/worktypes/:id", worktypes.delete);

    router.post("/bookings", bookings.create);
    router.get("/bookings", bookings.findAll);
    router.get("/bookings/employer/:employerId", bookings.findByEmployer);
    router.get("/bookings/employee/:employeeId", bookings.findByEmployee);
    router.put("/bookings/:id/status", bookings.updateStatus);
    router.put("/bookings/:id/review", bookings.submitReview);
    router.put("/bookings/:id/pay", bookings.markAsPaid);

    router.post("/payment/checkout", payment.createCheckoutSession);

    router.get("/chat/:bookingId", chat.getMessages);

    router.post("/complaints", complaints.create);
    router.get("/complaints", complaints.findAll);

    router.get("/analytics/dashboard", analytics.getDashboardStats);

    const items = require('../controllers/item.controller.js');
    router.post("/items", items.create);
    router.get("/items", items.findAll);
    router.put("/items/:id", items.update);
    router.delete("/items/:id", items.delete);

    app.use("/api", router);
};