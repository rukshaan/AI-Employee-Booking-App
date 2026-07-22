const db = require('../models');
const Employee = db.Employee;
const bcrypt = require('bcrypt');
const { saveBase64Image } = require('../utils/imageUpload');

exports.create = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password || !req.body.contactNo || !req.body.address || !req.body.workType || !req.body.nic) {
    res.status(400).send({ success: false, message: 'Content can not be empty, and NIC is required!' });
    return;
  }

  try {
    const existingNicEmployee = await Employee.findOne({ where: { nic: req.body.nic } });
    if (existingNicEmployee) {
      let currentWorkTypes = existingNicEmployee.workType ? existingNicEmployee.workType.split(',') : [];
      if (!currentWorkTypes.includes(req.body.workType)) {
        currentWorkTypes.push(req.body.workType);
        await existingNicEmployee.update({ workType: currentWorkTypes.join(',') });
        return res.json({ success: true, message: 'Added new skill to existing profile based on NIC.', data: existingNicEmployee });
      } else {
        return res.status(409).send({ success: false, message: 'You already have this skill registered.' });
      }
    }

    const existingEmployee = await Employee.findOne({ where: { email: req.body.email } });
    if (existingEmployee) {
      return res.status(409).send({ success: false, message: 'An employee account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const savedImageUrl = saveBase64Image(req.body.profileImage, req);

    const employee = await Employee.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      contactNo: req.body.contactNo,
      address: req.body.address,
      nic: req.body.nic,
      workType: req.body.workType,
      payment: req.body.payment ? req.body.payment : 250,
      age: req.body.age ? parseInt(req.body.age, 10) : null,
      profileImage: savedImageUrl,
    });

    return res.json({ success: true, data: employee });
  } catch (err) {
    console.error('Error creating employee:', err);

    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).send({ success: false, message: 'An employee account with this email or NIC already exists.' });
    }

    return res.status(500).send({
      success: false,
      message: err.message || 'Some error occurred while creating the employee record.'
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
    const employee = await Employee.findOne({ where: { email } });
    if (!employee) {
      return res.json({ success: false, message: 'Employee not found with the given email' });
    }

    const isMatch = await employee.comparePassword(password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Email or password does not match' });
    }

    return res.json({ success: true, employee });
  } catch (error) {
    console.error('Error occurred while signing in:', error);
    res.status(500).send({ message: 'Internal server error occurred while signing in.' });
  }
};

exports.findAll = async (req, res) => {
  try {
    const employees = await Employee.findAll();
    // Dynamic Ranking Algorithm ("Top to Last")
    // Rank = (averageRating * 20) + (congratulationsCount * 2) - (complaintsCount * 10)
    employees.sort((a, b) => {
      const rankA = (a.averageRating * 20) + (a.congratulationsCount * 2) - (a.complaintsCount * 10);
      const rankB = (b.averageRating * 20) + (b.congratulationsCount * 2) - (b.complaintsCount * 10);
      return rankB - rankA; // Descending order
    });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).send({ success: false, message: 'Employee not found!' });
    }

    const { name, contactNo, address, workType, age, profileImage } = req.body;
    const savedImageUrl = profileImage ? saveBase64Image(profileImage, req) : employee.profileImage;

    await employee.update({
      name: name || employee.name,
      contactNo: contactNo || employee.contactNo,
      address: address || employee.address,
      workType: workType || employee.workType,
      age: age ? parseInt(age, 10) : employee.age,
      profileImage: savedImageUrl,
    });

    return res.json({ success: true, employee });
  } catch (error) {
    console.error('Error updating employee:', error);
    return res.status(500).send({ success: false, message: 'Error updating employee profile!' });
  }
};

exports.updatePassword = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).send({ success: false, message: 'Employee not found!' });
    }

    const isMatch = await employee.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).send({ success: false, message: 'Old password is incorrect!' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await employee.update({ password: hashedPassword });

    return res.json({ success: true, message: 'Password updated successfully!' });
  } catch (error) {
    console.error('Error updating password:', error);
    return res.status(500).send({ success: false, message: 'Internal server error occurred.' });
  }
};

exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const employee = await Employee.findByPk(id);
    if (!employee) return res.status(404).send({ success: false, message: 'Employee not found!' });

    employee.status = status;
    employee.lastSeen = new Date();
    await employee.save();

    return res.json({ success: true, employee });
  } catch (error) {
    return res.status(500).send({ success: false, message: 'Error updating status!' });
  }
};