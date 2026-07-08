const db = require('../models');
const Employee = db.Employee;
const bcrypt = require('bcrypt');

exports.create = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password || !req.body.confirmPassword || !req.body.contactNo || !req.body.address || !req.body.workType) {
    res.status(400).send({ success: false, message: 'Content can not be empty!' });
    return;
  }

  try {
    const existingEmployee = await Employee.findOne({ where: { email: req.body.email } });
    if (existingEmployee) {
      return res.status(409).send({ success: false, message: 'An employee account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const employee = await Employee.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      contactNo: req.body.contactNo,
      address: req.body.address,
      workType: req.body.workType,
      payment: req.body.payment ? req.body.payment : 250,
      age: req.body.age,
      profileImage: req.body.profileImage,
    });

    return res.json({ success: true, data: employee });
  } catch (err) {
    console.error('Error creating employee:', err);

    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).send({ success: false, message: 'An employee account with this email already exists.' });
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
    await employee.update({
      name: name || employee.name,
      contactNo: contactNo || employee.contactNo,
      address: address || employee.address,
      workType: workType || employee.workType,
      age: age !== undefined ? age : employee.age,
      profileImage: profileImage !== undefined ? profileImage : employee.profileImage,
    });

    return res.json({ success: true, employee });
  } catch (error) {
    console.error('Error updating employee:', error);
    return res.status(500).send({ success: false, message: 'Error updating employee profile!' });
  }
};