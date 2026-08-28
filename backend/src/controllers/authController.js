import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';

// Simulated OTP storage
const otpStore = new Map();

export const sendOtp = async (req, res) => {
  const { phone } = req.body;
  
  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  // In a real app, integrate with an SMS gateway.
  // For demo, we use a static OTP '123456'
  const demoOtp = '123456';
  otpStore.set(phone, demoOtp);
  
  res.json({ message: 'OTP sent successfully (Use 123456 for demo)' });
};

export const verifyOtp = async (req, res) => {
  const { phone, otp, role, name } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone and OTP are required' });
  }

  const storedOtp = otpStore.get(phone);
  
  if (storedOtp !== otp) {
    return res.status(401).json({ error: 'Invalid OTP' });
  }
  
  otpStore.delete(phone);

  try {
    let user = await User.findOne({ phone });
    
    // If user doesn't exist, we need role and name to register them
    if (!user) {
      if (!role || !name) {
        return res.status(400).json({ error: 'Role and Name are required for new registration' });
      }
      user = new User({ phone, role, name });
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.json({ 
      token, 
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role
      } 
    });
  } catch (error) {
    console.error('Error in verifyOtp:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
