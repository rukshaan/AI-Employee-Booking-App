const db = require("../models");
const WorkType = db.WorkType;

exports.create = async (req, res) => {
  try {
    const workType = await WorkType.create(req.body);
    res.json({ success: true, workType });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const workTypes = await WorkType.findAll();
    res.json(workTypes);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const workType = await WorkType.findByPk(req.params.id);
    if (!workType) return res.status(404).json({ success: false, message: "Not found" });
    await workType.update(req.body);
    res.json({ success: true, workType });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const workType = await WorkType.findByPk(req.params.id);
    if (!workType) return res.status(404).json({ success: false, message: "Not found" });
    await workType.destroy();
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};