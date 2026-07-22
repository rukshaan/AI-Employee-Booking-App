const db = require("../models");
const Item = db.Item;
const { saveBase64Image } = require('../utils/imageUpload');

exports.create = async (req, res) => {
  try {
    const existingItem = await Item.findOne({ where: { name: req.body.name } });
    if (existingItem) {
      return res.status(400).json({ success: false, message: "Item with this name already exists" });
    }
    
    const itemData = { ...req.body };
    if (itemData.image) {
      itemData.image = saveBase64Image(itemData.image, req);
    }
    const item = await Item.create(itemData);
    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const items = await Item.findAll({ include: [db.WorkType] });
    res.json(items);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Not found" });
    const itemData = { ...req.body };
    if (itemData.image && itemData.image.startsWith('data:image')) {
      itemData.image = saveBase64Image(itemData.image, req);
    }
    await item.update(itemData);
    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Not found" });
    await item.destroy();
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
