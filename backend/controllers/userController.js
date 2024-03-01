const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: 'email', message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ email: newUser.email }, process.env.JWT_SECRET);
    res.status(201).json({ token, email, name: newUser.name, id: newUser._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ error: 'Invalid email or password', emailErr: true });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ error: 'Invalid email or password', passwordErr: true });
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);

    res.json({
      token,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateNamePassword = async (req, res) => {
  const { userId } = req.params;
  const { name, oldPassword, newPassword } = req.body;
  try {
    // Find the user by ID
    let user = await User.findById(userId);
    console.log('user', user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify the old password
    console.log('oldPassword', oldPassword);
    if (oldPassword !== '' && newPassword !== '') {
      const passwordMatch = await bcrypt.compare(oldPassword, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid old password' });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the name and password
      user.password = hashedPassword;
    }
    user.name = name;

    console.log(' user', user);
    // Save the updated user
    await user.save();

    // Return success message
    res
      .status(200)
      .json({ message: 'User name and password updated successfully' });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
module.exports = { registerUser, loginUser, updateNamePassword };
