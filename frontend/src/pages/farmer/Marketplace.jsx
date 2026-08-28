import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IndianRupee, MapPin, Truck, HelpCircle, Trophy } from 'lucide-react';

const Marketplace = () => {
  const [selectedCrop, setSelectedCrop] = useState('Rice');
  const [profits, setProfits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCalculation, setShowCalculation] = useState(false);

  useEffect(() => {
    fetchProfits();
  }, [selectedCrop]);

  const fetchProfits = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/profit/calculate', {
        crop: selectedCrop,
        expectedYieldTonnesPerHa: 3.6,
        areaAcres: 1
      });
      setProfits(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Where should you sell?</h1>
          <p className="text-gray-500">Live prices from registered buyers compared against local mandi rates.</p>
        </div>
        <select 
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
        >
          <option value="Rice">Rice</option>
          <option value="Wheat">Wheat</option>
          <option value="Maize">Maize</option>
          <option value="Mustard">Mustard</option>
        </select>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center"><div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div></div>
      ) : profits.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-gray-200">
          <p className="text-gray-500">No registered buyers are currently offering this crop.</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex justify-between items-center">
            <div>
              <p className="text-green-800 text-sm font-bold uppercase tracking-wider mb-1 flex items-center gap-2"><Trophy className="w-4 h-4" /> Best Option</p>
              <h2 className="text-2xl font-bold text-gray-900">Sell to {profits[0].buyerName}</h2>
              <p className="text-gray-600">Highest estimated net profit after all expenses.</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-green-700">₹{profits[0].netProfit.toLocaleString()}</p>
              <p className="text-sm text-gray-500">per acre</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                  <th className="p-4 font-semibold">Channel</th>
                  <th className="p-4 font-semibold">Buyer</th>
                  <th className="p-4 font-semibold">Price (per Qtl)</th>
                  <th className="p-4 font-semibold hidden md:table-cell">Input Cost</th>
                  <th className="p-4 font-semibold hidden md:table-cell">Transport</th>
                  <th className="p-4 font-semibold">Net Profit</th>
                </tr>
              </thead>
              <tbody>
                {profits.map((p, i) => (
                  <tr key={i} className={`border-b border-gray-50 hover:bg-gray-50 ${i === 0 ? 'bg-green-50/30' : ''}`}>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-bold ${
                        p.channel === 'mandi' ? 'bg-blue-100 text-blue-700' :
                        p.channel === 'vendor' ? 'bg-purple-100 text-purple-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {capitalize(p.channel)}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-gray-900">{p.buyerName}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3"/> {p.distanceKm} km away</p>
                    </td>
                    <td className="p-4 font-bold text-gray-900">₹{p.pricePerQuintal}</td>
                    <td className="p-4 text-red-600 hidden md:table-cell">-₹{p.inputCost.toLocaleString()}</td>
                    <td className="p-4 text-red-600 hidden md:table-cell">-₹{p.transportCost.toLocaleString()}</td>
                    <td className="p-4">
                      <p className="font-bold text-green-700 text-lg">₹{p.netProfit.toLocaleString()}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button 
            onClick={() => setShowCalculation(!showCalculation)}
            className="flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700 transition"
          >
            <HelpCircle className="w-4 h-4" /> How we calculated this
          </button>

          {showCalculation && (
            <div className="bg-gray-800 text-white p-6 rounded-xl text-sm font-mono">
              <p className="text-gray-400 mb-2">// Profit Calculation Formula</p>
              <p>profit = (channel_price × expected_yield_quintals) − input_cost − transport_cost</p>
              <br/>
              <p className="text-gray-400 mb-2">// Details for {profits[0].buyerName}</p>
              <p>revenue: ₹{profits[0].pricePerQuintal} × {profits[0].totalYieldQuintals} qtl = ₹{profits[0].revenue.toLocaleString()}</p>
              <p>input_cost: ₹{profits[0].inputCost.toLocaleString()}</p>
              <p>transport: ₹5/qtl/km × {profits[0].totalYieldQuintals} qtl × {profits[0].distanceKm} km = ₹{profits[0].transportCost.toLocaleString()}</p>
              <br/>
              <p className="text-green-400">net_profit: ₹{profits[0].revenue.toLocaleString()} - ₹{profits[0].inputCost.toLocaleString()} - ₹{profits[0].transportCost.toLocaleString()} = ₹{profits[0].netProfit.toLocaleString()}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
