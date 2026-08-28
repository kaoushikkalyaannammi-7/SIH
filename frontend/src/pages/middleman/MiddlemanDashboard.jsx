import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { LogOut, Tag, TrendingUp, History } from 'lucide-react';

const MiddlemanDashboard = () => {
  const { user, logout } = useAuth();
  const [offers, setOffers] = useState([]);
  const [formData, setFormData] = useState({
    crop: 'Rice',
    pricePerQuintal: '',
    location: 'Village Collection Point'
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/offers?buyerType=${user.role}`);
      setOffers(res.data.filter(o => o.buyerName === user.name));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/offers', {
        ...formData,
        buyerName: user.name,
        buyerType: user.role
      });
      setMessage('Offer published successfully!');
      setFormData({ ...formData, pricePerQuintal: '' });
      fetchOffers();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error(error);
      setMessage('Failed to publish offer.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 px-4 py-6 flex flex-col">
        <div className="flex items-center gap-2 px-2 mb-10 text-primary-600 font-bold text-xl uppercase tracking-wider">
          {user.role} Portal
        </div>
        
        <nav className="flex-1 space-y-1">
          <button className="flex items-center gap-3 px-3 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium w-full text-left">
            <TrendingUp className="w-5 h-5" /> Active Offers
          </button>
          <button className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium w-full text-left">
            <History className="w-5 h-5" /> Price History
          </button>
        </nav>

        <button onClick={logout} className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium w-full text-left mt-auto">
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>

      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
          <p className="text-gray-500">Manage your buying prices to attract farmers.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary-500" /> Enter Buy Price
              </h2>
              {message && <div className="mb-4 p-2 bg-green-50 text-green-700 rounded text-sm">{message}</div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Crop</label>
                  <select 
                    value={formData.crop}
                    onChange={(e) => setFormData({...formData, crop: e.target.value})}
                    className="w-full border-gray-300 rounded-lg px-4 py-2 border outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Rice">Rice</option>
                    <option value="Wheat">Wheat</option>
                    <option value="Maize">Maize</option>
                    <option value="Mustard">Mustard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹ per Quintal)</label>
                  <input 
                    type="number"
                    required
                    value={formData.pricePerQuintal}
                    onChange={(e) => setFormData({...formData, pricePerQuintal: e.target.value})}
                    className="w-full border-gray-300 rounded-lg px-4 py-2 border outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g. 2450"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location / Point</label>
                  <input 
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full border-gray-300 rounded-lg px-4 py-2 border outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700">
                  Publish Offer
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold">Your Active Offers</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {offers.length === 0 ? (
                  <p className="p-6 text-gray-500 text-center">No active offers.</p>
                ) : (
                  offers.map(offer => (
                    <div key={offer._id} className="p-6 flex justify-between items-center hover:bg-gray-50">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{offer.crop}</h3>
                        <p className="text-sm text-gray-500">{offer.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">₹{offer.pricePerQuintal}</p>
                        <p className="text-xs text-gray-400">per quintal</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiddlemanDashboard;
