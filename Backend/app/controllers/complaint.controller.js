const db = require("../models");
const Complaint = db.Complaint;

exports.create = async (req, res) => {
  try {
    const complaint = await Complaint.create(req.body);
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