import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('farmer');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/send-otp', { phone });
      setStep(2);
      setError('');
    } catch (err) {
      setError('Failed to send OTP');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const result = await login(phone, otp, role, name);
    if (result.success) {
      navigate(`/${result.role}`);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome</h2>
        
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="10-digit mobile number"
                required
              />
            </div>
            
            {/* For demo registration, normally you'd check if user exists first */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (for new users)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="Full Name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">I am a...</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              >
                <option value="farmer">Farmer</option>
                <option value="vendor">Vendor</option>
                <option value="middleman">Middleman</option>
              </select>
            </div>

            <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 transition">
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
              <p className="text-xs text-gray-500 mb-2">Demo OTP is 123456</p>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none tracking-widest text-center text-lg"
                placeholder="------"
                maxLength={6}
                required
              />
            </div>
            
            <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 transition">
              Verify & Login
            </button>
            <button 
              type="button" 
              onClick={() => setStep(1)}
              className="w-full text-gray-500 text-sm py-2 hover:text-gray-700"
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
