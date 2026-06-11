const User = require('../models/User');
const jwt = require('jsonwebtoken');
const axios = require('axios');

// 🔥 Function to send data to SolutionSync
const sendToSolutionSync = async (data) => {
  try {
    const url = process.env.SOLUTIONSYNC_URL || 'http://localhost:3000/api/analyze';
    // Added a 3-second timeout to avoid hanging the process if SolutionSync is slow
    await axios.post(url, data, { timeout: 3000 });
    console.log('✅ Sent to SolutionSync:', data.event);
  } catch (error) {
    console.error('❌ Error sending to SolutionSync:', error.message);
  }
};


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const usernameTaken = await User.findOne({ username });
    if (usernameTaken) {
      return res.status(400).json({ message: 'Username is already taken. Please choose a different one.' });
    }

    const emailTaken = await User.findOne({ email });
    if (emailTaken) {
      return res.status(400).json({ message: 'An account with this email already exists. Please log in instead.' });
    }

    const user = await User.create({
      username,
      email,
      password,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
    });

    if (user) {
      console.log(`👤 New user registered: ${username}`);
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        token: generateToken(user._id)
      });

      // 🔥 Send signup event to SolutionSync
      sendToSolutionSync({
        event: 'user_signup',
        user: username,
        email: email
      });

    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && (await user.comparePassword(password))) {
      console.log(`🔑 User logged in: ${username}`);
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        token: generateToken(user._id)
      });

      // 🔥 Send login event to SolutionSync
      sendToSolutionSync({
        event: 'user_login',
        user: username
      });

    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { registerUser, loginUser, getMe };
