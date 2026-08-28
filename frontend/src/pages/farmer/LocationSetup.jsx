import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Navigation } from 'lucide-react';
import axios from 'axios';

const LocationSetup = ({ onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('initial'); // 'initial', 'detecting', 'manual', 'done'
  const [manualLocation, setManualLocation] = useState({ state: '', district: '', village: '' });

  const detectLocation = () => {
    setStep('detecting');
    setLoading(true);
    
    // Simulate GPS fetch
    setTimeout(() => {
      // Dummy data for demo
      const demoLocation = {
        state: 'Maharashtra',
        district: 'Pune',
        village: 'Shirur',
        lat: 18.82,
        lng: 74.37
      };
      
      handleLocationFound(demoLocation);
    }, 2000);
  };

  const handleLocationFound = async (locationData) => {
    try {
      // Usually we'd save this to backend
      // await axios.post('/api/farmer/location', locationData)
      localStorage.setItem('farmerLocation', JSON.stringify(locationData));
      setStep('done');
      setTimeout(() => {
        onComplete(locationData);
      }, 1500);
    } catch (err) {
      console.error(err);
      setStep('initial');
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-lg mx-auto mt-10">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Let's understand your farm</h2>
        <p className="text-gray-600">We need your location to get accurate weather and soil data.</p>
      </div>

      {step === 'initial' && (
        <div className="space-y-4">
          <button 
            onClick={detectLocation}
            className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            <Navigation className="w-5 h-5" />
            Detect my location
          </button>
          
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button 
            onClick={() => setStep('manual')}
            className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            <MapPin className="w-5 h-5" />
            Select location manually
          </button>
        </div>
      )}

      {step === 'detecting' && (
        <div className="py-12 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Analyzing your location...</p>
        </div>
      )}

      {step === 'manual' && (
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleLocationFound(manualLocation); }}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input type="text" className="w-full px-4 py-2 border rounded-lg" value={manualLocation.state} onChange={e => setManualLocation({...manualLocation, state: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
            <input type="text" className="w-full px-4 py-2 border rounded-lg" value={manualLocation.district} onChange={e => setManualLocation({...manualLocation, district: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Village</label>
            <input type="text" className="w-full px-4 py-2 border rounded-lg" value={manualLocation.village} onChange={e => setManualLocation({...manualLocation, village: e.target.value})} required />
          </div>
          <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold mt-4">Save Location</button>
        </form>
      )}

      {step === 'done' && (
        <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
          <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h3 className="text-xl font-bold">Farm profile ready</h3>
          <p className="text-gray-500">Location detected successfully.</p>
        </div>
      )}
    </div>
  );
};

export default LocationSetup;
