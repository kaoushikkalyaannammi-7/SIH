import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, TrendingUp, DollarSign } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="text-center max-w-3xl px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Predict your yield. Choose the right crop. Sell at a better price.
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          An AI-powered agricultural decision-support platform for small and marginal farmers.
        </p>
        
        <div className="flex justify-center gap-4 mb-16">
          <Link to="/login" className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition">
            Get Started
          </Link>
          <button className="px-8 py-3 bg-white text-primary-600 border border-primary-200 rounded-lg font-semibold hover:bg-primary-50 transition">
            Explore How It Works
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <Sprout className="w-10 h-10 text-primary-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">01 Predict</h3>
            <p className="text-gray-600">AI-based multi-crop yield forecasting.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <TrendingUp className="w-10 h-10 text-primary-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">02 Plan</h3>
            <p className="text-gray-600">Crop rotation and recommendations based on soil, weather and season.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <DollarSign className="w-10 h-10 text-primary-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">03 Sell</h3>
            <p className="text-gray-600">Compare mandi, vendor and middleman prices and estimate net profit.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
