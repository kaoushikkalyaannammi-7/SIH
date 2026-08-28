import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['farmer', 'vendor', 'middleman'],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
