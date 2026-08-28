import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sprout, TrendingUp, AlertCircle, CheckCircle2, ChevronRight, XCircle } from 'lucide-react';

const CropForecast = ({ location }) => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [explanation, setExplanation] = useState(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        // Send demo data that ML service expects
        const reqData = {
          state: location.state,
          district: location.district,
          season: 'Kharif'
        };
        const res = await axios.post(`http://localhost:5000/api/ml/predict`, reqData);
        setPredictions(res.data.predictions);
      } catch (error) {
        console.error("Error fetching predictions", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (location) fetchPredictions();
  }, [location]);

  const handleExplain = async (crop) => {
    setSelectedCrop(crop);
    setExplanation(null); // reset while loading
    try {
        const reqData = {
            state: location.state,
            district: location.district,
            crop: crop.crop,
            season: 'Kharif'
          };
      const res = await axios.post(`http://localhost:5000/api/ml/explain`, reqData);
      setExplanation(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getConfidenceBadge = (confidence) => {
    switch(confidence) {
      case 'HIGH':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">High Confidence</span>;
      case 'MEDIUM':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">Medium Confidence</span>;
      case 'LOW':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">Low Confidence</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">What can I grow?</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 h-48"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">What can I grow?</h1>
          <p className="text-gray-500">AI-forecasted yield for suitable crops in your area.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {predictions.map((pred, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 rounded-bl-full -z-10"></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
                  <Sprout className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{pred.crop}</h3>
                  <div className="mt-1">{getConfidenceBadge(pred.confidence)}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 my-6">
              <div>
                <p className="text-sm text-gray-500 font-medium">Expected Yield</p>
                <p className="text-2xl font-bold text-gray-900">{pred.expected_yield} <span className="text-sm font-normal text-gray-500">t/ha</span></p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Likely Range</p>
                <p className="text-lg font-semibold text-gray-700">{pred.lower_bound} – {pred.upper_bound} <span className="text-xs font-normal text-gray-500">t/ha</span></p>
              </div>
            </div>

            <button 
              onClick={() => handleExplain(pred)}
              className="w-full flex items-center justify-center gap-2 py-2 text-primary-600 font-medium border border-primary-200 rounded-lg hover:bg-primary-50 transition"
            >
              Why this prediction? <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Explanation Modal / Bottom Sheet */}
      {selectedCrop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl relative">
            <button 
              onClick={() => setSelectedCrop(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            
            <h2 className="text-xl font-bold mb-1">Understanding {selectedCrop.crop} Forecast</h2>
            <p className="text-gray-500 text-sm mb-6">Here are the key factors influencing this prediction.</p>
            
            {!explanation ? (
               <div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div></div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="flex items-center gap-2 text-green-700 font-semibold mb-3">
                    <CheckCircle2 className="w-5 h-5" /> Positive Factors
                  </h3>
                  <ul className="space-y-2">
                    {explanation.factors.positive.map((factor, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-green-500 mt-0.5">✓</span> {factor}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="flex items-center gap-2 text-red-700 font-semibold mb-3">
                    <XCircle className="w-5 h-5" /> Negative Factors
                  </h3>
                  <ul className="space-y-2">
                    {explanation.factors.negative.map((factor, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-red-500 mt-0.5">⚠</span> {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CropForecast;
