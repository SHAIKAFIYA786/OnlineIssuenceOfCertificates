const User = require('../models/User'); // Ensure this is your User model

// Handle user login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).send('Invalid email or password');
    }
    req.session.userId = user._id; // Save user ID in session
    res.redirect('/dashboard'); // Redirect to dashboard on successful login
  } catch (error) {
    res.status(500).send('Server error: ' + error.message);
  }
};

// Handle user registration
exports.register = async (req, res) => {
  const { name, username, email, password, address, phone } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).send('Username or email already exists');
    }
    const newUser = new User({ name, username, email, password, aadhaar, address, phone });
    await newUser.save();
    res.redirect('/auth/login');
  } catch (error) {
    res.status(500).send('Server error: ' + error.message);
  }
};