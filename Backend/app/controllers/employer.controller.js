const db = require('../models');
const Employer = db.Employer;
const bcrypt = require('bcrypt');
const { saveBase64Image } = require('../utils/imageUpload');

exports.create = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password || !req.body.confirmPassword || !req.body.contactNo || !req.body.address) {
    res.status(400).send({ success: false, message: 'Content can not be empty!' });
    return;
  }

  try {
    const existingEmployer = await Employer.findOne({ where: { email: req.body.email } });
    if (existingEmployer) {
      return res.status(409).send({ success: false, message: 'An employer account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const savedImageUrl = saveBase64Image(req.body.profileImage, req);

    const employer = await Employer.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      contactNo: req.body.contactNo,
      address: req.body.address,
      age: req.body.age ? parseInt(req.body.age, 10) : null,
      profileImage: savedImageUrl,
    });

    return res.json({ success: true, data: employer });
  } catch (err) {
    console.error('Error creating employer:', err);

    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).send({ success: false, message: 'An employer account with this email already exists.' });
    }

    return res.status(500).send({
      success: false,
      message: err.message || 'Some error occurred while creating the employer record.'
    });
  }
};

exports.signin = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }

  const { email, password } = req.body;
  try {
    const employer = await Employer.findOne({ where: { email } });
    if (!employer) {
      return res.json({ success: false, message: 'Employer not found with the given email' });
    }

    const isMatch = await employer.comparePassword(password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Email or password does not match' });
    }

    return res.json({ success: true, employer });
  } catch (error) {
    console.error('Error occurred while signing in:', error);
    res.status(500).send({ message: 'Internal server error occurred while signing in.' });
  }
};

exports.findAll = async (req, res) => {
  try {
    const employers = await Employer.findAll();
    res.json(employers);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  try {
    const employer = await Employer.findByPk(id);
    if (!employer) {
      return res.status(404).send({ success: false, message: 'Employer not found!' });
    }

    const { name, contactNo, address, age, profileImage } = req.body;
    const savedImageUrl = profileImage ? saveBase64Image(profileImage, req) : employer.profileImage;

    await employer.update({
      name: name || employer.name,
      contactNo: contactNo || employer.contactNo,
      address: address || employer.address,
      age: age ? parseInt(age, 10) : employer.age,
      profileImage: savedImageUrl,
    });

    return res.json({ success: true, employer });
  } catch (error) {
    console.error('Error updating employer:', error);
    return res.status(500).send({ success: false, message: 'Error updating employer profile!' });
  }
};

exports.updatePassword = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {
    const employer = await Employer.findByPk(id);
    if (!employer) {
      return res.status(404).send({ success: false, message: 'Employer not found!' });
    }

    const isMatch = await employer.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).send({ success: false, message: 'Old password is incorrect!' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await employer.update({ password: hashedPassword });

    return res.json({ success: true, message: 'Password updated successfully!' });
  } catch (error) {
    console.error('Error updating password:', error);
    return res.status(500).send({ success: false, message: 'Internal server error occurred.' });
  }
};