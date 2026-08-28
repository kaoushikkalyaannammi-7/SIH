import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCw, Droplets, Leaf, ShieldCheck, IndianRupee } from 'lucide-react';

const CropRotation = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previousCrop, setPreviousCrop] = useState('Rice');

  useEffect(() => {
    fetchRotationData();
  }, [previousCrop]);

  const fetchRotationData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/rotation?previousCrop=${previousCrop}`);
      setData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Plan Your Next Crop</h1>
        <p className="text-gray-500">Based on your previous crop, soil condition, water availability and upcoming season, these crops are suitable for your field.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 flex gap-8 items-center">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Previous Crop</label>
          <select 
            value={previousCrop}
            onChange={(e) => setPreviousCrop(e.target.value)}
            className="border-gray-300 rounded-lg px-4 py-2 border outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="Rice">Rice</option>
            <option value="Wheat">Wheat</option>
          </select>
        </div>
        
        <div className="flex gap-8 pl-8 border-l border-gray-100">
          <div>
            <p className="text-sm text-gray-500">Current Soil Condition</p>
            <p className="font-semibold text-gray-900 flex items-center gap-2"><Leaf className="w-4 h-4 text-green-600"/> {data?.soilCondition}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Water Availability</p>
            <p className="font-semibold text-gray-900 flex items-center gap-2"><Droplets className="w-4 h-4 text-blue-500"/> {data?.waterAvailability}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Recommended Rotation Crops</h2>
        {data?.recommendations.map((rec, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center relative overflow-hidden">
            {rec.suitability === 'High' && <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>}
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-gray-900">{rec.crop}</h3>
                <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${rec.suitability === 'High' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {rec.suitability} Suitability
                </span>
              </div>
              <p className="text-gray-600 flex items-start gap-2 text-sm mt-3">
                <RefreshCw className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                <span><strong className="text-gray-800">Rotation benefit:</strong> {rec.benefit}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm bg-gray-50 p-4 rounded-lg min-w-[300px]">
              <div>
                <p className="text-gray-500">Water Req.</p>
                <p className="font-semibold text-gray-900 flex items-center gap-1"><Droplets className="w-3 h-3 text-blue-500"/>{rec.waterReq}</p>
              </div>
              <div>
                <p className="text-gray-500">Expected Yield</p>
                <p className="font-semibold text-gray-900">{rec.expectedYield}</p>
              </div>
              <div className="col-span-2 pt-2 border-t border-gray-200 mt-1">
                <p className="text-gray-500">Expected Profit</p>
                <p className="font-bold text-green-700 flex items-center gap-1 text-base"><IndianRupee className="w-4 h-4"/>{rec.expectedProfit}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CropRotation;
