import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Cloud, Droplets, Thermometer, Wind, AlertTriangle, Info } from 'lucide-react';

const WeatherSoil = ({ location }) => {
  const [weather, setWeather] = useState(null);
  const [soil, setSoil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [weatherRes, soilRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/data/weather`, { params: location }),
          axios.get(`http://localhost:5000/api/data/soil`, { params: location })
        ]);
        setWeather(weatherRes.data);
        setSoil(soilRes.data);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (location) fetchData();
  }, [location]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-200 rounded-xl"></div>
          <div className="h-64 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Weather & Soil Conditions</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weather Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Cloud className="text-blue-500 w-6 h-6" />
            <h2 className="text-xl font-bold">Local Weather</h2>
          </div>
          
          {weather ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-5xl font-bold text-gray-900">{weather.current.temp}°C</div>
                  <div className="text-gray-500 text-lg mt-1">{weather.current.description}</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Droplets className="w-4 h-4 text-blue-400" />
                    <span>Humidity: {weather.current.humidity}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Cloud className="w-4 h-4 text-gray-400" />
                    <span>Rainfall: {weather.current.rainfall} mm</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-blue-800 text-sm leading-relaxed">{weather.forecast.summary}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">We couldn't fetch weather data right now. Using the latest available data.</p>
          )}
        </div>

        {/* Soil Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"></path></svg>
            <h2 className="text-xl font-bold">Soil Conditions</h2>
          </div>
          
          {soil ? (
            <div className="space-y-4">
              <div>
                <span className="text-gray-500 text-sm">Soil Type</span>
                <p className="font-semibold text-lg text-gray-900">{soil.type}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-500 text-xs uppercase font-bold tracking-wider">pH Level</span>
                  <p className="font-semibold text-gray-900 mt-1">{soil.ph}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-500 text-xs uppercase font-bold tracking-wider">Nitrogen (N)</span>
                  <p className={`font-semibold mt-1 ${soil.nitrogen === 'Low' ? 'text-red-600' : 'text-gray-900'}`}>{soil.nitrogen}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-500 text-xs uppercase font-bold tracking-wider">Phosphorus (P)</span>
                  <p className="font-semibold text-gray-900 mt-1">{soil.phosphorus}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-500 text-xs uppercase font-bold tracking-wider">Potassium (K)</span>
                  <p className="font-semibold text-gray-900 mt-1">{soil.potassium}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded mt-4">
                <Info className="w-4 h-4 flex-shrink-0" />
                <span>{soil.note}</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Detailed soil data isn't available for this location. Showing district-level estimates.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherSoil;
