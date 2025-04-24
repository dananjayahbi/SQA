const Register = require('../models/Register');
const jwt = require('jsonwebtoken');

// Register user
exports.registerUser = async (req, res) => {
  const { name, email, gender, dob, address, phone, password, retypePassword } = req.body;

  try {
    // Check if email already exists
    const existingUser = await Register.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Validate password match
    if (password !== retypePassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Create new user
    const user = new Register({
      name,
      email,
      gender,
      dob,
      address,
      phone,
      password,
      retypePassword,
    });

    // Save user (password and retypePassword will be hashed by schema middleware)
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await Register.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};