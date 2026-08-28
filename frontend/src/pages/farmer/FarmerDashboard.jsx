import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import LocationSetup from './LocationSetup';
import WeatherSoil from './WeatherSoil';
import CropForecast from './CropForecast';
import CropRotation from './CropRotation';
import Marketplace from './Marketplace';
import VoiceAssistant from '../../components/VoiceAssistant';
import { LogOut, Home, Sprout, CloudRain, DollarSign, LayoutDashboard } from 'lucide-react';

const MainDashboard = ({ location }) => {
  const { user } = useAuth();
  const [topCrops, setTopCrops] = useState([]);
  
  useEffect(() => {
    // Fetch Top 3 ranked crops from backend which does ML + Profit ranking
    const fetchTop = async () => {
      try {
        const reqData = {
          state: location?.state,
          district: location?.district,
          season: 'Kharif'
        };
        const res = await axios.post('http://localhost:5000/api/recommendations', reqData);
        setTopCrops(res.data);
      } catch(err) {
        console.error(err);
      }
    };
    if (location) fetchTop();
  }, [location]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Good morning, {user?.name}</h1>
          <p className="text-gray-500">Location: {location?.village}, {location?.district}, {location?.state}</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex gap-8">
        <div>
          <p className="text-sm text-gray-500 font-medium">Weather</p>
          <div className="text-3xl font-bold text-gray-900">28°C</div>
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Rainfall</p>
          <div className="text-xl font-semibold text-blue-600">Expected in 3 days</div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 pt-4">Your best crop options</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topCrops.map((c, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
            <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold shadow-md">
              #{i+1}
            </div>
            <div className="flex items-center gap-3 mb-4 mt-2">
              <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
                <Sprout className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{c.crop}</h3>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Expected Yield</span>
                <span className="font-semibold">{c.yield} t/ha</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Estimated Prod.</span>
                <span className="font-semibold">{c.prod} tonnes</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Best Channel</span>
                <span className="font-semibold text-blue-600">{c.channel}: {c.buyer}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                <span className="text-gray-500 font-medium">Est. Net Profit</span>
                <span className="font-bold text-green-700">₹{c.profit.toLocaleString()} / acre</span>
              </div>
            </div>
            
            <Link to="/farmer/forecast" className="block text-center w-full py-2 bg-gray-50 text-primary-600 font-medium rounded-lg hover:bg-gray-100 transition">
              View Recommendation
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

const FarmerDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('farmerLocation');
    if (saved) {
      setLocation(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!location) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <LocationSetup onComplete={(loc) => setLocation(loc)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 px-4 py-6 flex flex-col">
        <div className="flex items-center gap-2 px-2 mb-10 text-primary-600 font-bold text-xl">
          <Sprout className="w-6 h-6" />
          AgriSmart
        </div>
        
        <nav className="flex-1 space-y-1">
          <Link to="/farmer" className="flex items-center gap-3 px-3 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link to="/farmer/forecast" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium">
            <Sprout className="w-5 h-5" /> What can I grow?
          </Link>
          <Link to="/farmer/rotation" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium">
            <Home className="w-5 h-5" /> Crop Rotation
          </Link>
          <Link to="/farmer/weather" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium">
            <CloudRain className="w-5 h-5" /> Weather & Soil
          </Link>
          <Link to="/farmer/marketplace" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium">
            <DollarSign className="w-5 h-5" /> Marketplace
          </Link>
        </nav>

        <button onClick={logout} className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium w-full text-left mt-auto">
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <Routes>
          <Route path="/" element={<MainDashboard location={location} />} />
          <Route path="/weather" element={<WeatherSoil location={location} />} />
          <Route path="/forecast" element={<CropForecast location={location} />} />
          <Route path="/rotation" element={<CropRotation />} />
          <Route path="/marketplace" element={<Marketplace />} />
          {/* We'll add other routes here */}
        </Routes>
      </div>
      
      <VoiceAssistant />
    </div>
  );
};

export default FarmerDashboard;
