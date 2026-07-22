const db = require("../models");
const Complaint = db.Complaint;
const Sentiment = require('sentiment');
const sentimentAnalyzer = new Sentiment();

exports.create = async (req, res) => {
  try {
    const complaint = await Complaint.create(req.body);
    
    // Analyze sentiment and update employee if negative
    if (req.body.employeeId && req.body.message) {
      const sentimentResult = sentimentAnalyzer.analyze(req.body.message);
      if (sentimentResult.score < -2) {
        const employee = await db.Employee.findByPk(req.body.employeeId);
        if (employee) {
          employee.complaintsCount += 1;
          employee.averageRating = Math.max(1, employee.averageRating - 0.5);
          await employee.save();
        }
      }
    }

    res.json({ success: true, complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const complaints = await Complaint.findAll();
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};