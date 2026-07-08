module.exports = app => {
    const employees = require('../controllers/employee.controller.js');
    const employers = require('../controllers/employer.controller.js');
    const admin = require('../controllers/admin.controller.js');
    const worktypes = require('../controllers/worktype.controller.js');
    const bookings = require('../controllers/booking.controller.js');
    const complaints = require('../controllers/complaint.controller.js');

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
    router.put("/employers/:id", employers.update);

    router.post("/worktypes", worktypes.create);
    router.get("/worktypes", worktypes.findAll);

    router.post("/bookings", bookings.create);
    router.get("/bookings", bookings.findAll);
    router.get("/bookings/employer/:employerId", bookings.findByEmployer);
    router.get("/bookings/employee/:employeeId", bookings.findByEmployee);
    router.put("/bookings/:id/status", bookings.updateStatus);

    router.post("/complaints", complaints.create);
    router.get("/complaints", complaints.findAll);

    app.use("/api", router);
};